# Root Terraform configuration — wires together S3, ECR, networking, ECS, and EKS modules

terraform {
  required_version = ">= 1.6.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.6"
    }
  }

  # Remote state is stored in S3; bootstrapped once via scripts/bootstrap-tfstate.sh
  backend "s3" {
    bucket         = "shopsmart-tfstate-bucket"
    key            = "shopsmart/terraform.tfstate"
    region         = "us-east-1"
    encrypt        = true
    dynamodb_table = "shopsmart-tfstate-lock"
  }
}

provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Project     = "ShopSmart"
      Environment = var.environment
      ManagedBy   = "Terraform"
    }
  }
}

data "aws_availability_zones" "available" {
  state = "available"
}

data "aws_caller_identity" "current" {}

# Random hex suffix ensures globally unique S3 bucket names
resource "random_id" "suffix" {
  byte_length = 4
}

module "s3" {
  source      = "./modules/s3"
  bucket_name = "shopsmart-artifacts-${var.environment}-${random_id.suffix.hex}"
  environment = var.environment
}

module "ecr" {
  source      = "./modules/ecr"
  repo_name   = "shopsmart-backend"
  environment = var.environment
}

module "networking" {
  source             = "./modules/networking"
  environment        = var.environment
  availability_zones = slice(data.aws_availability_zones.available.names, 0, 2)
  vpc_cidr           = var.vpc_cidr
}

module "ecs" {
  source             = "./modules/ecs"
  environment        = var.environment
  aws_region         = var.aws_region
  account_id         = data.aws_caller_identity.current.account_id
  ecr_repository_url = module.ecr.repository_url
  image_tag          = var.image_tag
  vpc_id             = module.networking.vpc_id
  public_subnet_ids  = module.networking.public_subnet_ids
  private_subnet_ids = module.networking.private_subnet_ids
  container_port     = var.container_port
  desired_count      = var.desired_count
  task_cpu           = var.task_cpu
  task_memory        = var.task_memory
}

module "eks" {
  source             = "./modules/eks"
  environment        = var.environment
  vpc_id             = module.networking.vpc_id
  public_subnet_ids  = module.networking.public_subnet_ids
  private_subnet_ids = module.networking.private_subnet_ids
}

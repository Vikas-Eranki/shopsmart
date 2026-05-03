# Input variables for the root Terraform configuration

variable "aws_region" {
  description = "AWS region to deploy resources"
  type        = string
  default     = "us-east-1"
}

variable "environment" {
  description = "Deployment environment (dev | staging | prod)"
  type        = string
  default     = "prod"

  validation {
    condition     = contains(["dev", "staging", "prod"], var.environment)
    error_message = "environment must be one of: dev, staging, prod"
  }
}

variable "vpc_cidr" {
  description = "CIDR block for the VPC"
  type        = string
  default     = "10.0.0.0/16"
}

variable "container_port" {
  description = "Port the container exposes"
  type        = number
  default     = 5001
}

variable "image_tag" {
  description = "Docker image tag to deploy (typically the Git SHA)"
  type        = string
  default     = "latest"
}

variable "desired_count" {
  description = "Number of ECS task replicas"
  type        = number
  default     = 2
}

variable "task_cpu" {
  description = "Fargate task vCPU units (256 = 0.25 vCPU)"
  type        = number
  default     = 256
}

variable "task_memory" {
  description = "Fargate task memory in MiB"
  type        = number
  default     = 512
}

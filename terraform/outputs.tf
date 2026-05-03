# Root outputs exposed to CI/CD pipelines via terraform output -raw

output "ecr_repository_url" {
  description = "ECR repository URL used by pipeline-ecs to push and pull images"
  value       = module.ecr.repository_url
}

output "ecs_cluster_name" {
  description = "ECS cluster name used by pipeline-ecs"
  value       = module.ecs.cluster_name
}

output "ecs_service_name" {
  description = "ECS service name used by pipeline-ecs"
  value       = module.ecs.service_name
}

output "alb_dns_name" {
  description = "Application Load Balancer DNS (ECS public endpoint)"
  value       = module.ecs.alb_dns_name
}

output "eks_cluster_name" {
  description = "EKS cluster name used by pipeline-eks to configure kubeconfig"
  value       = module.eks.cluster_name
}

output "eks_cluster_endpoint" {
  description = "EKS API server endpoint"
  value       = module.eks.cluster_endpoint
}

output "s3_artifact_bucket" {
  description = "S3 bucket name created by the S3 module"
  value       = module.s3.bucket_name
}

output "vpc_id" {
  description = "VPC ID"
  value       = module.networking.vpc_id
}

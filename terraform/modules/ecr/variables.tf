variable "repo_name" {
  description = "ECR repository name (environment suffix will be appended)"
  type        = string
}

variable "environment" {
  description = "Deployment environment"
  type        = string
}

variable "environment" {
  description = "Deployment environment (dev | staging | prod)"
  type        = string
}

variable "vpc_id" {
  description = "VPC ID from the networking module"
  type        = string
}

variable "public_subnet_ids" {
  description = "Public subnet IDs (used for cluster endpoint access)"
  type        = list(string)
}

variable "private_subnet_ids" {
  description = "Private subnet IDs for worker nodes"
  type        = list(string)
}

variable "cluster_version" {
  description = "Kubernetes version for the EKS cluster"
  type        = string
  default     = "1.29"
}

variable "node_instance_type" {
  description = "EC2 instance type for worker nodes (t3.small fits AWS Academy)"
  type        = string
  default     = "t3.small"
}

variable "node_desired_count" {
  description = "Desired number of worker nodes"
  type        = number
  default     = 2
}

variable "node_max_count" {
  description = "Maximum number of worker nodes (for scaling)"
  type        = number
  default     = 4
}

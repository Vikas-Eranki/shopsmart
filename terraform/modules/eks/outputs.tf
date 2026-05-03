output "cluster_name" {
  description = "EKS cluster name used by pipeline-eks to configure kubeconfig"
  value       = aws_eks_cluster.this.name
}

output "cluster_endpoint" {
  description = "EKS cluster API server endpoint"
  value       = aws_eks_cluster.this.endpoint
}

output "cluster_ca_certificate" {
  description = "Base64-encoded CA certificate for the EKS cluster"
  value       = aws_eks_cluster.this.certificate_authority[0].data
  sensitive   = true
}

output "node_group_arn" {
  description = "ARN of the managed node group"
  value       = aws_eks_node_group.this.arn
}

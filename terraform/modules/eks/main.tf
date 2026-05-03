# EKS module: IAM roles, security groups, EKS cluster, and managed node group

# AWS Academy: use the pre-existing LabRole instead of creating custom IAM roles
data "aws_iam_role" "lab_role" {
  name = "LabRole"
}



resource "aws_security_group" "eks_cluster" {
  name        = "shopsmart-eks-cluster-sg-${var.environment}"
  description = "EKS cluster control plane security group"
  vpc_id      = var.vpc_id

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = { Name = "shopsmart-eks-cluster-sg-${var.environment}" }
}

resource "aws_security_group_rule" "eks_cluster_ingress_nodes" {
  type                     = "ingress"
  from_port                = 443
  to_port                  = 443
  protocol                 = "tcp"
  security_group_id        = aws_security_group.eks_cluster.id
  source_security_group_id = aws_security_group.eks_nodes.id
  description              = "Allow nodes to reach cluster API"
}

resource "aws_security_group" "eks_nodes" {
  name        = "shopsmart-eks-nodes-sg-${var.environment}"
  description = "EKS worker node security group"
  vpc_id      = var.vpc_id

  # Allow all inter-node traffic
  ingress {
    from_port = 0
    to_port   = 0
    protocol  = "-1"
    self      = true
  }

  # Allow control plane to communicate with nodes on ephemeral ports
  ingress {
    from_port       = 1025
    to_port         = 65535
    protocol        = "tcp"
    security_groups = [aws_security_group.eks_cluster.id]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = { Name = "shopsmart-eks-nodes-sg-${var.environment}" }
}

resource "aws_eks_cluster" "this" {
  name     = "shopsmart-eks-${var.environment}"
  role_arn = data.aws_iam_role.lab_role.arn
  version  = var.cluster_version

  vpc_config {
    subnet_ids              = concat(var.public_subnet_ids, var.private_subnet_ids)
    security_group_ids      = [aws_security_group.eks_cluster.id]
    endpoint_private_access = true
    # Public access is required for GitHub Actions runners in AWS Academy
    endpoint_public_access  = true
  }

  enabled_cluster_log_types = ["api", "audit", "authenticator"]

  depends_on = []
}

# NOTE: aws_eks_node_group is managed by pipeline-eks.yml (not Terraform).
# AWS Academy blocks the managed node group AMI for EKS 1.29 when created via Terraform.

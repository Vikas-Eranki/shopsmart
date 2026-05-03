# ─────────────────────────────────────────────────────────────
# terraform.tfvars  — override defaults for production
# ─────────────────────────────────────────────────────────────
aws_region     = "us-east-1"
environment    = "prod"
vpc_cidr       = "10.0.0.0/16"
container_port = 5001
desired_count  = 2        # Keeps 2 tasks running at all times
task_cpu       = 256      # 0.25 vCPU — fits AWS Academy free tier
task_memory    = 512      # 512 MiB
# image_tag is injected at runtime by CI/CD (git SHA)

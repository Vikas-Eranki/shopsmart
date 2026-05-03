output "cluster_name"  { value = aws_ecs_cluster.this.name }
output "service_name"  { value = "shopsmart-service-${var.environment}" }
output "alb_dns_name"  { value = aws_lb.this.dns_name }
output "alb_arn"       { value = aws_lb.this.arn }
output "task_def_arn"  { value = aws_ecs_task_definition.this.arn }

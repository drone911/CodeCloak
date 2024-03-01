provider "aws" {
  region = "us-east-1"
}

resource "aws_ecs_cluster" "codecloak_backend_cluster" {
  name = "CodeCloak Cluster"
}

resource "aws_ecs_task_definition" "backend_task" {
  family                   = "codecloak_backend_task"
  cpu                      = "256"
  memory                   = "512"
  network_mode             = "awsvpc"
  container_definitions   = jsonencode([
    {
      name            = "codecloak-backend"
      image           = "docker.io/drone911/codecloak-backend:1.0.0"
      memory          = 1024
      cpu             = 512
      essential       = true
      portMappings    = [
        {
          containerPort = 5000
          protocol      = "tcp"
        }
      ]
    }
  ])
}

resource "aws_security_group" "ecs_sg" {
  name        = "ecs_sg"
  description = "Security group for ECS service"
  vpc_id      = "your-vpc-id"

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_lb" "ecs_lb" {
  name               = "ecs-lb"
  internal           = false
  load_balancer_type = "application"
  subnets            = ["subnet-xx"]

  security_groups = [aws_security_group.ecs_sg.id]

  enable_deletion_protection = false
}

resource "aws_lb_listener" "https" {
  load_balancer_arn = aws_lb.ecs_lb.arn
  port              = "443"
  protocol          = "HTTPS"
  ssl_policy        = "ELBSecurityPolicy-2016-08"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.codecloak_target_group.arn
  }
}

resource "aws_lb_target_group" "codecloak_target_group" {
  name     = "codecloak-target-group"
  port     = 5000
  protocol = "HTTP"
  vpc_id   = "vpc-id"

  health_check {
    path                = "/"
    port                = "traffic-port"
    protocol            = "HTTP"
    matcher             = "200"
    timeout             = 10
    interval            = 30
    unhealthy_threshold = 2
    healthy_threshold   = 2
  }
}

resource "aws_ecs_service" "codecloak_ecs" {
  name            = "CodeCloak backend"
  cluster         = aws_ecs_cluster.codecloak_backend_cluster.id
  task_definition = aws_ecs_task_definition.backend_task.arn
  launch_type     = "FARGATE"
  network_configuration {
    subnets          = ["subnet-xx"]  
    security_groups  = [aws_security_group.ecs_sg.id]
    assign_public_ip = true
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.codecloak_target_group.arn
    container_name   = "codecloak-backend"
    container_port   = 5000
  }
}
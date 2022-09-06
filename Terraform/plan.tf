terraform {
required_version = ">= 0.14.0"
  required_providers {
    openstack = {
      source  = "terraform-provider-openstack/openstack"
      version = "~> 1.35.0"
    }
  }
}

  resource "openstack_networking_floatingip_v2" "floating_ip_1" {
    pool = var.pool
  }

  resource "openstack_compute_secgroup_v2" "security_group" {
    name        = var.security_name
    description = var.security_description
    rule {
      from_port   = 22
      to_port     = 22
      ip_protocol = "tcp"
      cidr        = "0.0.0.0/0"
    }
    rule {
      from_port   = 8080
      to_port     = 8080
      ip_protocol = "tcp"
      cidr        = "0.0.0.0/0"
    }
    rule {
      from_port   = 8081
      to_port     = 8081
      ip_protocol = "tcp"
      cidr        = "0.0.0.0/0"
    }
  }
  resource "openstack_compute_instance_v2" "instance_1" {
    name            = var.name1
    image_name      = var.image
    flavor_name     = var.flavor
    security_groups = [openstack_compute_secgroup_v2.security_group.name]
    key_pair        = var.keypair
    user_data       = file(var.server1_script)
    network {
      name = var.network
    }
  }
  resource "openstack_networking_floatingip_v2" "floating_ip_1" {
    floating_ip = "10.72.99.249"
    instance_id = openstack_compute_instance_v2.instance_1.id
  }

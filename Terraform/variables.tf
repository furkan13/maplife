variable "flavor" { default = "m1.large" }
variable "image" { default = "Debian Buster 10.11.1 20211029" }
variable "name1" { default = "maplife" }

variable "keypair" { default = "furkan" } # you may need to change this
variable "network" { default = "furkan_network" }   # you need to change this

variable "pool" { default = "cscloud_private_floating" }
variable "server1_script" { default = "./furkanserver.sh" }
variable "security_description" { default = "Terraform security group" }
variable "security_name" { default = "tf_securityMat" }

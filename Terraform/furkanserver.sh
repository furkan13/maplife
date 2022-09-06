#!/bin/bash

# Terraform
# login as user centos, password authentication is via private key
# e.g. ssh -i cloud.key centos@<FLOATING_IP_ADDRESS>
# terraform runs cloud-init scripts as root user, remember to "cd root" on the VM before depositing any files on the machine

cd /home/debian
echo in directory $PWD





#!/bin/bash

# Terraform
# login as user centos, password authentication is via private key
# e.g. ssh -i cloud.key centos@<FLOATING_IP_ADDRESS>
# terraform runs cloud-init scripts as root user, remember to "cd root" on the VM before depositing any files on the machine

echo "cd to root directory..."
cd root

echo "whoami..."
whoami

echo "pwd..."
pwd

sudo apt update

sudo apt install wget -y
sudo apt install unzip -y



 sudo apt install openjdk-11-jdk -y
 sudo apt install git -y
sudo apt install mariadb-server -y
sudo systemctl start mariadb
sudo systemctl status mariadb
sudo systemctl enable mariadb

mysql -u root -e "create database maplife;"


mysql -u root -e "set password for root@'localhost'=PASSWORD('comsc');"

sudo systemctl restart mariadb


sudo apt install maven -y


touch ~/.ssh/known_hosts
sudo ssh-keyscan git.cardiff.ac.uk >> ~/.ssh/known_hosts
chmod 644 .ssh/known_hosts










cat << `EOF` >> maplife.key
-----BEGIN OPENSSH PRIVATE KEY-----
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
-----END OPENSSH PRIVATE KEY-----
`EOF`


sudo chmod 400 maplife.key


sudo ssh-agent bash -c 'ssh-add maplife.key; git clone -b production git@git.cardiff.ac.uk:c21045768/project_44b_party_watch.git' -yes

#mvn -f office_desk_test/ compile package
#java -jar office_desk_test/target/desk_booking-0.0.1-SNAPSHOT.jar
cd project_44b_party_watch
sudo mvn clean install
sudo mvn spring-boot:run

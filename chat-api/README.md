# 💬 Chat API Backend

This project is a backend service for a chat application capable of sending and receiving text messages using WebSocket communication and message queues.

## Technologies Used
-	Node.js
-	NestJS
-	Socket.io
-	RabbitMQ
-	Docker
-	Docker Compose
-	TypeScript

## Prerequisites
-  Docker and Docker Compose installed
-  Node.js and npm installed

## Get Started
1.	Clone the repository:

      ```bash
      git clone https://github.com/arjunsumarlan/wegowhere.git
      cd wegowhere/chat-api/
      ```

2. Install dependencies

   ```bash
   yarn install
   ```

3. Environtment Variables

   Create a `.env` file in the root directory of your project and add the following environment variables:

   ```env
   RABBITMQ_URL=amqp://rabbitmq:5672
   PORT=3003
   ```

4. Docker Setup

   Ensure Docker and Docker Compose are installed on your machine.

5. Build and Run Docker Containers

   ```bash
    docker-compose up --build
   ```

   This will start the RabbitMQ service and the NestJS application.

6. RabbitMQ Management

   You can access the RabbitMQ Management UI at http://localhost:15672. The default username and password are `guest` and `guest`.

## Usage

### WebSocket API

The WebSocket server listens on port `5001`. You can connect to the WebSocket server and send messages using a WebSocket client.

### Test WebSocket Connection

## Project Structure

```
.
├── src
│   ├── app.module.ts
│   ├── chat
│   │   ├── chat.gateway.ts
│   │   ├── chat.module.ts
│   │   └── chat.service.ts
│   └── main.ts
├── test
│   └── app.e2e-spec.ts
├── .env
├── Dockerfile
├── docker-compose.yml
├── main.tf
└── package.json
```

### Main Files
-	`src/main.ts`: Entry point of the application.
-	`src/app.module.ts`: Root module of the application.
-	`src/chat/chat.gateway.ts`: Handles WebSocket communication.
-	`src/chat/chat.service.ts`: Manages message queue interactions.
-	`Dockerfile`: Configuration for Docker container.
-	`docker-compose.yml`: Setup for Docker services including RabbitMQ.
-	`test/chat.gateway.spec.ts`: Unit tests for the WebSocket gateway.

## Running Tests

### Unit Tests

To run the unit tests, use the following command:
```bash
yarn test
```

### End-to-End (e2e) Tests

To run the e2e tests, use the following command:
```bash
yarn test:e2e
```

## Infrastructure Deployment with Terraform

The project includes a Terraform configuration file (`main.tf`) to provision an AWS EC2 instance for running the chat API.

### Prerequisites

Ensure that Terraform is installed on your system. You can install Terraform using the following instructions:

**On macOS**

-	Using Homebrew:

    ```bash
    brew install terraform
    ```

**On Ubuntu/Debian**

-  Using APT:

   ```bash
   sudo apt-get update && sudo apt-get install -y gnupg software-properties-common
   wget -O- https://apt.releases.hashicorp.com/gpg | gpg --dearmor > /usr/share/keyrings/hashicorp-archive-keyring.gpg
   echo "deb [signed-by=/usr/share/keyrings/hashicorp-archive-keyring.gpg] https://apt.releases.hashicorp.com $(lsb_release -cs) main" | sudo tee /etc/apt/sources.list.d/hashicorp.list
   sudo apt-get update && sudo apt-get install terraform
   ```

**On Windows**

- Using Chocolatey:

   ```bash
   choco install terraform
   ```


### Terraform Configuration

**main.tf**

```hcl
provider "aws" {
  region = "us-west-2"
}

resource "aws_instance" "chat_api" {
  ami           = "ami-0c55b159cbfafe1f0"
  instance_type = "t2.micro"

  tags = {
    Name = "chat-api"
  }
}
```

### Explanation of Terraform Configuration

-   **provider "aws"**: Configures the AWS provider with the specified region `(us-west-2)`.
-	**resource "aws_instance" "chat_api"**: Defines an AWS EC2 instance with the following attributes:
    -	**ami**: Specifies the Amazon Machine Image (AMI) ID (`ami-0c55b159cbfafe1f0`), which corresponds to an Amazon Linux 2 image.
    -	**instance_type**: Sets the instance type to `t2.micro`, suitable for low-traffic applications and covered under the AWS free tier.
    -	**tags**: Adds tags to the instance for identification, in this case tagging it with the name `"chat-api"`.

### Deploying with Terraform

1.	Initialize Terraform:
    ```bash
    terraform init
    ```
2.  Plan the Deployment:
    ```bash
    terraform plan
    ```
3.  Apply the Deployment:
    ```bash
    terraform apply
    ```
    Confirm the apply step when prompted.

---

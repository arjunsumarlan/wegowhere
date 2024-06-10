import { Injectable, OnModuleInit } from '@nestjs/common';
import * as amqp from 'amqplib';
import { Logger } from '@nestjs/common';

@Injectable()
export class ChatService implements OnModuleInit {
  private readonly queue = 'messages';
  private readonly logger = new Logger(ChatService.name);

  async onModuleInit() {
    await this.testRabbitMQConnection();
    await this.receiveMessages();
  }

  async testRabbitMQConnection() {
    try {
      const connection = await amqp.connect(process.env.RABBITMQ_URL);
      this.logger.log('Successfully connected to RabbitMQ');
      await connection.close();
    } catch (error) {
      this.logger.error('Failed to connect to RabbitMQ', error);
    }
  }

  async sendMessage(message: string) {
    const connection = await amqp.connect(process.env.RABBITMQ_URL);
    const channel = await connection.createChannel();
    await channel.assertQueue(this.queue);
    await channel.sendToQueue(this.queue, Buffer.from(message));
    await channel.close();
    await connection.close();
  }

  async receiveMessages() {
    const connection = await amqp.connect(process.env.RABBITMQ_URL);
    const channel = await connection.createChannel();
    await channel.assertQueue(this.queue);

    channel.consume(this.queue, (msg) => {
      if (msg !== null) {
        this.logger.log(msg.content.toString());
        channel.ack(msg);
      }
    });
  }
}

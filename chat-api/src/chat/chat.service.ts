import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import * as amqp from 'amqplib';
import { Logger } from '@nestjs/common';

@Injectable()
export class ChatService implements OnModuleInit, OnModuleDestroy {
  private readonly queue = 'messages';
  private readonly logger = new Logger(ChatService.name);
  private connection: amqp.Connection;
  private channel: amqp.Channel;

  async onModuleInit() {
    await this.initializeRabbitMQ();
  }

  async onModuleDestroy() {
    await this.channel.close();
    await this.connection.close();
  }

  private async initializeRabbitMQ() {
    try {
      this.connection = await amqp.connect(process.env.RABBITMQ_URL);
      this.channel = await this.connection.createChannel();
      await this.channel.assertQueue(this.queue);
      this.logger.log('Successfully connected to RabbitMQ');
      await this.receiveMessages();
    } catch (error) {
      this.logger.error('Failed to connect to RabbitMQ', error);
    }
  }

  async sendMessage(message: string) {
    try {
      await this.channel.sendToQueue(this.queue, Buffer.from(message));
    } catch (error) {
      this.logger.error('Failed to send message to RabbitMQ', error);
    }
  }

  async receiveMessages() {
    try {
      this.channel.consume(this.queue, (msg) => {
        if (msg !== null) {
          this.logger.log(msg.content.toString());
          this.channel.ack(msg);
        }
      });
    } catch (error) {
      this.logger.error('Failed to receive messages from RabbitMQ', error);
    }
  }
}

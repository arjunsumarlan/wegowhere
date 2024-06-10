import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { io, Socket } from 'socket.io-client';
import { ChatService } from './chat.service';

describe('ChatGateway', () => {
  let app: INestApplication;
  let socket: Socket;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      providers: [ChatGateway, ChatService],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    socket = io('ws://localhost:5001', {
      transports: ['websocket'],
    });
  });

  afterAll(async () => {
    if (socket && socket.connected) {
      socket.disconnect();
    }
    await app.close();
  });

  it('should connect successfully', (done) => {
    socket.on('connect', () => {
      console.log('Connected to server');
      done();
    });

    socket.on('connect_error', (error) => {
      console.error('Connection Error:', error);
      done(error);
    });
  });
});

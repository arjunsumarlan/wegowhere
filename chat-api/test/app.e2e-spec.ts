import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { Socket, io } from 'socket.io-client';
import { ChatService } from '../src/chat/chat.service';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let chatService: ChatService;
  let socket: Socket;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
      providers: [{
        provide: ChatService,
        useValue: {
          sendMessage: jest.fn().mockResolvedValue(void 0),
        },
      }]
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    chatService = moduleFixture.get<ChatService>(ChatService);
    socket = io('ws://localhost:5001', {
      transports: ['websocket'],
    });
  });

  afterEach(async () => {
    if (socket && socket.connected) {
      socket.disconnect();
    }
    await app.close();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  it('should connect successfully', (done) => {
    socket.on('connect', () => {
      console.debug('I am connected!');
      done();
    });

    socket.on('message', (data) => {
      console.log('Message from server', data);
    });

    socket.on('disconnect', (reason) => {
      console.log('Disconnected: ', reason);
    });

    socket.on('connect_error', (error) => {
      console.error('Connection Error: ', error);
      done(error);
    });

    socket.on('error', (error) => {
      console.error('Error: ', error);
      done(error);
    });
  });

  it('should send and receive a message', (done) => {
    const testMessage = 'Hello Server';
    
    socket.on('connect', () => {
      socket.emit('message', testMessage);
      setTimeout(() => {
        if (!socket.connected) {
          done(new Error('Connection timeout'));
        }
      }, 4000);
    });

    socket.on('message', (data) => {
      console.log('Message from server', data);
      expect(data).toBe(`${testMessage}`);
      expect(chatService.sendMessage).toHaveBeenCalledWith(testMessage);
      done();
    });

    socket.on('disconnect', (reason) => {
      console.log('Disconnected: ', reason);
      done();
    });

    socket.on('connect_error', (error) => {
      console.error('Connection Error: ', error);
      done(error);
    });

    socket.on('error', (error) => {
      console.error('Error: ', error);
      done(error);
    });
  });
});

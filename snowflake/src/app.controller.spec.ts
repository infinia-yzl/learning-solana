import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Keypair } from '@solana/web3.js';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    console.log('before each')
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    await app.init();
    console.log('app');
    console.log(app);

    const appService = app.get<AppService>(AppService);
    console.log('service');
    console.log(appService);
    appController = app.get<AppController>(AppController);
    console.log('controller');
    console.log(appController);
  });

  describe('getHello', () => {
    it('should return "Hello World!"', () => {
      console.log('getHello');
      expect(appController.getHello()).toBe('AppService initialized. Hello world!');
    });
  });

  // describe('safe', () => {
  //   let owner1: Keypair;
  //   let owner2: Keypair;
  //   let owner3: Keypair;
  //
  //   beforeAll(() => {
  //     console.log('before all');
  //     console.log(appController);
  //     console.log('meow');
  //     owner1 = appController.generateKeypair();
  //     owner2 = appController.generateKeypair();
  //     owner3 = appController.generateKeypair();
  //   });
  //
  //   it('should create new Safe', async () => {
  //     const owners = [
  //       owner1.publicKey,
  //       owner2.publicKey,
  //       owner3.publicKey,
  //     ];
  //     const result = await appController.createSafe(owners, 2);
  //     expect(result).toBeDefined();
  //     console.log(result);
  //   });
  // });
});

import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {Keypair, PublicKey} from "@solana/web3.js";
import Squads from "@sqds/sdk";

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('Squads', () => {
    const DEFAULT_MULTISIG_PROGRAM_ID = new PublicKey(
      "SMPLecH534NA9acpos4G6x7uf3LWbCAwZQE9e8ZekMu"
    );
    const DEFAULT_PROGRAM_MANAGER_PROGRAM_ID = new PublicKey(
      "SMPLKTQhrgo22hFCVq2VGX1KAktTWjeizkhrdB1eauK"
    );

    let squads: Squads;

    let member1: Keypair;
    let member2: Keypair;
    let member3: Keypair;

    beforeEach(() => {
      squads = appController.getSquads();
      expect(squads).toBeDefined();

      // if localhost
      // expect(squads.connection.rpcEndpoint).toBe("http://localhost:8899");
      // expect(squads.multisigProgramId.equals(DEFAULT_MULTISIG_PROGRAM_ID));
      // expect(squads.programManagerProgramId.equals(DEFAULT_PROGRAM_MANAGER_PROGRAM_ID));

      member1 = Keypair.generate();
      member2 = Keypair.generate();
      member3 = Keypair.generate();
    });

    it('should create a multisig account', async () => {
      // fund account first
      await appController.airdropToWallet();

      const threshold = 2;

      const multiSigAccount = await appController.createMultisig(
        threshold,
        squads.wallet.publicKey,
        [member1.publicKey, member2.publicKey, member3.publicKey],
        "test multisig",
      );

      // seems like regenerating wallets for airdrops is limited (error 429).
      // recommend to use the same wallet for testing (generate a keypair on your own and use that (modify the code) instead of regenerating).
      expect(multiSigAccount).toStrictEqual({
        threshold: 2,
        authorityIndex: 1,
        transactionIndex: expect.any(Number),
        msChangeIndex: expect.any(Number),
        bump: expect.any(Number),
        createKey: squads.wallet.publicKey,
        allowExternalExecute: false,
        keys: expect.arrayContaining([
          member1.publicKey,
          member2.publicKey,
          member3.publicKey,
          squads.wallet.publicKey,
        ]),
        publicKey: expect.any(PublicKey),
      })
    }, 100000 );
  });
});

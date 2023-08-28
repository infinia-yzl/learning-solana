import {Injectable} from '@nestjs/common';
import {AnchorProvider} from "@coral-xyz/anchor";
import {SnowflakeSafe} from "@snowflake-so/safe-sdk";
import {PublicKey, Keypair} from "@solana/web3.js";

@Injectable()
export class AppService {
  provider: AnchorProvider;
  // snowflakeSafe: SnowflakeSafe;
  message: string;

  constructor() {
    this.provider = AnchorProvider.local();
    this.message = 'AppService initialized. Hello world!';
  }

  getHello(): string {
    return this.message;
  }

  // async createSafe(owners: PublicKey[], approvalsRequired: number) {
  //   return await this.snowflakeSafe.createSafe(owners, approvalsRequired);
  // }
  //
  // async fetchSafe(safeAddress: PublicKey) {
  //   await this.snowflakeSafe.fetchSafe(safeAddress);
  // }
  //
  // // EDDSA for now
  // generateKeypair() {
  //   return Keypair.generate();
  // }
}

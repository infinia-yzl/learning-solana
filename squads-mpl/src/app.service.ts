import {Injectable} from '@nestjs/common';
import Squads, {Wallet} from "@sqds/sdk";
import {
  clusterApiUrl,
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey
} from "@solana/web3.js";
import NodeWallet from "@coral-xyz/anchor/dist/cjs/nodewallet";

@Injectable()
export class AppService {
  squads: Squads;
  private readonly _keypair: Keypair;
  private readonly _wallet: Wallet;

  constructor() {
    this._keypair = Keypair.generate();
    this._wallet = new NodeWallet(this.keypair);
    // if localhost
    // this.squads = Squads.localnet(this.wallet);

    // if devnet
    this.squads = Squads.devnet(this.wallet);
  }

  async airdropToWallet() {
    const connection = new Connection(clusterApiUrl("devnet"));
    const lamports = await connection.getBalance(this.wallet.publicKey);
    if (lamports > 0) {
      return;
    }
    const signature = await connection.requestAirdrop(this.wallet.publicKey, LAMPORTS_PER_SOL * 1);
    const latestBlockHash = await connection.getLatestBlockhash();
    await connection.confirmTransaction({
        blockhash: latestBlockHash.blockhash,
        lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
        signature,
      }
    );
  }

  get keypair(): Keypair {
    return this._keypair;
  }

  get wallet(): Wallet {
    return this._wallet;
  }

  getSquads(): Squads {
    return this.squads;
  }

  async createMultisig(
    threshold: number,
    createKey: PublicKey,
    initialMembers: PublicKey[],
    name?: string,
    description?: string,
    image?: string) {
    const multisig = await this.squads.createMultisig(
      threshold,
      createKey,
      initialMembers,
      name,
      description,
      image,
    );
    console.log(multisig);
    return multisig;
  }
}

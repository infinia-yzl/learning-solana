import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import Squads from "@sqds/sdk";
import {PublicKey} from "@solana/web3.js";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getSquads(): Squads {
    return this.appService.getSquads();
  }

  async createMultisig(
    threshold: number,
    createKey: PublicKey,
    initialMembers: PublicKey[],
    name?: string,
    description?: string,
    image?: string) {
    return await this.appService.createMultisig(
      threshold,
      createKey,
      initialMembers,
      name,
      description,
      image,
    );
  }

  async airdropToWallet() {
    return await this.appService.airdropToWallet();
  }
}

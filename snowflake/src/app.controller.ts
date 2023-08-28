import { Controller } from '@nestjs/common';
import { AppService } from './app.service';
import {PublicKey} from "@solana/web3.js";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  getHello(): string {
    return this.appService.getHello();
  }

  // async createSafe(owners: PublicKey[], approvalsRequired: number) {
  //   return this.appService.createSafe(owners, approvalsRequired);
  // }
  //
  // async fetchSafe(safeAddress: PublicKey) {
  //   return this.appService.fetchSafe(safeAddress);
  // }
  //
  // // this doesn't need to be here but just leaving here for convenience
  // generateKeypair() {
  //   return this.appService.generateKeypair();
  // }
}

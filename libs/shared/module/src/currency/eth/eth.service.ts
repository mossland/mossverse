import { forwardRef, Inject, Injectable, Logger } from "@nestjs/common";
import { Utils } from "@shared/util";
import { Id, LogService } from "@shared/util-server";
import { ethers } from "ethers";
import * as option from "../../option";
import * as srv from "../../srv";
@Injectable()
export class EthService extends LogService {
  provider: ethers.providers.Provider;
  constructor(@Inject("ETHER_OPTIONS") private options: option.EtherOptions) {
    super(EthService.name);
    this.provider =
      this.options.network === "ganache"
        ? new ethers.providers.JsonRpcProvider(this.options.endpoint)
        : new ethers.providers.InfuraProvider(this.options.network, this.options.infuraId);
  }
  async getDepositAddress() {
    return this.options.root.address;
  }
  async checkDeposit(amount: number, txHash: string) {
    const tx = await this.provider.getTransaction(txHash);
    console.log(tx.to, this.options.root.address, tx.value, amount);
    if (tx.to !== this.options.root.address || Utils.weiToEther(tx.value.toString()) < Math.abs(amount)) return false;
    await tx.wait(1);
    return true;
  }
}

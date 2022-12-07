import { forwardRef, Inject, Injectable, Logger } from "@nestjs/common";
import { erc20 } from "@shared/contract";
import { Utils } from "@shared/util";
import { Id, LogService } from "@shared/util-server";
import { ethers } from "ethers";
import * as option from "../../option";
import * as srv from "../../srv";

@Injectable()
export class UsdService extends LogService {
  // "0xdAC17F958D2ee523a2206206994597C13D831ec7" tether mainnet
  provider: ethers.providers.Provider;
  constructor(@Inject("ETHER_OPTIONS") private options: option.EtherOptions) {
    super(UsdService.name);
    this.provider =
      this.options.network === "ganache"
        ? new ethers.providers.JsonRpcProvider(this.options.endpoint)
        : new ethers.providers.InfuraProvider(this.options.network, this.options.infuraId);
  }
  async getDepositAddress() {
    return this.options.root.address;
  }
  async checkDeposit(amount: number, txHash: string) {
    try {
      const tx = await this.provider.getTransaction(txHash);
      const intf = new ethers.utils.Interface(erc20.abi);
      const decoded = intf.parseTransaction({ data: tx.data, value: tx.value });
      const to = decoded.args[0];
      const num = parseFloat(ethers.utils.formatUnits(decoded.args[1], 18));
      if (num < Math.abs(amount) || to !== this.options.root.address) return false;
      await tx.wait(1);
      return true;
    } catch (e) {
      return false;
    }
  }
}

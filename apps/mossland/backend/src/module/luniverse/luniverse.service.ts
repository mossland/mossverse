import { Inject, Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Erc20, Id, LoadService } from "@shared/util-server";
import axios, { AxiosInstance } from "axios";
import { from } from "rxjs";
import { ethers } from "ethers";
import { Utils } from "@shared/util";

@Injectable()
export class LuniverseService {
  constructor(
    @Inject("LUNIVERSE_API") private luniverse: AxiosInstance // private readonly userService: srv.UserService,
  ) {}

  async getBalance(address: string, mtSymbol = "moc") {
    return Utils.weiToEther(
      await (await this.luniverse.get(`/tx/v2.0/wallets/${address}/${mtSymbol}/balance`, {})).data.data.balance
    );
  }

  async nonce(address: string) {
    return (await this.luniverse.get(`/mx/v2.0/wallets/${address}/nonce`)).data.data.nonce;
  }

  async transfer(fromAddress: string, toAddress: string, amount: number) {
    try {
      const nonce = await this.nonce(fromAddress);
      const rawTx_ = await this.luniverse.get(`/mx/v2.0/token/main-tokens/moc/transfer/raw-tx`, {
        params: {
          mainEnvironmentId: "1163492671662004106",
          fromAddress,
          toAddress,
          amount: Utils.etherToWei(amount),
        },
      });
      const rawTx = rawTx_.data.data.rawTx;
      rawTx.nonce = nonce;

      const signedTx = await this.luniverse.post(`/mx/v2.0/wallets/${fromAddress}/sign`, {
        rawTx,
      });
      const send = await this.luniverse.post(`/mx/v2.0/transaction/send/signed-tx`, {
        signedTx: signedTx.data.data.signedTx,
      });
      return send.data.data.txHash.txHash;
    } catch (err) {
      console.log(err);
    }
  }

  async getTxHash(address: string) {
    try {
      return (
        await this.luniverse.get(`https://api.luniverse.io/scan/v1.0/chains/0/accounts/${address}/transfer-events`, {
          params: {
            limit: 1,
          },
        })
      ).data.data.transferEvents.items[0].txHash;
    } catch (err) {
      console.log(err);
    }
  }
}

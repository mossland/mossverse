import { Inject, Injectable, Logger } from "@nestjs/common";
import { Utils } from "@shared/util";
import { Account, LogService, serverUtils, verifyToken } from "@shared/util-server";
import * as crypto from "crypto-js";
import * as jwt from "jsonwebtoken";
import { ethers } from "ethers";
import { SecurityOptions } from "../option";
import * as gql from "../gql";
import * as db from "../db";
@Injectable()
export class SecurityService extends LogService {
  constructor(@Inject("SECURITY_OPTIONS") private options: SecurityOptions) {
    super(SecurityService.name);
  }
  decrypt(hash: string) {
    return crypto.AES.decrypt(hash, this.options.aeskey).toString(crypto.enc.Utf8);
  }
  encrypt(data: string) {
    return crypto.AES.encrypt(data, this.options.aeskey).toString();
  }
  async verifySignature(signature: gql.Signature): Promise<string | null> {
    return await serverUtils.getAddrFromSig(signature, this.options.aeskey);
  }
  generateToken(keyring: db.Keyring.Doc): gql.AccessToken {
    const accessToken = jwt.sign(
      { keyring: keyring._id, role: "user", status: keyring.status, _id: keyring.user },
      this.options.jwtSecret
    );
    return { accessToken };
  }
  verifyToken(token?: string) {
    return verifyToken(this.options.jwtSecret, token);
  }
}

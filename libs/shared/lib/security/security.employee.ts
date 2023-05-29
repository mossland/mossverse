import * as cnst from "../cnst";
import * as crypto from "crypto-js";
import * as doc from "../doc";
import * as jwt from "jsonwebtoken";
import { Inject, Injectable } from "@nestjs/common";
import { LogService, serverUtils, verifyToken } from "@util/server";
import type { SecurityOptions } from "../option";

@Injectable()
export class SecurityEmployee extends LogService {
  constructor(@Inject("SECURITY_OPTIONS") private options: SecurityOptions) {
    super(SecurityEmployee.name);
  }
  decrypt(hash: string) {
    return crypto.AES.decrypt(hash, this.options.aeskey).toString(crypto.enc.Utf8);
  }
  encrypt(data: string) {
    return crypto.AES.encrypt(data, this.options.aeskey).toString();
  }
  async verifySignature(signature: cnst.Signature): Promise<string | null> {
    return await serverUtils.getAddrFromSig(signature, this.options.aeskey);
  }
  generateToken(keyring: doc.Keyring.Doc, user: doc.User.Doc): cnst.AccessToken {
    return {
      jwt: jwt.sign(
        {
          keyring: keyring._id,
          role: "user",
          requestRoles: user.requestRoles,
          roles: user.roles,
          status: keyring.status,
          _id: user._id,
        },
        this.options.jwtSecret
      ),
    };
  }
  verifyToken(token?: string) {
    return verifyToken(this.options.jwtSecret, token);
  }
}

import * as aws from "aws-sdk";
import * as fs from "fs";
import { Inject, Injectable } from "@nestjs/common";
// import * as dto from "./ipfs.dto";
import { IpfsOptions, ObjectStorageOptions } from "../../option";
import { LogService } from "@shared/util-server";

@Injectable()
export class IpfsService extends LogService {
  constructor(@Inject("IPFS_OPTIONS") private options: IpfsOptions) {
    super(IpfsService.name);
  }
  getHttpsUri(uri: string) {
    return uri.replace("ipfs://", `${this.options.endpoint}/`);
  }
}

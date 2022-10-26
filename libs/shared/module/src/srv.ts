export { AdminService } from "./admin/admin.service";
export { DiscordService } from "./discord/discord.service";
export { FileService } from "./file/file.service";
export { SecurityService } from "./security/security.service";
export { TokenService } from "./token/token.service";
export { ThingService } from "./thing/thing.service";
export { ContractService } from "./contract/contract.service";
export { KeyringService } from "./keyring/keyring.service";
export { NetworkService } from "./network/network.service";
export { WalletService } from "./wallet/wallet.service";
export { ProductService } from "./product/product.service";
export { S3Service } from "./file/s3/s3.service";
export { IpfsService } from "./file/ipfs/ipfs.service";
export { UserService } from "./user/user.service";

import { DiscordService } from "./discord/discord.service";
import { FileService } from "./file/file.service";
import { SecurityService } from "./security/security.service";
import { TokenService } from "./token/token.service";
import { NetworkService } from "./network/network.service";
import { ContractService } from "./contract/contract.service";

export type ControlServiceArray = [DiscordService, FileService, SecurityService];
export type ControlServiceMap = {
  discordService: DiscordService;
  fileService: FileService;
  securityService: SecurityService;
};
export const makeControlServiceMap = (services: ControlServiceArray) => ({
  discordService: services[0],
  fileService: services[1],
  securityService: services[2],
});

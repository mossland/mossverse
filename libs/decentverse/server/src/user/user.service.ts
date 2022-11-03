import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import * as User from "./user.model";
import { LoadService } from "@shared/util-server";
import { Utils } from "@shared/util";
import { srv as shared } from "@shared/module";
@Injectable()
export class UserService<
    Mdl extends User.Mdl = User.Mdl,
    Doc extends User.Doc = User.Doc,
    Input extends User.Input = User.Input
  >
  extends LoadService<Mdl, Doc, Input>
  implements shared.UserService<Mdl, Doc, Input>
{
  constructor(@InjectModel(User.name) readonly User: Mdl) {
    super(UserService.name, User);
  }

  // async addWallet(userId: string, wallet: db.WalletInput) {
  //   const user = await this.User.pickById(userId);
  //   return await user.merge({ wallets: [...user.wallets, wallet] }).save();
  // }

  // async syncInventory(userId: string) {
  //   const user = await this.User.pickById(userId);
  //   const contracts = await this.contractService.list({});
  //   let newInventory: db.Inventory[] = [];
  //   for (const wallet of user.wallets) {
  //     for (const contract of contracts.filter((contract) => contract.chain === wallet.chain)) {
  //       if (contract.chain === "ethereum") {
  //         if (contract.type === "ERC721") {
  //           const tokenlist = await this.etherService.getTokenList(contract.address, wallet.address, contract.abi);
  //           const items = await this.tokenService.list({ contract: contract.id, tokenId: { $in: tokenlist } });
  //           newInventory.concat(items.map((item): db.Inventory => ({ item: item.id, num: 1 })));
  //           // await user.merge({ inventory: [...user.inventory, ...newItems] }).save();
  //         } else if (contract.type === "ERC1155") {
  //           const items = await this.tokenService.list({ contract: contract.id });
  //           for (const item of items) {
  //             const balanceOf = await this.etherService.balanceOfERC1155(
  //               contract.address,
  //               wallet.address,
  //               item.tokenId,
  //               contract.abi
  //             );
  //             newInventory = [...newInventory, { item: item.id, num: balanceOf }];
  //           }
  //         }
  //         //  else if (contract.type === "ERC20") {
  //         // }
  //       } else if (contract.chain === "klaytn") {
  //         if (contract.type === "ERC-721") {
  //           const tokenlist = await this.kasService.getUserTokenList("ERC-721", wallet.address, contract.address);
  //           const items = await this.tokenService.list({ contract: contract.id, tokenId: { $in: tokenlist } });
  //           // newInventory = items.map((item) => ({ item: item.id, num: 1 }));
  //           newInventory = [...newInventory, ...items.map((item): db.Inventory => ({ item: item.id, num: 1 }))];
  //         } else if (contract.type === "ERC-1155") {
  //           const tokens: any = await this.kasService.getUserTokenBalance("ERC-1155", wallet.address, contract.address);
  //           if (tokens.length) {
  //             for (const token of tokens as any) {
  //               if (!token.balance) continue;
  //               const items = await this.tokenService.list(
  //                 {
  //                   contract: contract.id,
  //                   tokenId: { $in: token.tokenId },
  //                 },
  //                 0,
  //                 0
  //               );
  //               newInventory = [
  //                 ...newInventory,
  //                 ...items.map((item): db.Inventory => ({ item: item.id, num: token.balance })),
  //               ];
  //             }
  //           }
  //         }
  //       }
  //     }
  //   }
  //   return await user.merge({ inventory: newInventory }).save();
  // }

  // async myInventory(userId: string) {
  //   const user = await this.User.pickById(userId);
  //   return user.inventory;
  // }
}
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface UserService<
  Mdl extends User.Mdl = User.Mdl,
  Doc extends User.Doc = User.Doc,
  Input extends User.Input = User.Input
> extends shared.UserService<Mdl, Doc, Input> {}
Utils.applyMixins(UserService, [shared.UserService]);

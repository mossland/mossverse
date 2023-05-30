import * as Summary from "./summary.document";
import * as cnst from "../cnst";
import { AdminEmployee } from "../admin/admin.employee";
import { ContractEmployee } from "../contract/contract.employee";
import { CurrencyEmployee } from "../currency/currency.employee";
import { FileEmployee } from "../file/file.employee";
import { InjectModel } from "@nestjs/mongoose";
import { Injectable } from "@nestjs/common";
import { KeyringEmployee } from "../keyring/keyring.employee";
import { LoadService } from "@util/server";
import { NetworkEmployee } from "../network/network.employee";
import { NotificationEmployee } from "../notification/notification.employee";
import { OwnershipEmployee } from "../ownership/ownership.employee";
import { ProductEmployee } from "../product/product.employee";
import { ThingEmployee } from "../thing/thing.employee";
import { TokenEmployee } from "../token/token.employee";
import { UserEmployee } from "../user/user.employee";
import { WalletEmployee } from "../wallet/wallet.employee";
@Injectable()
export class SummaryEmployee<
  Mdl extends Summary.Mdl = Summary.Mdl,
  Doc extends Summary.Doc = Summary.Doc,
  Input extends Summary.Input = Summary.Input
> extends LoadService<Mdl, Doc, Input> {
  constructor(
    @InjectModel(Summary.name) private Summary: Mdl,
    private readonly ownershipEmployee: OwnershipEmployee,
    private readonly adminEmployee: AdminEmployee,
    private readonly contractEmployee: ContractEmployee,
    private readonly currencyEmployee: CurrencyEmployee,
    private readonly fileEmployee: FileEmployee,
    private readonly keyringEmployee: KeyringEmployee,
    private readonly networkEmployee: NetworkEmployee,
    private readonly productEmployee: ProductEmployee,
    private readonly thingEmployee: ThingEmployee,
    private readonly tokenEmployee: TokenEmployee,
    private readonly userEmployee: UserEmployee,
    private readonly walletEmployee: WalletEmployee,
    private readonly notificationEmployee: NotificationEmployee
  ) {
    super(SummaryEmployee.name, Summary);
  }
  async getSharedSummary(): Promise<cnst.SummaryInput> {
    return {
      ...(await this.adminEmployee.summarize()),
      ...(await this.notificationEmployee.summarize()),
      ...(await this.contractEmployee.summarize()),
      ...(await this.currencyEmployee.summarize()),
      ...(await this.fileEmployee.summarize()),
      ...(await this.keyringEmployee.summarize()),
      ...(await this.networkEmployee.summarize()),
      ...(await this.productEmployee.summarize()),
      ...(await this.thingEmployee.summarize()),
      ...(await this.tokenEmployee.summarize()),
      ...(await this.userEmployee.summarizeShared()),
      ...(await this.walletEmployee.summarize()),
      ...(await this.ownershipEmployee.summarize()),
    };
  }
  async getActiveSummary() {
    return await this.Summary.pickOne({ status: "active" });
  }
}

import { Process, Processor } from "@nestjs/bull";
import { Logger } from "@nestjs/common";
import { Job } from "bull";
import { Utils } from "@shared/util";
import * as dto from "./caver.dto";
import { CaverService } from "./caver.service";

@Processor("caver")
export class CaverConsumer {
  constructor(private readonly caverService: CaverService) {}
  // @Process("executeContract")
  // async sendTx(job: Job) {
  //   const req: dto.ContractExeutionRequest = job.data;
  //   const contract = this.caverService.caver.contract.create(
  //     [
  //       {
  //         constant: true,
  //         inputs: req.inputs.map((input) => ({
  //           type: input.type,
  //           name: input.name,
  //         })),
  //         name: req.functionName,
  //         outputs: [],
  //         payable: false,
  //         stateMutability: "nonpayable", //view
  //         type: "function",
  //       },
  //     ],
  //     req.contractAddr
  //   );
  //   try {
  //     const { status } = await contract.send(
  //       { from: this.caverService.wallet.address, gas: 10000000 },
  //       req.functionName,
  //       ...req.inputs.map((input) => input.value)
  //     );
  //     await Utils.sleep(1500);
  //     return status;
  //   } catch (err) {
  //     Logger.error(`Contract Send Failed`);
  //     return false;
  //   }
  // }
}

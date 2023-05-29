import { Resolver } from "@nestjs/graphql";
import { SummaryEmployee } from "./summary.employee";

import * as cnst from "../cnst";

@Resolver(() => cnst.shared.Summary)
export class SummaryResolver {
  constructor(private readonly summaryEmployee: SummaryEmployee) {}
}

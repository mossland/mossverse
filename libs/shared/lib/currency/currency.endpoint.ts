import * as cnst from "../cnst";
import { Allow, BaseResolver } from "@util/server";
import { CurrencyEmployee } from "./currency.employee";
import { FileEmployee } from "../file/file.employee";
import { Resolver } from "@nestjs/graphql";

@Resolver(() => cnst.Currency)
export class CurrencyResolver extends BaseResolver(
  cnst.Currency,
  cnst.CurrencyInput,
  Allow.Every,
  Allow.Every,
  Allow.Every
) {
  constructor(private readonly currencyEmployee: CurrencyEmployee, private readonly fileEmployee: FileEmployee) {
    super(currencyEmployee);
  }
}

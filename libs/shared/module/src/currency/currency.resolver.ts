import { Resolver, Query, Mutation, Args, ResolveField, Parent, Int, ID } from "@nestjs/graphql";
import { CurrencyService } from "./currency.service";
import { Allow, Account, BaseResolver } from "@shared/util-server";
import * as db from "../db";
import * as gql from "../gql";
import { UseGuards } from "@nestjs/common";
import { FileService } from "../file/file.service";

@Resolver(() => gql.Currency)
export class CurrencyResolver extends BaseResolver(
  gql.Currency,
  gql.CurrencyInput,
  Allow.Every,
  Allow.Every,
  Allow.Every
) {
  constructor(private readonly currencyService: CurrencyService, private readonly fileService: FileService) {
    super(currencyService);
  }
}

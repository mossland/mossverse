import {
  CallHandler,
  createParamDecorator,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  UnauthorizedException,
} from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { Observable } from "rxjs";
import { Account } from "./authorization";

export const Auth = createParamDecorator((data, context: ExecutionContext) => {
  const account: Account | null = GqlExecutionContext.create(context).getContext().account;
  if (!account) throw new Error("No or Invalid Account");
  return account;
});

export const UserIp = createParamDecorator((data: unknown, context: ExecutionContext) => {
  const ctx = GqlExecutionContext.create(context);
  return ctx.getContext().req.ip;
});

export const Signature = createParamDecorator((data: unknown, context: ExecutionContext) => {
  const address = GqlExecutionContext.create(context).getContext().address;
  if (!address) throw new UnauthorizedException("Invalid Signature");
  return address;
});

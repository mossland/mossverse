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

export const RequiredAuth = createParamDecorator((data, context: ExecutionContext) => {
  const account: Account | null = GqlExecutionContext.create(context).getContext().account;
  if (!account) throw new Error("No or Invalid Account");
  return account;
});

export const Auth = createParamDecorator((data, context: ExecutionContext) => {
  const account: Account | null = GqlExecutionContext.create(context).getContext().account;
  return account;
});

export const UserIp = createParamDecorator((data: unknown, context: ExecutionContext) => {
  const ctx = GqlExecutionContext.create(context);
  return ctx.getContext().req.ip;
});

export const Access = createParamDecorator((data: unknown, context: ExecutionContext) => {
  const ctx = GqlExecutionContext.create(context).getContext();
  // if (!ctx.geolocation || !ctx.userAgent) throw new Error("No Geolocation or UserAgent");
  return {
    ...(ctx.geolocation ? JSON.parse(ctx.geolocation) : {}),
    userAgent: ctx.userAgent,
    at: new Date(),
    period: 0,
  };
});

export const Signature = createParamDecorator((data: unknown, context: ExecutionContext) => {
  const address = GqlExecutionContext.create(context).getContext().address;
  return address;
});

export const RequiredSignature = createParamDecorator((data: unknown, context: ExecutionContext) => {
  const address = GqlExecutionContext.create(context).getContext().address;
  if (!address) throw new UnauthorizedException("Invalid RequiredSignature");
  return address;
});

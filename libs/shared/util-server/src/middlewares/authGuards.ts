import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { Id } from "../dbConfig";
import * as Auth from "./authorization";

@Injectable()
export class Public implements CanActivate {
  canActivate(): boolean {
    return true;
  }
}

@Injectable()
export class None implements CanActivate {
  canActivate(): boolean {
    return false;
  }
}

@Injectable()
export class Every implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const ctx = GqlExecutionContext.create(context);
    const account = ctx.getContext();
    return Auth.allow(account, ["every"]);
  }
}

@Injectable()
export class Owner implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const gqlCtx = GqlExecutionContext.create(context);
    const ctx = gqlCtx.getContext();
    // const { user: userId } = gqlCtx.getArgs()["data"];
    const { account } = ctx;
    return Auth.allow(account, ["every"]);
  }
}

@Injectable()
export class Admin implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const { account } = GqlExecutionContext.create(context).getContext();
    return Auth.allow(account, ["admin", "superAdmin"]);
  }
}

@Injectable()
export class SuperAdmin implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const { account } = GqlExecutionContext.create(context).getContext();
    return Auth.allow(account, ["superAdmin"]);
  }
}

@Injectable()
export class User implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const { account } = GqlExecutionContext.create(context).getContext();
    return Auth.allow(account, ["user"]);
  }
}

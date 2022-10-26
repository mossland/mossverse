import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  logger = new Logger("IO");
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.getArgByIndex(3);
    const reqType = req?.parentType?.name;
    const reqName = req?.fieldName;
    const before = Date.now();
    const ip = GqlExecutionContext.create(context).getContext().req.ip;
    this.logger.debug(`Before ${reqType} / ${reqName} / ${ip} / ${before}`);
    return next.handle().pipe(
      tap(() => {
        const after = Date.now();
        this.logger.debug(`After  ${reqType} / ${reqName} / ${ip} / ${after} (${after - before}ms)`);
      })
    );
  }
}

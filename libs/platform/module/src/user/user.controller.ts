import { Controller, Get, Post, Res, Req, HttpException, HttpStatus } from "@nestjs/common";
import { Id } from "@shared/util-server";
import { Request, Response } from "express";
import * as srv from "../srv";
import { UserService } from "./user.service";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { User } from "./user.gql";
@ApiTags("user")
@Controller("user")
export class UserController {
  constructor(
    private readonly securityService: srv.shared.SecurityService,
    private readonly userService: UserService
  ) {}
  @Get("whoAmI")
  @ApiOperation({
    summary: "Get User from Token",
    description:
      "Test Authorization Header: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJrZXlyaW5nIjoiNjMyOTdlNWZkMThmYzI5ZTUxYWQ5Y2ZiIiwicm9sZSI6InVzZXIiLCJzdGF0dXMiOiJhY3RpdmUiLCJpYXQiOjE2NjM2NjM3MTF9.BDfnJsUB_x9qNt3I5TbrX3A7QtVZdFc01Ufyg2jziFg",
  })
  @ApiResponse({
    status: 200,
    description: "User Entity",
    type: User,
  })
  async whoAmI(@Req() req: Request, @Res() res: Response) {
    const account = this.securityService.verifyToken(req.headers.authorization);
    if (!account) throw new HttpException("Unauthorized", HttpStatus.UNAUTHORIZED);
    return res.json(await this.userService.whoAmI(new Id(account.keyring)));
  }
}

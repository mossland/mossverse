import { Controller, Get, Post, Res, Req, HttpException, HttpStatus, Param, Body } from "@nestjs/common";
import { Id } from "@shared/util-server";
import { Request, Response } from "express";
import * as srv from "../srv";
import { PointService } from "./point.service";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { gql } from "..";
@ApiTags("point")
@Controller("point")
export class PointController {
  constructor(
    private readonly securityService: srv.shared.SecurityService,
    private readonly pointService: PointService
  ) {}
  @Get(":userId")
  @ApiOperation({
    summary: "Get Point Value of User. Only admin account can be authorized",
    description:
      "Test Authorization Header: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MzBmYzM0ZWFhZmIxMjA3YmNiM2QyNDQiLCJyb2xlIjoiYWRtaW4iLCJzdGF0dXMiOiJhY3RpdmUiLCJpYXQiOjE2NjM2NzYyNDl9.l9FN35a3xcILf3LuOWDk-M_K8MDPgBZ-4SB_j-B1Jp8",
  })
  @ApiResponse({
    status: 200,
    description: "Returned point value",
    type: Number,
  })
  async getPoint(@Req() req: Request, @Res() res: Response, @Param() { userId }) {
    const account = this.securityService.verifyToken(req.headers.authorization);
    if (!account) throw new HttpException("Unauthorized", HttpStatus.UNAUTHORIZED);
    if (!["admin", "superAdmin"].includes(account.role) || account.status !== "active")
      throw new HttpException("Not Authorized Admin", HttpStatus.UNAUTHORIZED);
    return res.json(await this.pointService.getPoint(new Id(userId)));
  }
  @Post(":userId")
  @ApiOperation({
    summary: "Add or Sub Point Value of User",
    requestBody: { description: "Update point body", required: true, content: { num: {} } },
  })
  @ApiResponse({ status: 200, description: "Returned point value", type: gql.platform.Receipt })
  async updatePoint(
    @Req() req: Request,
    @Res() res: Response,
    @Param() { userId },
    @Body() body: gql.platform.Exchange
  ) {
    const account = this.securityService.verifyToken(req.headers.authorization);
    if (!account) throw new HttpException("Unauthorized", HttpStatus.UNAUTHORIZED);
    if (!["admin", "superAdmin"].includes(account.role) || account.status !== "active")
      throw new HttpException("Not Authorized Admin", HttpStatus.UNAUTHORIZED);
    const exchange: gql.platform.ExchangeInput = { type: "thing", num: body.num, hash: body.hash };
    return res.json(await this.pointService.updatePoint(new Id(userId), exchange));
  }
}

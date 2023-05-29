import * as cnst from "../cnst";
import * as emp from "../emp";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Body, Controller, Get, HttpException, HttpStatus, Param, Post, Req, Res } from "@nestjs/common";
import { Id } from "@util/server";
import { PointEmployee } from "./point.employee";
import { Request, Response } from "express";
import { Resolver } from "@nestjs/graphql";

@ApiTags("point")
@Controller("point")
export class PointController {
  constructor(
    private readonly securityEmployee: emp.shared.SecurityEmployee,
    private readonly pointEmployee: PointEmployee
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
    const account = this.securityEmployee.verifyToken(req.headers.authorization);
    if (!account) throw new HttpException("Unauthorized", HttpStatus.UNAUTHORIZED);
    if (!["admin", "superAdmin"].includes(account.role) || account.status !== "active")
      throw new HttpException("Not Authorized Admin", HttpStatus.UNAUTHORIZED);
    return res.json(await this.pointEmployee.getPoint(new Id(userId)));
  }
  @Post(":userId")
  @ApiOperation({
    summary: "Add or Sub Point Value of User",
    requestBody: {
      description: "Update point body",
      required: true,
      content: { num: {} },
    },
  })
  @ApiResponse({
    status: 200,
    description: "Returned point value",
    type: cnst.platform.Receipt,
  })
  async updatePoint(
    @Req() req: Request,
    @Res() res: Response,
    @Param() { userId },
    @Body() body: cnst.platform.Exchange
  ) {
    const account = this.securityEmployee.verifyToken(req.headers.authorization);
    if (!account) throw new HttpException("Unauthorized", HttpStatus.UNAUTHORIZED);
    if (!["admin", "superAdmin"].includes(account.role) || account.status !== "active")
      throw new HttpException("Not Authorized Admin", HttpStatus.UNAUTHORIZED);
    const exchange: cnst.platform.ExchangeInput = {
      type: "thing",
      value: body.value,
      hash: body.hash,
    };
    return res.json(await this.pointEmployee.updatePoint(new Id(userId), exchange));
  }
}

@Resolver()
export class PointResolver {
  constructor(private readonly pointEmployee: PointEmployee) {}
}

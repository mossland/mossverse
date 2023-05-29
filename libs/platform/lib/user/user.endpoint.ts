import * as cnst from "../cnst";
import * as emp from "../emp";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Controller, Get, HttpException, HttpStatus, Req, Res } from "@nestjs/common";
import { Id } from "@util/server";
import { Request, Response } from "express";
import { Resolver } from "@nestjs/graphql";
import { User } from "./user.fetch";
@ApiTags("user")
@Controller("user")
export class UserController {
  constructor(
    private readonly securityEmployee: emp.shared.SecurityEmployee,
    private readonly keyringEmployee: emp.shared.KeyringEmployee
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
    const account = this.securityEmployee.verifyToken(req.headers.authorization);
    if (!account) throw new HttpException("Unauthorized", HttpStatus.UNAUTHORIZED);
    return res.json(await this.keyringEmployee.whoAmI(new Id(account.keyring)));
  }
}

@Resolver(() => cnst.shared.User)
export class UserResolver {
  constructor() {
    // private readonly userEmployee: UserEmployee
    //
  }
  // @Query(() => cnst.shared.User)
  // async testUserQuery() {
  //   return await this.userEmployee.pick({});
  // }
  //   @Mutation(() => [cnst.Inventory])
  //   @UseGuards(Allow.Every)
  //   async syncInventory(@Args({ name: "userId", type: () => ID }) userId: string) {
  //     // const inventory = await (await this.userEmployee.syncInventory(userId)).inventory;
  //     const inventoryIds = inventory.map((item) => item.item);
  //     const items = await this.tokenEmployee.loadMany(inventoryIds);
  //     const inventoryFields = inventory.map((item, idx) => {
  //       return {
  //         item: items[idx],
  //         num: item.num,
  //       };
  //     });

  //     return inventoryFields;
  //   }
}

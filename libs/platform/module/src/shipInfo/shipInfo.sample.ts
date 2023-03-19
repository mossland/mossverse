import { Id } from "@shared/util-server";
import { TestingModule } from "@nestjs/testing";
import * as Chance from "chance";
import * as srv from "../srv";
import * as gql from "../gql";
const c = new Chance();
export const shipInfoInput = (user: Id, product: Id): gql.ShipInfoInput => ({
  siteName: "",

  name: "",

  phone: "",

  zipcode: "",

  address: "",
  product,
  user,
});

export const createShipInfo = async (app: TestingModule, userId: Id, productId: Id) => {
  const shipInfoService = app.get<srv.ShipInfoService>(srv.ShipInfoService);
  const shipInfo = await shipInfoService.create(shipInfoInput(userId, productId));
  return shipInfo;
};

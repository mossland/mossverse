import * as cnst from "../cnst";
import * as emp from "../emp";
import { Id } from "@util/server";
import { TestingModule } from "@nestjs/testing";
import Chance from "chance";
const c = new Chance();
export const shipInfoInput = (user: Id, product: Id): cnst.ShipInfoInput => ({
  siteName: "",

  name: "",

  phone: "",

  zipcode: "",

  address: "",
  product,
  user,
});

export const createShipInfo = async (app: TestingModule, userId: Id, productId: Id) => {
  const shipInfoEmployee = app.get<emp.ShipInfoEmployee>(emp.ShipInfoEmployee);
  const shipInfo = await shipInfoEmployee.create(shipInfoInput(userId, productId));
  return shipInfo;
};

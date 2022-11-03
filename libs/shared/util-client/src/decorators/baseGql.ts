import "reflect-metadata";
import { BaseEntity, ID } from "./scalar";
import { ObjectType } from "./classMeta";
import { Field } from "./fieldMeta";

export function BaseGql<T extends BaseEntity>(inputRef: T) {
  @ObjectType("Base")
  class BaseGql extends inputRef {
    @Field(() => ID)
    id: string;
    @Field(() => Date)
    createdAt: Date;
    @Field(() => Date)
    updatedAt: Date;
  }
  return BaseGql;
}
export function BaseArrayFieldGql<T extends BaseEntity>(inputRef: T) {
  @ObjectType("Base", { isAbstract: true })
  class BaseGql extends inputRef {
    @Field(() => ID)
    id: string;
  }
  return BaseGql;
}

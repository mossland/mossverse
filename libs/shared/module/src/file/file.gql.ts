import { Prop, Schema } from "@nestjs/mongoose";
import { BaseGql, dbConfig, Id, ObjectId } from "@shared/util-server";
import { Field, ID, InputType, Int, IntersectionType, ObjectType } from "@nestjs/graphql";
import * as gql from "../gql";
import { cnst } from "@shared/util";

@ObjectType({ isAbstract: true })
@InputType({ isAbstract: true })
@Schema()
class Base {
  @Field(() => String)
  @Prop({ type: String, required: true, index: true })
  filename: string;

  @Field(() => String)
  @Prop({ type: String, required: true })
  mimetype: string;

  @Field(() => String)
  @Prop({ type: String, required: true })
  encoding: string;

  @Field(() => [Int])
  @Prop([{ type: Number, required: true }])
  imageSize: number[];

  @Field(() => String)
  @Prop({ type: String, required: true, unique: true })
  url: string;

  @Field(() => String, { nullable: true })
  @Prop({ type: String, required: false, index: true })
  origin?: string;
}
@InputType({ isAbstract: true })
class InputOverwrite {}
@ObjectType({ isAbstract: true })
@InputType({ isAbstract: true })
@Schema()
class Tail extends Base {
  @Field(() => String)
  @Prop({ type: String, enum: cnst.fileStatuses, required: true, default: "active" })
  status: cnst.FileStatus;
}
@InputType()
export class FileInput extends IntersectionType(InputOverwrite, Base, InputType) {}
@ObjectType()
export class File extends IntersectionType(BaseGql(Base), Tail) {}
@Schema()
export class FileSchema extends Tail {}

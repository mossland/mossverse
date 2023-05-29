import { BaseField, cnst } from "@util/server";
import { Field, InputType, Int, IntersectionType, ObjectType } from "@nestjs/graphql";
import { Prop, Schema } from "@nestjs/mongoose";

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

  @Field(() => [Int], { nullable: true })
  @Prop([{ type: Number, required: false, default: [0, 0] }])
  imageSize: number[];

  @Field(() => String, { nullable: true })
  @Prop({ type: String, required: false, default: "" })
  url: string;

  @Field(() => Int)
  @Prop({ type: Number, required: true, default: 0 })
  size: string;

  @Field(() => Date)
  @Prop({ type: Date, required: true, default: () => new Date() })
  lastModifiedAt: Date;

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
  @Field(() => Int, { nullable: true })
  @Prop({ type: Number, required: false })
  progress?: number;

  @Field(() => String)
  @Prop({ type: String, enum: cnst.fileStatuses, required: true, default: "uploading" })
  status: cnst.FileStatus;
}
@InputType()
export class FileInput extends IntersectionType(InputOverwrite, Base, InputType) {}
@ObjectType()
export class File extends IntersectionType(BaseField(Base), Tail) {}
@Schema()
export class FileSchema extends Tail {}

// * 4. 데이터 모니터링을 위한 Summary 모델
@ObjectType({ isAbstract: true })
@Schema()
export class FileSummary {
  @Field(() => Int)
  @Prop({ type: Number, required: true, min: 0, default: 0 })
  totalFile: number;
}

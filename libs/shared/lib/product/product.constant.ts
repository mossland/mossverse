import { BaseField, Id, ObjectId, cnst } from "@util/server";
import { Field, ID, InputType, Int, IntersectionType, ObjectType } from "@nestjs/graphql";
import { File } from "../file/file.constant";
import { Prop, Schema } from "@nestjs/mongoose";

// * 1. 보안필드를 제외한 모든 필드
@ObjectType({ isAbstract: true })
@InputType({ isAbstract: true })
@Schema()
class Base {
  @Field(() => String)
  @Prop({ type: String, required: false, default: "Default Name" })
  name: string;

  @Field(() => String)
  @Prop({ type: String, required: false, default: "Default Description" })
  description: string;

  @Field(() => File)
  @Prop({ type: ObjectId, required: true, ref: "file", index: true })
  image: Id;
}

// * 2. 다른 필드를 참조하는 값 Input형식으로 덮어씌우기
@InputType({ isAbstract: true })
class InputOverwrite {
  @Field(() => ID)
  image: Id;
}

// * 3. 보안필드, default 필드 생성 필수
@ObjectType({ isAbstract: true })
@InputType({ isAbstract: true })
@Schema()
class Tail extends Base {
  @Field(() => String)
  @Prop({
    type: String,
    enum: cnst.productStatuses,
    required: true,
    default: "active",
  })
  status: cnst.ProductStatus;
}

// * 최종 생성 모델
@InputType()
export class ProductInput extends IntersectionType(InputOverwrite, Base, InputType) {}
@ObjectType()
export class Product extends IntersectionType(BaseField(Base), Tail) {}
@Schema()
export class ProductSchema extends Tail {}

// * 4. 데이터 모니터링을 위한 Summary 모델
@ObjectType({ isAbstract: true })
@Schema()
export class ProductSummary {
  @Field(() => Int)
  @Prop({ type: Number, required: true, min: 0, default: 0 })
  totalProduct: number;
}

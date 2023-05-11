import { Prop, Schema } from "@nestjs/mongoose";
import { BaseGql, dbConfig, Id, ObjectId, validate } from "@shared/util-server";
import { Field, ID, InputType, IntersectionType, ObjectType, Int } from "@nestjs/graphql";
import { cnst, GetObject } from "@shared/util";
import { gql as shared } from "@shared/module";

// * 1. 보안필드를 제외한 모든 필드
@ObjectType({ isAbstract: true })
@InputType({ isAbstract: true })
@Schema()
class Base {
  @Field(() => String)
  @Prop({ type: String, enum: ["thing", "token", "contract"], required: true, index: true })
  targetType: "thing" | "token" | "contract";

  @Field(() => ID)
  @Prop({ type: ObjectId, refPath: "targetType", required: true, index: true })
  target: Id;

  @Field(() => [shared.Ownership])
  @Prop([shared.OwnershipSchema])
  ownerships: shared.Ownership[];
}

// * 2. 다른 필드를 참조하는 값 Input형식으로 덮어씌우기
@InputType({ isAbstract: true })
class InputOverwrite {
  @Field(() => [shared.OwnershipInput])
  ownerships: shared.Ownership[];
}

// * 3. 보안필드, default 필드 생성 필수
@ObjectType({ isAbstract: true })
@InputType({ isAbstract: true })
@Schema()
class Tail extends Base {
  @Field(() => String)
  @Prop({ type: String, enum: cnst.periodTypes, default: "non-periodic", required: true, index: true })
  type: cnst.PeriodType;

  @Field(() => Date)
  @Prop({ type: Date, required: true, default: () => new Date(), index: true })
  at: Date;

  @Field(() => String)
  @Prop({ type: String, enum: cnst.snapshotStatuses, required: true, default: "archived" })
  status: cnst.SnapshotStatus;
}

// * 최종 생성 모델
@InputType()
export class SnapshotInput extends IntersectionType(InputOverwrite, Base, InputType) {}
@ObjectType()
export class Snapshot extends IntersectionType(BaseGql(Base), Tail) {}
@Schema()
export class SnapshotSchema extends Tail {}

// * 4. 데이터 모니터링을 위한 Summary 모델
@ObjectType({ isAbstract: true })
export class SnapshotSummary {
  @Field(() => Int)
  @Prop({ type: Number, required: true, min: 0, default: 0 })
  totalSnapshot: number;
}

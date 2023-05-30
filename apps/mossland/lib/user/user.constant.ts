import { InputType, IntersectionType, ObjectType } from "@nestjs/graphql";
import { Schema } from "@nestjs/mongoose";
import { cnst as decentverse } from "@decentverse/server";
import { mixInputType, mixObjectType } from "@util/server";
import { cnst as platform } from "@platform/server";
import { cnst as shared } from "@shared/server";

// * 1. 보안필드를 제외한 모든 필드
@ObjectType({ isAbstract: true })
@InputType({ isAbstract: true })
@Schema()
class Base {}

// * 2. 다른 필드를 참조하는 값 Input형식으로 덮어씌우기
@InputType({ isAbstract: true })
class InputOverwrite {}

// * 3. 보안필드, default 필드 생성 필수
@ObjectType({ isAbstract: true })
@InputType({ isAbstract: true })
@Schema()
class Tail extends Base {}

export type MosslandUserInput = Base;
export type MosslandUser = Tail;

// * 최종 생성 모델
export class UserInput {}
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface UserInput extends shared.UserInput, InputOverwrite, Base {}
mixInputType(shared.UserInput, IntersectionType(InputOverwrite, Base, InputType));

export class User {}
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface User extends shared.User, Base, Tail {}
mixObjectType(shared.User, IntersectionType(Base, Tail));

@Schema()
export class UserSchema extends Tail {}

// * 4. 데이터 모니터링을 위한 Summary 모델
@ObjectType({ isAbstract: true })
@Schema()
export class MosslandUserSummary {}
export class UserSummary {}
export interface UserSummary
  extends shared.UserSummary,
    platform.UserSummary,
    decentverse.UserSummary,
    MosslandUserSummary {}
mixObjectType(shared.UserSummary, MosslandUserSummary);

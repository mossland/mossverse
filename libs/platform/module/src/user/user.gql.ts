import { Prop, Schema } from "@nestjs/mongoose";
import { BaseGql, dbConfig, Id, ObjectId, validate, mixInputType, mixObjectType } from "@shared/util-server";
import { Field, ID, InputType, Int, IntersectionType, ObjectType } from "@nestjs/graphql";
import * as gql from "../gql";
import { modules } from "@shared/module";
import { ApiProperty } from "@nestjs/swagger";
import { gql as shared } from "@shared/module";

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
class Tail {}

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

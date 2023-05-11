import { ReadStream } from "fs";
import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import GraphQLJSON from "graphql-type-json";
import { Int, ID } from "@nestjs/graphql";
import { cnst } from "@shared/util";

export { GraphQLJSON as JSON };
export { Int, ID };
export type FileStream = {
  filename: string;
  mimetype: string;
  encoding: string;
  createReadStream(): ReadStream;
};
export type LocalFile = {
  filename: string;
  mimetype: string;
  encoding: string;
  localPath: string;
};

@ObjectType()
export class AccessToken {
  @Field(() => String)
  accessToken: string;
}
@ObjectType()
export class Otp {
  @Field(() => String)
  otp: string;
}

export interface FileUpload {
  filename: string;
  mimetype: string;
  encoding: string;
  createReadStream(): ReadStream;
}
export { GraphQLUpload as FileUpload } from "graphql-upload";

// * OpenSea Attribute Schema Definition

@InputType({ isAbstract: true })
@ObjectType()
@Schema()
export class OpenSeaAttribute {
  @Field({ nullable: true })
  @Prop({ type: String })
  display_type?: string;

  @Field(() => String)
  @Prop({ type: String, required: true })
  trait_type: string;

  @Field(() => String)
  @Prop({ type: String, required: true })
  value: string;
}
@InputType()
export class OpenSeaAttributeInput extends OpenSeaAttribute {}
export const OpenSeaAttributeSchema = SchemaFactory.createForClass(OpenSeaAttribute);

// * NFT Metadata Schema Definition

@InputType({ isAbstract: true })
@ObjectType()
@Schema()
export class ExternalLink {
  @Field(() => String)
  @Prop({ type: String, enum: cnst.linkTypes, required: true })
  type: cnst.LinkType;

  @Field(() => String)
  @Prop({ type: String, required: true })
  url: string;
}
@InputType()
export class ExternalLinkInput extends ExternalLink {}
export const ExternalLinkSchema = SchemaFactory.createForClass(ExternalLink);

@InputType({ isAbstract: true })
@ObjectType()
@Schema()
export class OpenSeaContractMeta {
  @Field(() => String)
  @Prop({ type: String, required: true })
  name: string;

  @Field(() => String)
  @Prop({ type: String, required: true })
  description: string;

  @Field(() => String)
  @Prop({ type: String, required: true })
  image: string;

  @Field(() => String, { nullable: true })
  @Prop({ type: String, required: false })
  external_link?: string;
}
@InputType()
export class OpenSeaContractMetaInput extends OpenSeaContractMeta {}
export const OpenSeaContractMetaSchema = SchemaFactory.createForClass(OpenSeaContractMeta);

@InputType({ isAbstract: true })
@ObjectType()
@Schema()
export class OpenSeaMeta {
  @Field(() => String)
  @Prop({ type: String, required: true })
  name: string;

  @Field(() => String, { nullable: true })
  @Prop({ type: String, required: false })
  external_url?: string;

  @Field(() => String)
  @Prop({ type: String, required: true })
  image: string;

  @Field(() => String)
  @Prop({ type: String, required: true })
  description: string;

  @Field(() => [OpenSeaAttribute])
  @Prop([OpenSeaAttributeSchema])
  attributes: OpenSeaAttribute[];
}
@InputType()
export class OpenSeaMetaInput extends OpenSeaMeta {}
export const OpenSeaMetaSchema = SchemaFactory.createForClass(OpenSeaMeta);

@InputType({ isAbstract: true })
@ObjectType()
@Schema()
export class TokenProfile {
  @Field(() => String)
  @Prop({ type: String, required: true, default: "Default Nickname" })
  nickname: string;

  @Field(() => Int)
  @Prop({ type: Number, required: true, default: 20 })
  age: number;

  @Field(() => String)
  @Prop({ type: String, required: true, default: "Default Class" })
  class: string;

  @Field(() => [String])
  @Prop([{ type: String, required: true }])
  speciality: string[];

  @Field(() => [String])
  @Prop([{ type: String, required: true }])
  weakness: string[];
}
@InputType()
export class TokenProfileInput extends TokenProfile {}
export const TokenProfileSchema = SchemaFactory.createForClass(TokenProfile);

// * Token Data Schema Definition

@InputType({ isAbstract: true })
@ObjectType()
@Schema()
export class SaleInfo {
  @Field()
  @Prop({ type: Number, required: false })
  price?: number;

  @Field()
  @Prop({ type: Number, required: false })
  supply?: number;

  @Field()
  @Prop({ type: Number, required: false })
  remains?: number;

  @Field()
  @Prop({ type: Date, required: false })
  saleStartTime?: Date;

  @Field()
  @Prop({ type: Date, required: false })
  saleEndTime?: Date;
}

@InputType({ isAbstract: true })
@ObjectType()
@Schema()
export class LanguagePack {
  @Field(() => String, { nullable: false })
  @Prop({ type: String, enum: cnst.locales })
  locale: cnst.Locale;

  @Field(() => String, { nullable: false })
  @Prop({ type: String })
  title: string;

  @Field(() => String, { nullable: true })
  @Prop({ type: String })
  description?: string;

  @Field(() => [String], { nullable: true })
  @Prop({ type: [String] })
  selection?: string[];
}

@InputType()
export class LanguagePackInput extends LanguagePack {}
export const LanguagePackSchema = SchemaFactory.createForClass(LanguagePack);

export interface Signature {
  signchain: string;
  signmessage: string;
  signaddress: string;
}

@InputType({ isAbstract: true })
@ObjectType()
@Schema()
export class AccessStat {
  @Field()
  @Prop({ type: Number, required: true, default: 0 })
  request: number;

  @Field()
  @Prop({ type: Number, required: true, default: 0 })
  device: number;

  @Field()
  @Prop({ type: Number, required: true, default: 0 })
  ip: number;

  @Field()
  @Prop({ type: Number, required: true, default: 0 })
  country: number;
}
@InputType()
export class AccessStatInput extends AccessStat {}
export const AccessStatSchema = SchemaFactory.createForClass(AccessStat);

@InputType({ isAbstract: true })
@ObjectType()
@Schema()
export class AccessLog {
  @Field()
  @Prop({ type: Number, required: true, default: 0 })
  period: number;

  @Field()
  @Prop({ type: Number, required: true, default: 0 })
  device: number;

  @Field()
  @Prop({ type: Number, required: true, default: 0 })
  ip: number;

  @Field()
  @Prop({ type: Number, required: true, default: 0 })
  country: number;

  @Field()
  @Prop({ type: Date, required: true, default: () => new Date() })
  at: Date;
}
@InputType()
export class AccessLogInput extends AccessLog {}
export const AccessLogSchema = SchemaFactory.createForClass(AccessLog);

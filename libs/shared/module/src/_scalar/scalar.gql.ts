import { ReadStream } from "fs";
import { Field, InputType, ObjectType, Int, ID, Float } from "@nestjs/graphql";
import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import GraphQLJSON from "graphql-type-json";
import { cnst } from "@shared/util";
import { Id, ObjectId } from "@shared/util-server";
import { GraphQLUpload } from "graphql-upload";

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
  jwt: string;
}

export interface FileUpload {
  filename: string;
  mimetype: string;
  encoding: string;
  createReadStream(): ReadStream;
}
export { GraphQLUpload as FileUpload };

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
export class Coordinate {
  @Field(() => String)
  @Prop({ type: String, required: true, enum: ["Point"], default: "Point" })
  type: "Point";

  @Field(() => [Float])
  @Prop([{ type: Number, required: true }])
  coordinates: number[];
}
@InputType()
export class CoordinateInput extends Coordinate {}
export const CoordinateSchema = SchemaFactory.createForClass(Coordinate);

@InputType({ isAbstract: true })
@ObjectType()
@Schema()
export class AccessLog {
  @Field()
  @Prop({ type: Number, required: true, default: 0 })
  period: number;

  @Field(() => String, { nullable: true })
  @Prop({ type: String, required: false })
  countryCode?: string;

  @Field(() => String, { nullable: true })
  @Prop({ type: String, required: false })
  countryName?: string;

  @Field(() => String, { nullable: true })
  @Prop({ type: String, required: false })
  city?: string;

  @Field(() => Int, { nullable: true })
  @Prop({ type: Number, required: false })
  postal?: number;

  @Field(() => Coordinate, { nullable: true })
  @Prop({ type: CoordinateSchema, required: false, index: "2dsphere" })
  location?: Coordinate;

  @Field(() => String, { nullable: true })
  @Prop({ type: String, required: false })
  ipv4?: string;

  @Field(() => String, { nullable: true })
  @Prop({ type: String, required: false })
  state?: string;

  @Field(() => String, { nullable: true })
  @Prop({ type: String, required: false })
  userAgent?: string;

  @Field()
  @Prop({ type: Date, required: true, default: () => new Date() })
  at: Date;
}
@InputType()
export class AccessLogInput extends AccessLog {}
export const AccessLogSchema = SchemaFactory.createForClass(AccessLog);

@InputType({ isAbstract: true })
@ObjectType()
@Schema()
export class ServiceReview {
  @Field(() => Int)
  @Prop({ type: Number, min: 0, default: 0, required: true })
  score: number;

  @Field(() => String)
  @Prop({ type: String, required: false })
  comment?: string;
}
@InputType()
export class ServiceReviewInput extends ServiceReview {}
export const ServiceReviewSchema = SchemaFactory.createForClass(ServiceReview);

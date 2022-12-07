import graphql from "graphql-tag";
import { cnst } from "@shared/util";
import { BaseArrayFieldGql, createFragment, Field, InputType, Int, makeDefault, ObjectType } from "@shared/util-client";
import WalletConnect from "@walletconnect/client";

@ObjectType("AccessToken")
export class AccessToken {
  @Field(() => String)
  accessToken: string;
}
export const accessTokenFragment = createFragment(AccessToken);

@InputType("OpenSeaAttributeInput")
export class OpenSeaAttributeInput {
  @Field(() => String, { nullable: true })
  display_type?: string;

  @Field(() => String)
  trait_type: string;

  @Field(() => String)
  value: string;
}
@ObjectType("OpenSeaAttribute")
export class OpenSeaAttribute extends OpenSeaAttributeInput {}
export const openSeaAttributeFragment = createFragment(OpenSeaAttribute);

@InputType("OpenSeaMetaInput")
export class OpenSeaMetaInput {
  @Field(() => String)
  name: string;

  @Field(() => String)
  external_url: string;

  @Field(() => String)
  image: string;

  @Field(() => String)
  description: string;

  @Field(() => [OpenSeaAttribute])
  attributes: OpenSeaAttribute[];
}
@ObjectType("OpenSeaMeta")
export class OpenSeaMeta extends OpenSeaMetaInput {}
export const openSeaMetaFragment = createFragment(OpenSeaMeta);

@InputType("TokenUrlInput")
export class TokenUrlInput {
  @Field(() => String)
  url: string;

  @Field(() => String)
  imageUrl: string;

  @Field(() => OpenSeaMeta)
  meta: OpenSeaMeta;
}
@ObjectType("TokenUrl")
export class TokenUrl extends TokenUrlInput {}
export const tokenUrlFragment = createFragment(TokenUrl);

@InputType("ReferenceInput")
export class ReferenceInput {
  @Field(() => String)
  type: string;
  @Field(() => String)
  ref: string;
}
@ObjectType("Reference")
export class Reference extends BaseArrayFieldGql(ReferenceInput) {}
export const referenceFragment = createFragment(Reference);

@InputType("ExternalLinkInput")
export class ExternalLinkInput {
  @Field(() => String, { default: "website" })
  type: cnst.LinkType;
  @Field(() => String)
  url: string;
}
@ObjectType("ExternalLink")
export class ExternalLink extends ExternalLinkInput {}
export const externalLinkFragment = createFragment(ExternalLink);
export const defaultExternalLink = makeDefault<ExternalLink>(ExternalLink);

export type WalletConnectType = {
  connector: WalletConnect;
  accounts: string[];
  chainId: number;
};
export type LoginMethod = cnst.NetworkProvider | "walletConnect" | "guest" | "password" | "none";
export type MetamaskProvider = "ethereum";

@InputType("AccessStatInput")
export class AccessStatInput {
  @Field(() => Int)
  request: number;

  @Field(() => Int)
  device: number;

  @Field(() => Int)
  ip: number;

  @Field(() => Int)
  country: number;
}

@ObjectType("AccessStat")
export class AccessStat extends AccessStatInput {}

@InputType("AccessLogInput")
export class AccessLogInput {
  @Field(() => Int)
  period: number;

  @Field(() => Int)
  device: number;

  @Field(() => Int)
  ip: number;

  @Field(() => Int)
  country: number;

  @Field(() => Int)
  at: Date;
}

@ObjectType("AccessLog")
export class AccessLog extends AccessLogInput {}

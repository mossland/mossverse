import { Field, Float, InputType, Int, ObjectType, cnst, createFragment, makeDefault } from "@util/client";
// import WalletConnect from "@walletconnect/client";

@ObjectType("AccessToken")
export class AccessToken {
  @Field(() => String)
  jwt: string;
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
  connector: any; //WalletConnect;
  accounts: string[];
  chainId: number;
};
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

@InputType("CoordinateInput")
export class CoordinateInput {
  @Field(() => String)
  type: "Point";

  @Field(() => [Float])
  coordinates: number[];
}
@ObjectType("Coordinate")
export class Coordinate extends CoordinateInput {}

@InputType("AccessLogInput")
export class AccessLogInput {
  @Field(() => Int)
  period: number;

  @Field(() => String)
  countryCode: string;

  @Field(() => String)
  countryName: string;

  @Field(() => String, { nullable: true })
  city: string | null;

  @Field(() => Int, { nullable: true })
  postal: number | null;

  @Field(() => Coordinate)
  location: Coordinate;

  @Field(() => String)
  ipv4: string;

  @Field(() => String, { nullable: true })
  state: string | null;

  @Field(() => String)
  userAgent: string;

  @Field(() => Date)
  at: Date;
}

@ObjectType("AccessLog")
export class AccessLog extends AccessLogInput {}

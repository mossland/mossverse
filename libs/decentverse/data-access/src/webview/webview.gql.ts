import graphql from "graphql-tag";
import { cnst } from "@shared/util";
import {
  createGraphQL,
  createFragment,
  Field,
  InputType,
  ObjectType,
  BaseGql,
  Int,
  BaseArrayFieldGql,
  makeDefault,
} from "@shared/util-client";

export const webviewPurposes = ["default", "youtube", "image", "twitter"] as const;
export type WebviewPurpose = typeof webviewPurposes[number];

@InputType("WebviewInput")
export class WebviewInput {
  @Field(() => String, { nullable: true })
  message: string | null;

  @Field(() => String, { nullable: true })
  errorMessage: string | null;

  @Field(() => [Int])
  center: [number, number];

  @Field(() => [Int])
  wh: [number, number];

  @Field(() => String)
  url: string;

  @Field(() => [Int])
  size: number[];

  @Field(() => String)
  purpose: WebviewPurpose;

  @Field(() => Boolean)
  isEmbed: boolean;
}

@ObjectType("Webview")
export class Webview extends BaseArrayFieldGql(WebviewInput) {}
export const webviewFragment = createFragment(Webview);
export const defaultWebview = makeDefault<Webview>(Webview);

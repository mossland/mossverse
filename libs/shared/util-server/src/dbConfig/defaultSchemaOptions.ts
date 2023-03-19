import { Types, SchemaOptions } from "mongoose";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { getDefaultDocumentMethods } from "./documentOptions";
import { getDefaultModelStatics, getDefaultQueryHelpers } from "./modelOptions";
export const defaultSchemaOptions: SchemaOptions = {
  timestamps: true,
  toJSON: { getters: true, virtuals: true },
  toObject: { getters: true, virtuals: true },
  id: true,
  _id: true,
  methods: getDefaultDocumentMethods(),
  statics: getDefaultModelStatics() as any,
  query: getDefaultQueryHelpers() as any,
};

// @Schema({ timestamps: true })
export class DefaultSchemaFields {
  _id: Types.ObjectId;

  id: string;

  // @Prop()
  createdAt: Date;

  // @Prop()
  updatedAt: Date;
}

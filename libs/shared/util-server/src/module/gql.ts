import { Type } from "@nestjs/common";
import { Field, ObjectType, ID, TypeMetadataStorage, PartialType, InputType } from "@nestjs/graphql";
import { ApiProperty } from "@nestjs/swagger";
import { Utils } from "@shared/util";

interface BaseEntity extends Function {
  new (...any: any[]): any;
  [key: string]: any;
}

export interface BaseGqlConstructor<Ref> {
  new (...any: any[]): Ref & BaseGqlInstance;
}
export interface BaseGqlInstance {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export function BaseGql<T extends BaseEntity>(rawRef: T) {
  @ObjectType({ isAbstract: true })
  abstract class BaseGql extends rawRef {
    @Field(() => ID)
    @ApiProperty({ example: "630e2588121191ca4b2e3ead", description: "ObjectID of data" })
    id: string;

    @Field(() => Date)
    @ApiProperty({ example: new Date(), description: "Creation date of data" })
    createdAt: Date;

    @Field(() => Date)
    @ApiProperty({ example: new Date(), description: "Update date of data" })
    updatedAt: Date;
  }
  return BaseGql as unknown as T & BaseGqlConstructor<T>;
}

@ObjectType({ isAbstract: true })
export class BaseArrayField {
  @Field(() => ID, { nullable: true })
  // @ApiProperty({ example: "630e2588121191ca4b2e3ead", description: "ObjectID of data" })
  id?: string;
}

export const mixObjectType = (classRef: Type<unknown>, baseRef: Type<unknown>) => {
  PartialType(baseRef, ObjectType);
  const { properties } = TypeMetadataStorage.getObjectTypeMetadataByTarget(baseRef) || {};

  properties?.forEach((propertyMetadata) => {
    Field(
      propertyMetadata.options.isArray ? () => [propertyMetadata.typeFn()] : () => propertyMetadata.typeFn(),
      propertyMetadata.options
    )(classRef.prototype, propertyMetadata.name);
  });
  // Utils.applyMixins(classRef, [baseRef]);
};

export const mixInputType = (classRef: Type<unknown>, baseRef: Type<unknown>) => {
  PartialType(baseRef, InputType);
  const { properties } = TypeMetadataStorage.getInputTypeMetadataByTarget(baseRef) || {};
  properties?.forEach((propertyMetadata) => {
    Field(
      propertyMetadata.options.isArray ? () => [propertyMetadata.typeFn()] : () => propertyMetadata.typeFn(),
      propertyMetadata.options
    )(classRef.prototype, propertyMetadata.name);
  });
  // Utils.applyMixins(classRef, [baseRef]);
};
export const mixResolverType = (classRef: Type<unknown>, baseRef: Type<unknown>) => {
  PartialType(baseRef);
  TypeMetadataStorage.getInputTypeMetadataByTarget(baseRef)?.properties?.forEach((propertyMetadata) => {
    Field(() => [propertyMetadata.typeFn()])(classRef.prototype, propertyMetadata.name);
  });
  TypeMetadataStorage.getObjectTypeMetadataByTarget(baseRef)?.properties?.forEach((propertyMetadata) => {
    Field(() => [propertyMetadata.typeFn()])(classRef.prototype, propertyMetadata.name);
  });
  Utils.applyMixins(classRef, [baseRef]);
};

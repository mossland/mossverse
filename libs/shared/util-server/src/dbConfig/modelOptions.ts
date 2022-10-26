import { Types, FilterQuery, PipelineStage, Query } from "mongoose";
export interface DefaultMdlStats<TDocument, TSchema> {
  pickOneAndWrite: (query: FilterQuery<TSchema>, rawData: Partial<TSchema>) => Promise<TDocument>;
  pickAndWrite: (docId: Types.ObjectId | string, rawData: Partial<TSchema>) => Promise<TDocument>;
  pickOne: (query: FilterQuery<TSchema>) => Promise<TDocument>;
  pickById: (docId: Types.ObjectId | string | undefined) => Promise<TDocument>;
  sample: (query: FilterQuery<TSchema>, size?: number, aggregations?: PipelineStage[]) => Promise<TDocument[]>;
}
export const getDefaultModelStatics = <TDocument, TSchema>(): DefaultMdlStats<TDocument, TSchema> => ({
  pickOneAndWrite: async function (query: FilterQuery<TSchema>, rawData: Partial<TSchema>): Promise<TDocument> {
    const doc = await this.findOne(query);
    if (!doc) throw new Error("No Document");
    Object.assign(doc, rawData);
    return await doc.save();
  },
  pickAndWrite: async function (docId: Types.ObjectId | string, rawData: Partial<TSchema>): Promise<TDocument> {
    const doc = await this.findById(docId);
    if (!doc) throw new Error("No Document");
    Object.assign(doc, rawData);
    return await doc.save();
  },
  pickOne: async function (query: FilterQuery<TSchema>): Promise<TDocument> {
    const doc = await this.findOne(query);
    if (!doc) throw new Error("No Document");
    return doc;
  },
  pickById: async function (docId: Types.ObjectId | string | undefined): Promise<TDocument> {
    if (!docId) throw new Error("No Document ID");
    const doc = await this.findById(docId);
    if (!doc) throw new Error("No Document");
    return doc;
  },
  sample: async function (
    query: FilterQuery<TSchema>,
    size = 1,
    aggregations: PipelineStage[] = []
  ): Promise<TDocument[]> {
    return await this.aggregate([{ $match: { ...query } }, { $sample: { size } }, ...aggregations]);
  },
});
export interface DefaultQryHelps<TDocument, TQryHelps> {
  byName(name: string): Query<any, TDocument, TQryHelps> & TQryHelps;
}
export const getDefaultQueryHelpers = <TDocument, TQryHelps>(): DefaultQryHelps<TDocument, TQryHelps> => ({
  byName: function (name: string) {
    return this.find({ name });
  },
});

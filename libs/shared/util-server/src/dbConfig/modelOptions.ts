import { Types, FilterQuery, PipelineStage, Query } from "mongoose";
export interface DefaultMdlStats<TDocument, TSchema> {
  pickOneAndWrite: (query: FilterQuery<TSchema>, rawData: Partial<TSchema>) => Promise<TDocument>;
  pickAndWrite: (docId: Types.ObjectId | string, rawData: Partial<TSchema>) => Promise<TDocument>;
  pickOne: (query: FilterQuery<TSchema>) => Promise<TDocument>;
  pickById: (docId: Types.ObjectId | string | undefined) => Promise<TDocument>;
  addSummary: (prefix?: string | string[], num?: number) => Promise<void>;
  moveSummary: (prev: string, next: string, num?: number) => Promise<void>;
  subSummary: (prefix?: string | string[], num?: number) => Promise<void>;
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
  addSummary: async function (prefix = "total", num = 1): Promise<void> {
    const update = Array.isArray(prefix)
      ? { $inc: { ...prefix.reduce((acc, cur) => ({ ...acc, [`${cur}${this.modelName}`]: num }), {}) } }
      : { $inc: { [`${prefix}${this.modelName}`]: num } };
    await this.db.collection("summaries").updateOne({ status: "active" }, update);
  },
  moveSummary: async function (prev: string, next: string, num = 1): Promise<void> {
    await this.db
      .collection("summaries")
      .updateOne(
        { status: "active" },
        { $inc: { [`${prev}${this.modelName}`]: -num, [`${next}${this.modelName}`]: num } }
      );
  },
  subSummary: async function (prefix = "total", num = 1): Promise<void> {
    const update = Array.isArray(prefix)
      ? { $inc: { ...prefix.reduce((acc, cur) => ({ ...acc, [`${cur}${this.modelName}`]: -num }), {}) } }
      : { $inc: { [`${prefix}${this.modelName}`]: -num } };
    await this.db.collection("summaries").updateOne({ status: "active" }, update);
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

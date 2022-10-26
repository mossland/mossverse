export interface DefaultDocMtds<TDocument> {
  refresh: () => Promise<TDocument>;
  merge: (data: Partial<TDocument>) => TDocument;
}

export const getDefaultDocumentMethods = <TDocument>() => ({
  refresh: async function (): Promise<TDocument> {
    Object.assign(this, await this.constructor.findById(this._id));
    return this;
  },
  merge: function (data: Partial<TDocument>): TDocument {
    Object.assign(this, data);
    return this;
  },
});

/**
 * Shared schema plugin for Mongoose models.
 * Adds timestamps and transforms toJSON: renames _id to id, removes __v.
 */
export function applyJsonTransform(schema) {
  schema.set('timestamps', true);

  schema.set('toJSON', {
    virtuals: true,
    transform(doc, ret) {
      if (ret._id) {
        ret.id = ret._id.toString();
        delete ret._id;
      }
      delete ret.__v;
      return ret;
    },
  });

  schema.set('toObject', {
    virtuals: true,
    transform(doc, ret) {
      if (ret._id) {
        ret.id = ret._id.toString();
        delete ret._id;
      }
      delete ret.__v;
      return ret;
    },
  });
}

export default applyJsonTransform;

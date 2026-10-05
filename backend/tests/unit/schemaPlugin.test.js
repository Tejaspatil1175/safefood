import { describe, it, expect } from 'vitest';
import mongoose from 'mongoose';
import { applyJsonTransform } from '../../infra/schemaPlugin.js';

describe('Schema Plugin (toJSON Transform)', () => {
  it('should transform _id to id and remove __v when calling toJSON', () => {
    const testSchema = new mongoose.Schema({
      name: String,
    });
    testSchema.plugin(applyJsonTransform);

    const TestModel = mongoose.model('TestPluginDoc', testSchema);
    const doc = new TestModel({ name: 'SafeFood Test' });

    const json = doc.toJSON();
    expect(json).toHaveProperty('id');
    expect(json.id).toBe(doc._id.toString());
    expect(json._id).toBeUndefined();
    expect(json.__v).toBeUndefined();
    expect(json.name).toBe('SafeFood Test');
  });
});

import Counter from "./counter.model";

export const getNextSequenceValue = async (key: string): Promise<number> => {
  const updated = await Counter.findOneAndUpdate(
    { key },
    { $inc: { sequenceValue: 1 } },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  ).exec();

  if (!updated) {
    // In the unlikely event the upsert didn't return a doc
    const created = await Counter.create({ key, sequenceValue: 1 });
    return created.sequenceValue;
  }

  return updated.sequenceValue;
};

export default Counter;
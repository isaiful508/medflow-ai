import Counter from "./counter.model";

export const getNextSequenceValue = async (key: string) => {
  const counter = await Counter.findOneAndUpdate(
    { key },
    {
      $inc: { sequenceValue: 1 },
    },
    {
      new: true,
      upsert: true,
    }
  );

  return counter.sequenceValue;
};

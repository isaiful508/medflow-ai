import { Schema, model } from "mongoose";
import { TCounter } from "./counter.interface";

const counterSchema = new Schema<TCounter>(
  {
    key: {
      type: String,
      required: true,
      unique: true,
    },
    sequenceValue: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    versionKey: false,
  }
);

const Counter = model<TCounter>("Counter", counterSchema);

export default Counter;

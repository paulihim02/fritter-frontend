import { Types, PopulatedDoc, Document } from "mongoose";
import { Schema, model } from "mongoose";
import type { User } from "../user/model";

// Type definition for Circle on the backend
export type Circle = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  ownerId: Types.ObjectId; // owner of circle
  rank: number;
  userId: Types.ObjectId;
};

export type PopulatedCircle = Circle & {
  ownerId: User;
  userId: User;
};

const CircleSchema = new Schema<Circle>({
  ownerId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  rank: { type: Number, required: true, max: 3, min: 1 },
  userId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
});

const CircleModel = model<Circle>("Circle", CircleSchema);
export default CircleModel;

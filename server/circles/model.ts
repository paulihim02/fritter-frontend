import { Types, PopulatedDoc, Document } from "mongoose";
import { Schema, model } from "mongoose";
import type { User } from "../user/model";

// Type definition for Circle on the backend
export type Circle = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  ownerID: Types.ObjectId; // owner of circle
  rank: number;
  userIDs: Types.ObjectId[];
};

export type PopulatedCircle = Circle & {
  ownerID: User;
  userIDs: User[];
};

const CircleSchema = new Schema<Circle>({
  ownerID: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  rank: { type: Number, required: true, unqiue: true, max: 3, min: 0 },
  userIDs: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  ],
});

const CircleModel = model<Circle>("Circle", CircleSchema);
export default CircleModel;

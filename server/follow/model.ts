import { Freet } from "../freet/model";
import type { Types, PopulatedDoc, Document } from "mongoose";
import { Schema, model } from "mongoose";
import type { User } from "../user/model";

// Type definition for Follower on the backend
// personOne follows personTwo
export type Follow = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  personOneId: Types.ObjectId;
  personTwoId: Types.ObjectId;
  timeStamp: Date;
};

export type PopulatedFollow = Follow & {
  personTwoId: User;
};

// Mongoose schema definition for interfacing with a MongoDB table
// Freets stored in this table will have these fields, with the
// type given by the type property, inside MongoDB
const FollowSchema = new Schema<Follow>({
  // The author userId
  personOneId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  personTwoId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  // The content of the freet
  timeStamp: { type: Date, required: true, default: Date.now },
});

const FollowModel = model<Follow>("Follow", FollowSchema);
export default FollowModel;

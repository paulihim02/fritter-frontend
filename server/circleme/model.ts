import { Circle } from "../circles/model";
import { Freet } from "../freet/model";
import { Types, PopulatedDoc, Document } from "mongoose";
import { Schema, model } from "mongoose";
import type { User } from "../user/model";

// Type definition for Circle on the backend
export type CircleMe = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  circleId: Types.ObjectId; // owner of circleId
  freetId: Types.ObjectId;
  canShare: Boolean;
  canComment: Boolean;
  canRefreet: Boolean;
};

export type PopulatedCircleMe = CircleMe & {
  circleId: Circle;
  freetId: Freet;
};

const CircleMeSchema = new Schema<CircleMe>({
  circleId: { type: Schema.Types.ObjectId, required: true, ref: "Circle" },
  freetId: { type: Schema.Types.ObjectId, required: true, ref: "Freet" },

  canShare: { type: Boolean, required: true },
  canComment: { type: Boolean, required: true },
  canRefreet: { type: Boolean, required: true },
});

const CircleMeModel = model<CircleMe>("CircleMe", CircleMeSchema);
export default CircleMeModel;

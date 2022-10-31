import { Freet } from "../freet/model";
import type { Types, PopulatedDoc, Document } from "mongoose";
import { Schema, model } from "mongoose";
import type { User } from "../user/model";

/**
 * This file defines the properties stored in a Freet
 * DO NOT implement operations here ---> use collection file
 */

// Type definition for Vally on the backend
export type Vally = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  freetId: Types.ObjectId;
  userId: Types.ObjectId;
  points: number;
};

export type PopulatedVally = Vally & {
  freetId: Freet;
  userId: User;
};

// Mongoose schema definition for interfacing with a MongoDB table
// Freets stored in this table will have these fields, with the
// type given by the type property, inside MongoDB
const VallySchema = new Schema<Vally>({
  freetId: {
    // Use Types.ObjectId outside of the schema
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Freet",
  },
  userId: {
    // Use Types.ObjectId outside of the schema
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  points: { type: Number, required: true },
});

const VallyModel = model<Vally>("Vally", VallySchema);
export default VallyModel;

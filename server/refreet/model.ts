import { Freet } from "../freet/model";
import type { Types, PopulatedDoc, Document } from "mongoose";
import { Schema, model } from "mongoose";
import type { User } from "../user/model";

/**
 * This file defines the properties stored in a Freet
 * DO NOT implement operations here ---> use collection file
 */

// Type definition for Freet on the backend
export type Refreet = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  freetId: Types.ObjectId;
  refreeterId: Types.ObjectId;
  caption: string;
  timeStamp: Date;
  dateModified: Date;
};

export type PopulatedRefreet = Refreet & {
  freetId: Freet;
};

// Mongoose schema definition for interfacing with a MongoDB table
// Freets stored in this table will have these fields, with the
// type given by the type property, inside MongoDB
const RefreetSchema = new Schema<Refreet>({
  // The author userId
  freetId: {
    // Use Types.ObjectId outside of the schema
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Freet",
  },
  // The content of the freet
  caption: {
    type: String,
    required: true,
    default: "",
  },
  refreeterId: { type: Schema.Types.ObjectId, required: true, ref: "User" },

  timeStamp: { type: Date, required: true, default: Date.now },
  dateModified: { type: Date, required: true, default: Date.now },
});

const RefreetModel = model<Refreet>("Refreet", RefreetSchema);
export default RefreetModel;

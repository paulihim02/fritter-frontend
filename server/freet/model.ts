import type { Types, PopulatedDoc, Document } from "mongoose";
import { Schema, model } from "mongoose";
import type { User } from "../user/model";

/**
 * This file defines the properties stored in a Freet
 * DO NOT implement operations here ---> use collection file
 */

// Type definition for Freet on the backend
export type Freet = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  authorID: Types.ObjectId;
  content: string;
  timeStamp: Date;
  dateModified: Date;
};

export type PopulatedFreet = Freet & {
  authorID: User;
};

// Mongoose schema definition for interfacing with a MongoDB table
// Freets stored in this table will have these fields, with the
// type given by the type property, inside MongoDB
const FreetSchema = new Schema<Freet>({
  // The author userId
  authorID: {
    // Use Types.ObjectId outside of the schema
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  // The content of the freet
  content: {
    type: String,
    required: true,
  },

  timeStamp: { type: Date, required: true, default: Date.now },
  dateModified: { type: Date, required: true, default: Date.now },
});

const FreetModel = model<Freet>("Freet", FreetSchema);
export default FreetModel;

import { Types } from "mongoose";
import { Schema, model } from "mongoose";

/**
 * This file defines the properties stored in a User
 * DO NOT implement operations here ---> use collection file
 */

// Type definition for User on the backend
export type User = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  username: string;
  password: string;
  following: Types.ObjectId[];
  followers: Types.ObjectId[];
  freets: Types.ObjectId[];
  dateJoined: Date;
};

// Mongoose schema definition for interfacing with a MongoDB table
// Users stored in this table will have these fields, with the
// type given by the type property, inside MongoDB
const UserSchema = new Schema<User>({
  // The user's username
  username: {
    type: String,
    required: true,
  },
  // The user's password
  password: {
    type: String,
    required: true,
  },
  // The date the user joined
  dateJoined: {
    type: Date,
    required: true,
    default: Date.now,
  },
  followers: [
    { type: Schema.Types.ObjectId, required: true, default: [], ref: "User" },
  ],
  following: [
    { type: Schema.Types.ObjectId, required: true, default: [], ref: "User" },
  ],
  freets: [
    { type: Schema.Types.ObjectId, required: true, default: [], ref: "Freet" },
  ],
});

const UserModel = model<User>("User", UserSchema);
export default UserModel;

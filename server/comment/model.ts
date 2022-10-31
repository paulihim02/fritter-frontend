import { Freet } from "../freet/model";
import type { Types } from "mongoose";
import { Schema, model } from "mongoose";
import { User } from "../user/model";

/**
 * This file defines the properties stored in a Freet
 * DO NOT implement operations here ---> use collection file
 */

// Type definition for Freet on the backend
export type Comment = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  freetItemId: Types.ObjectId;
  commentItemId: Types.ObjectId;
  isAFreetComment: Boolean; // comment is on a freet or on a comment
  content: string;
  authorId: Types.ObjectId;
  timeStamp: Date;
  dateModified: Date;
};

export type PopulatedComment = Comment & {
  freetItemId?: Freet;
  commentItemId?: Comment;
  authorId: User;
};

const CommentSchema = new Schema<Comment>({
  freetItemId: {
    // Use Types.ObjectId outside of the schema
    type: Schema.Types.ObjectId,
    ref: "Freet",
  },
  commentItemId: {
    // Use Types.ObjectId outside of the schema
    type: Schema.Types.ObjectId,
    ref: "Comment",
  },
  // The content of the comment
  content: {
    type: String,
    required: true,
    default: "",
  },

  authorId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },

  isAFreetComment: { type: Boolean, required: true, default: true },
  timeStamp: { type: Date, required: true, default: Date.now },
  dateModified: { type: Date, required: true, default: Date.now },
});

const CommentModel = model<Comment>("Comment", CommentSchema);
export default CommentModel;

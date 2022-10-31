import type { HydratedDocument, Types } from "mongoose";
import UserCollection from "../user/collection";
import CommentModel, { PopulatedComment } from "./model";

/**
 * This files contains a class that has the functionality to explore freets
 * stored in MongoDB, including adding, finding, updating, and deleting freets.
 * Feel free to add additional operations in this file.
 */
class CommentCollection {
  /**
   * Add a Refreet to the collection
   *
   * @param {Boolean} isAFreetComment - what the comment was on
   * @param {string} content
   * @param {string} authorId
   * @param {Freet} freetItemId - freetItem if the comment was on a freet
   * @param {Comment} commentItemId - commentItem if the comment was on a comment
   * @return {Promise<HydratedDocument<PopulatedComment>>} - The newly created refreet
   */
  static async addOne(
    isAFreetComment: Boolean,
    content: string,
    authorId: Types.ObjectId | string,
    freetItemId?: Types.ObjectId | string,
    commentItemId?: Types.ObjectId | string
  ): Promise<HydratedDocument<PopulatedComment>> {
    const comment = new CommentModel({
      isAFreetComment,
      content,
      authorId,
      freetItemId,
      commentItemId,
    });
    await comment.save(); // Saves freet to MongoDB
    return comment.populate("freetItemId commentItemId authorId");
  }

  /**
   * Find comment by commentId
   *
   * @param {string} commentId - The id of the comment to find
   * @return {Promise<HydratedDocument<Comment>> | Promise<null> } - comment with the given freetId, if any
   */
  static async findOne(
    commentId: Types.ObjectId | string
  ): Promise<HydratedDocument<PopulatedComment>> {
    return CommentModel.findOne({ _id: commentId }).populate(
      "freetItemId commentItemId"
    );
  }

  /**
   * Get all the comments in the database
   *
   * @return {Promise<HydratedDocument<PopulatedComment>[]>} - An array of all of the PopulatedComments
   */
  static async findAll(): Promise<Array<HydratedDocument<PopulatedComment>>> {
    // Retrieves freets and sorts them from most to least recent
    return CommentModel.find({})
      .sort({ timeStamp: -1 })
      .populate("freetItemId commentItemId authorId");
  }

  /**
   * Get all the comments in by given author
   *
   * @param {string} username - The username of author of the comment
   * @return {Promise<HydratedDocument<PopulatedComment>[]>} - An array of all of the comments
   */
  static async findAllByUsername(
    username: string
  ): Promise<Array<HydratedDocument<PopulatedComment>>> {
    const author = await UserCollection.findOneByUsername(username);

    return CommentModel.find({ authorId: author._id }).populate(
      "freetItemId commentItemId authorId"
    );
  }

  /**
   * Update a comment with new content
   *
   * @param {string} commentId - The id of the freet to be updated
   * @param {string} content - The new content of the comment
   * @return {Promise<HydratedDocument<PopulatedComment>>} - The newly updated comment
   */
  static async updateOne(
    commentId: Types.ObjectId | string,
    content: string
  ): Promise<HydratedDocument<PopulatedComment>> {
    const comment = await CommentModel.findOne({ _id: commentId });
    comment.content = content;
    comment.dateModified = new Date();
    await comment.save();
    return comment.populate("freetItemId commentItemId authorId");
  }

  /**
   * Delete a comment with given commentId.
   *
   * @param {string} commentId - The commentId of freet to delete
   * @return {Promise<Boolean>} - true if the freet has been deleted, false otherwise
   */
  static async deleteOne(commentId: Types.ObjectId | string): Promise<boolean> {
    const freet = await CommentModel.deleteOne({ _id: commentId });
    return freet !== null;
  }

  /**
   * Delete all the comments by the given author
   *
   * @param {string} authorId - The id of author of comment
   */
  static async deleteMany(authorId: Types.ObjectId | string): Promise<void> {
    CommentModel.deleteMany({ authorId });
    return;
  }
}

export default CommentCollection;

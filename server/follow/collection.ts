import type { HydratedDocument, Types } from "mongoose";
import type { PopulatedFollow } from "./model";
import UserCollection from "../user/collection";
import FollowModel from "./model";

/**
 * This files contains a class that has the functionality to explore freets
 * stored in MongoDB, including adding, finding, updating, and deleting freets.
 * Feel free to add additional operations in this file.
 *
 */
class FollowCollection {
  /**
   * Add a follow to the collection
   *
   * @param {Types.ObjectId} personOneId - ID of user doing the following
   * @param {Types.ObjectId} personTwoId - The ID of the user to follow
   * @return {Promise<HydratedDocument<PopulatedFollow>>} - The newly created follow
   */
  static async addOne(
    personOneId: Types.ObjectId | string,
    personTwoId: Types.ObjectId | string
  ): Promise<HydratedDocument<PopulatedFollow>> {
    const follow = new FollowModel({
      personOneId,
      personTwoId,
    });
    await follow.save(); // Saves freet to MongoDB
    return follow.populate("personTwoId");
  }

  /**
   * Find a follow by ID
   *
   * @param {string} followID - ID of the follow mongoose object
   * @return {Promise<HydratedDocument<PopulatedFollow>> | Promise<null> } - The follow associated with this ID, if any
   */
  static async findOne(
    followID: Types.ObjectId | string
  ): Promise<HydratedDocument<PopulatedFollow>> {
    return FollowModel.findOne({ _id: followID }).populate("personTwoId");
  }

  /**
   * Get all the follows in DB
   *
   * @return {Promise<HydratedDocument<PopulatedFollow>[]>} - An array of all of the follows
   */
  static async findAll(): Promise<Array<HydratedDocument<PopulatedFollow>>> {
    // Retrieves freets and sorts them from most to least recent
    return FollowModel.find({}).sort({ timeStamp: -1 }).populate("personTwoId");
  }

  /**
   * Get all the follows of a username
   *
   * @param {string} username
   * @return {Promise<HydratedDocument<PopulatedFollow>[]>} - An array of all of the follows
   */
  static async findAllByUsername(
    username: string
  ): Promise<Array<HydratedDocument<PopulatedFollow>>> {
    const author = await UserCollection.findOneByUsername(username);

    return FollowModel.find({ personOneId: author._id }).populate(
      "personTwoId"
    );
  }

  /**
   * Delete a follow with given followID.
   *
   * @param {string} followID - The followID of freet to delete
   * @return {Promise<Boolean>} - true if the freet has been deleted, false otherwise
   */
  static async deleteOne(followID: Types.ObjectId | string): Promise<boolean> {
    const freet = await FollowModel.deleteOne({ _id: followID });
    return freet !== null;
  }

  /**
   * Delete all the follows by the given userID
   *
   * @param {string} userID
   */
  static async deleteMany(userID: Types.ObjectId): Promise<void> {
    await FollowModel.deleteMany({ personOneId: userID });
    return;
  }
  /**
   * Delete all the follows by the given userID
   *
   * @param {string} userID
   */
  static async deleteManyReverse(userID: Types.ObjectId): Promise<void> {
    await FollowModel.deleteMany({ personTwoId: userID });
    return;
  }
}

export default FollowCollection;

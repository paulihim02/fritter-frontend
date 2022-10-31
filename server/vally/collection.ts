import type { HydratedDocument, Types } from "mongoose";
import type { PopulatedVally } from "./model";
import UserCollection from "../user/collection";
import VallyModel from "./model";

/**
 * This files contains a class that has the functionality to explore freets
 * stored in MongoDB, including adding, finding, updating, and deleting freets.
 * Feel free to add additional operations in this file.
 *
 */
class VallyCollection {
  /**
   * Add a Vally to the collection
   *
   * @param {Types.ObjectId} freetId - The freetId of the vally
   * @param {Types.ObjectId} userId - The userId of the vally
   * @param {number} points - points (positive/negative) based on strength of vally
   * @return {Promise<HydratedDocument<PopulatedVally>>} - The newly created vally
   */
  static async addOne(
    freetId: Types.ObjectId | string,
    userId: Types.ObjectId | string,
    points: number
  ): Promise<HydratedDocument<PopulatedVally>> {
    const vally = new VallyModel({
      freetId,
      userId,
      points,
    });

    await vally.save(); // Saves freet to MongoDB
    return vally.populate("freetId userId");
  }

  /**
   * Find a vally by freetId and userId
   *
   * @param {string} freetId - The freetId associated with vally we want to find
   * @param {string} userId - The userId associated with vally we want to find
   * @return {Promise<HydratedDocument<PopulatedVally>> | Promise<null> } - The vally with the given freetId, if any
   */
  static async findOneByFreetUserId(
    freetId: Types.ObjectId | string,
    userId: Types.ObjectId | string
  ): Promise<HydratedDocument<PopulatedVally>> {
    return VallyModel.findOne({ freetId, userId }).populate("freetId userId");
  }
  /**
   * Find a vally by freetId
   *
   * @param {string} freetId - The freetId associated with vally we want to find
   * @return {Promise<HydratedDocument<PopulatedVally>> | Promise<null> } - The vally with the given freetId, if any
   */
  static async findOneByFreetId(
    freetId: Types.ObjectId | string
  ): Promise<HydratedDocument<PopulatedVally>> {
    return VallyModel.findOne({ freetId }).populate("freetId userId");
  }

  /**
   * Find a vally by userId
   *
   * @param {string} userId - The userId associated with vally we want to find
   * @return {Promise<HydratedDocument<PopulatedVally>> | Promise<null> } - The vally with the given userId, if any
   */
  static async findOneByUserId(
    userId: Types.ObjectId | string
  ): Promise<HydratedDocument<PopulatedVally>> {
    return VallyModel.findOne({ userId }).populate("freetId userId");
  }

  /**
   * Find a vally by vallyId
   *
   * @param {string} vallyId - The vallyId associated with vally we want to find
   * @return {Promise<HydratedDocument<PopulatedVally>> | Promise<null> } - The vally with the given vallyId, if any
   */
  static async findOne(
    id: Types.ObjectId | string
  ): Promise<HydratedDocument<PopulatedVally>> {
    return VallyModel.findOne({ _id: id }).populate("freetId userId");
  }
  /**
   * Get all the vally in the database
   *
   * @return {Promise<HydratedDocument<PopulatedVally>[]>} - An array of all of the vallys
   */
  static async findAll(): Promise<Array<HydratedDocument<PopulatedVally>>> {
    // Retrieves freets and sorts them from most to least recent
    return VallyModel.find({}).populate("freetId userId");
  }

  /**
   * Get all the freets in by given author
   *
   * @param {string} username - The username of author of the vally
   * @return {Promise<HydratedDocument<PopulatedVally>[]>} - An array of all of the vallys
   */
  static async findAllByUsername(
    username: string
  ): Promise<Array<HydratedDocument<PopulatedVally>>> {
    const author = await UserCollection.findOneByUsername(username);
    console.log("finding by username");
    return VallyModel.find({ userId: author._id }).populate("freetId userId");
  }

  /**
   * Update a vally with the new points
   *
   * @param {string} points - The points that should be the updated vally
   * @return {Promise<HydratedDocument<PopulatedVally>>} - The newly updated vally
   */
  static async updateOne(
    vallyId: Types.ObjectId | string,
    points: number
  ): Promise<HydratedDocument<PopulatedVally>> {
    const vally = await this.findOne(vallyId);
    vally.points = points;
    await vally.save();
    return vally.populate("freetId userId");
  }

  /**
   * Delete a vally with given vallyId.
   *
   * @param {string} vallyId - The vallyId of vally to delete
   * @return {Promise<Boolean>} - true if the vally has been deleted, false otherwise
   */
  static async deleteOne(vallyId: Types.ObjectId | string): Promise<boolean> {
    const vally = await VallyModel.deleteOne({ _id: vallyId });
    return vally !== null;
  }

  /**
   * Delete all the vally by the given filter
   *
   * @param {string} filter - The id of author of freets
   */
  static async deleteMany(filter: any): Promise<void> {
    await VallyModel.deleteMany(...filter);
    return;
  }
}

export default VallyCollection;

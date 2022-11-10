import type { HydratedDocument, Types } from "mongoose";
import type { PopulatedRefreet, Refreet } from "./model";
import RefreetModel from "./model";
import UserCollection from "../user/collection";
import FreetCollection from "../freet/collection";

/**
 * This files contains a class that has the functionality to explore freets
 * stored in MongoDB, including adding, finding, updating, and deleting freets.
 * Feel free to add additional operations in this file.
 *
 * Note: HydratedDocument<Freet> is the output of the FreetModel() constructor,
 * and contains all the information in Freet. https://mongoosejs.com/docs/typescript.html
 */
class RefreetCollection {
  /**
   * Add a Refreet to the collection
   *
   * @param {Freet} freetId - The freetId of the refreet
   * @param {string} caption - caption of refreet
   * @return {Promise<HydratedDocument<PopulatedRefreet>>} - The newly created refreet
   */
  static async addOne(
    freetId: Types.ObjectId | string,
    caption: string,
    refreeterId: string
  ): Promise<HydratedDocument<Refreet>> {
    const refreet = new RefreetModel({
      freetId,
      caption,
      refreeterId,
    });
    await refreet.save(); // Saves freet to MongoDB
    return refreet.populate("freetId refreeterId");
  }

  /**
   * Find a refreet by freetId
   *
   * @param {string} RefreetId - The id of the refreet to find
   * @return {Promise<HydratedDocument<Refreet>> | Promise<null> } - The refreet with the given freetId, if any
   */
  static async findOne(
    freetId: Types.ObjectId | string
  ): Promise<HydratedDocument<PopulatedRefreet>> {
    return await RefreetModel.findOne({ _id: freetId }).populate(
      "freetId refreeterId"
    );
  }

  /**
   * Get all the refreets in the database
   *
   * @return {Promise<HydratedDocument<PopulatedRefreet>[]>} - An array of all of the refreets
   */
  static async findAll(): Promise<Array<HydratedDocument<PopulatedRefreet>>> {
    // Retrieves freets and sorts them from most to least recent
    return await RefreetModel.find({})
      .sort({ timeStamp: -1 })
      .populate("freetId refreeterId");
  }

  /**
   * Get all the freets in by given author
   *
   * @param {string} username - The username of author of the refreets
   * @return {Promise<HydratedDocument<PopulatedRefreet>[]>} - An array of all of the refreets
   */
  static async findAllByUsername(
    username: string
  ): Promise<Array<HydratedDocument<PopulatedRefreet>>> {
    const author = await UserCollection.findOneByUsername(username);
    console.log("finding by username");

    return await RefreetModel.find({ refreeterId: author._id }).populate(
      "freetId refreeterId"
    );
  }

  /**
   * Update a refreet with the new caption
   *
   * @param {string} freetId - The id of the freet to be updated
   * @param {string} caption - The new caption of the refreet
   * @return {Promise<HydratedDocument<PopulatedRefreet>>} - The newly updated refreet
   */
  static async updateOne(
    refreetID: Types.ObjectId | string,
    caption: string
  ): Promise<HydratedDocument<PopulatedRefreet>> {
    const refreet = await RefreetModel.findOne({ _id: refreetID });
    refreet.caption = caption;
    refreet.dateModified = new Date();
    await refreet.save();
    return refreet.populate("freetId refreeterId");
  }

  /**
   * Delete a refreet with given freetId.
   *
   * @param {string} refreetId - The refreetId of freet to delete
   * @return {Promise<Boolean>} - true if the freet has been deleted, false otherwise
   */
  static async deleteOne(refreetId: Types.ObjectId | string): Promise<boolean> {
    const refreet = await RefreetModel.deleteOne({ _id: refreetId });
    return refreet !== null;
  }

  /**
   * Delete all the refreets by the given author
   *
   * @param {string} authorID - The id of author of freets
   */
  static async deleteMany(authorID: Types.ObjectId | string): Promise<void> {
    const user = await UserCollection.findOneByUserId(authorID);

    if (!user) {
      return;
    }

    const { username } = user;

    const freets = (await FreetCollection.findAllByUsername(username)).map(
      (freet) => this.deleteOne(freet._id)
    );

    await Promise.all(freets);
    return;
  }
}

export default RefreetCollection;

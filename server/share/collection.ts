import type { HydratedDocument, Types } from "mongoose";
import type { PopulatedShare } from "./model";
import UserCollection from "../user/collection";
import ShareModel from "./model";

/**
 * This files contains a class that has the functionality to explore freets
 * stored in MongoDB, including adding, finding, updating, and deleting freets.
 * Feel free to add additional operations in this file.
 *
 */
class VallyCollection {
  /**
   * Add a Share to the collection
   *
   * @param {Types.ObjectId} freetId - The freetId of the share
   * @param {Types.ObjectId} audienceId - The Id of what freet will be shared with
   * @param {Types.ObjectId} sharedById - The Id of who's sharing
   * @return {Promise<HydratedDocument<PopulatedShare>>} - The newly created share
   */
  static async addOne(
    freetId: Types.ObjectId | string,
    audienceId: Types.ObjectId | string,
    sharedById: Types.ObjectId | string
  ): Promise<HydratedDocument<PopulatedShare>> {
    const share = new ShareModel({
      freetId,
      audienceId,
      sharedById,
    });

    await share.save(); // Saves freet to MongoDB
    return share.populate("freetId audienceId sharedById");
  }

  /**
   * Find a share by freetId and audienceId
   *
   * @param {string} freetId - The freetId associated with vally we want to find
   * @param {Types.ObjectId} audienceId - The Id associated with share we want to find
   * @param {Types.ObjectId} sharedById - The Id of who's sharing
   * @return {Promise<HydratedDocument<PopulatedShare>> | Promise<null> } the share, if any
   */
  static async findOneByFreetAudienceSharedById(
    freetId: Types.ObjectId | string,
    audienceId: Types.ObjectId | string,
    sharedById: Types.ObjectId | string
  ): Promise<HydratedDocument<PopulatedShare>> {
    return ShareModel.findOne({
      freetId,
      audienceId,
      sharedById,
    }).populate("freetId audienceId sharedById");
  }

  /**
   * Find a share by freetId
   *
   * @param {string} freetId - The freetId associated with share we want to find
   * @return {Promise<HydratedDocument<PopulatedShare>> | Promise<null> } - The share with the given freetId, if any
   */
  static async findOneByFreetId(
    freetId: Types.ObjectId | string
  ): Promise<HydratedDocument<PopulatedShare>> {
    return ShareModel.findOne({ freetId }).populate(
      "freetId audienceId sharedById"
    );
  }

  /**
   * Find a share by audienceId
   *
   * @param {string} audienceId - The audienceId associated with share we want to find
   * @return {Promise<HydratedDocument<PopulatedShare>> | Promise<null> } - The share with the given audienceId, if any
   */
  static async findOneByAudienceId(
    audienceId: Types.ObjectId | string
  ): Promise<HydratedDocument<PopulatedShare>> {
    return ShareModel.findOne({ audienceId }).populate(
      "freetId audienceId sharedById"
    );
  }

  /**
   * Find a share by sharedById
   *
   * @param {string} SharedById - The SharedById associated with share we want to find
   * @return {Promise<HydratedDocument<PopulatedShare>> | Promise<null> } - The share with the given SharedById, if any
   */
  static async findOneBySharedById(
    sharedById: Types.ObjectId | string
  ): Promise<HydratedDocument<PopulatedShare>> {
    return ShareModel.findOne({ sharedById }).populate(
      "freetId audienceId sharedById"
    );
  }

  /**
   * Find share by shareId
   *
   * @param {string} shareId - The shareId associated with share we want to find
   * @return {Promise<HydratedDocument<PopulatedShare>> | Promise<null> } - The share with the given shareId, if any
   */
  static async findOne(
    id: Types.ObjectId | string
  ): Promise<HydratedDocument<PopulatedShare>> {
    return ShareModel.findOne({ _id: id }).populate(
      "freetId audienceId sharedById"
    );
  }
  /**
   * Get all the share in the database
   *
   * @return {Promise<HydratedDocument<PopulatedShare>[]>} - An array of all of the share
   */
  static async findAll(): Promise<Array<HydratedDocument<PopulatedShare>>> {
    return ShareModel.find({}).populate("freetId audienceId sharedById");
  }

  /**
   * Get share s.t. sharedById is the author(username)
   *
   * @param {string} username - The username of author of the share
   * @return {Promise<HydratedDocument<PopulatedShare>[]>} - An array of all of the share
   */
  static async findAllByUsername(
    username: string
  ): Promise<Array<HydratedDocument<PopulatedShare>>> {
    const author = await UserCollection.findOneByUsername(username);
    return ShareModel.find({ sharedById: author._id }).populate(
      "freetId audienceId sharedById"
    );
  }

  /**
   * Delete a share with given shareId.
   *
   * @param {string} shareId - The shareId of vally to delete
   * @return {Promise<Boolean>} - true if the vally has been deleted, false otherwise
   */
  static async deleteOne(shareId: Types.ObjectId | string): Promise<boolean> {
    const share = await ShareModel.deleteOne({ _id: shareId });
    return share !== null;
  }

  /**
   * Delete all the share by the given filter
   *
   * @param {string} filter - The id of author of freets
   */
  static async deleteMany(filter: any): Promise<void> {
    await ShareModel.deleteMany(...filter);
    return;
  }
}

export default VallyCollection;

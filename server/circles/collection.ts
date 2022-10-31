import { HydratedDocument, Types } from "mongoose";
import type { Circle } from "./model";
import FreetModel from "./model";
import UserCollection from "../user/collection";
import { User } from "../user/model";
import CircleModel from "./model";

class CircleCollection {
  /**
   * Add a circle to the collection
   *
   * @param {Types.ObjectId} author - The author (user) of the circle
   * @param {number} rank - The level to add the user to
   * @return {Promise<HydratedDocument<Circle>>} - The updated Circle
   */
  static async addOne(
    ownerID: Types.ObjectId,
    rank: number
  ): Promise<HydratedDocument<Circle>> {
    // console.log("rank", rank);
    const newCircle = new CircleModel({
      ownerID,
      rank,
    });

    return (await newCircle.save()).populate("ownerID");
  }

  /**
   * Get specific circle of user
   *
   * @param {Types.ObjectId} ownerID - The ID to get
   * @param {number} rank - circle rank to get
   * @return {Promise<HydratedDocument<Circle>> | Promise<null> } - The circle with matching ownerID, if any
   */
  static async findOne(
    ownerID: string | Types.ObjectId,
    rank: number
  ): Promise<HydratedDocument<Circle>> {
    // console.log("finding Circle for", ownerID, rank);
    return await CircleModel.findOne({
      ownerID,
      rank,
    }).populate("ownerID");
  }

  /**
   * Get all the circles in DataBase
   *
   * @return {Promise<HydratedDocument<Circle>[]>} - An array of all the circles
   */
  static async findAll(): Promise<Array<HydratedDocument<Circle>>> {
    // console.log("finding All Circles!", await CircleModel.find({}));

    return await CircleModel.find({}).populate("ownerID");
  }

  /**
   * Get all the circles by given author
   *
   * @param {string} ownerID - The ownerID of author of a circle
   * @return {Promise<HydratedDocument<Freet>[]>} - Array of circles author owns
   */
  static async findAllByownerID(
    ownerID: string | Types.ObjectId
  ): Promise<Array<HydratedDocument<Circle>>> {
    return CircleModel.find({ ownerID }).populate("ownerID");
  }

  /**
   * Update a circle with the new content
   *
   * @param {string} ownerID - circle owned by this person
   * @param {number} rank -
   * @param {string} updateID - The ID to be added/removed
   * @param {boolean} removeUser - toggle of add or remove a user
   * @return {Promise<HydratedDocument<Circle>>} - The newly updated circle
   */
  static async update(
    ownerID: Types.ObjectId,
    rank: number,
    updateID: string | Types.ObjectId,
    add: boolean
  ): Promise<HydratedDocument<Circle>> {
    // console.log("attempting to update user of ID:", updateID);

    // we first get the circle
    const circle = await this.findOne(ownerID, rank);
    // console.log("circ", circle);
    // get userIds in the circle
    const { userIDs } = circle;
    const objectUpdateID = new Types.ObjectId(updateID);

    if (!UserCollection.findOneByUserId(objectUpdateID)) {
      return; // do nothing if userID invalid
    }

    // we always add the user to the array initially (at last position)
    const updatedUserId = [
      ...userIDs.filter(
        (userID) => userID.toString() !== objectUpdateID.toString()
      ),
      objectUpdateID,
    ];

    // console.log("updated User IDs", updatedUserId);
    !add ? updatedUserId.pop() : "";
    // console.log("updated User IDs", updatedUserId);

    // update circle
    circle.userIDs = updatedUserId;
    return await circle.save();
  }

  /**
   * Update a circle with the new content
   *
   * @param {string} ownerID - circle author owns that user will be removed from
   * @param {number} rank
   * @param {string} updateID - The userID to be removed
   * @return {Promise<HydratedDocument<Circle>>} - The newly updated circle
   */
  static async removeFromCircle(
    ownerID: Types.ObjectId,
    rank: number,
    updateIDs: Array<string | Types.ObjectId>
  ): Promise<HydratedDocument<Circle>> {
    // console.log("removing");
    const allUpdates = [...new Set(updateIDs)].map((updateID) => {
      return this.update(ownerID, rank, updateID, false);
    });

    await Promise.all(allUpdates);
    return allUpdates[0]; // return circle
  }

  /**
   * Update a circle with the new content
   *
   * @param {string} ownerID - circle author owns that user will be removed from
   * @param {number} rank
   * @param {string} updateIDs - The userIDs to be added
   * @return {Promise<HydratedDocument<Circle>>} - The newly updated circle
   */
  static async addToCircle(
    ownerID: Types.ObjectId,
    rank: number,
    updateIDs: Array<string | Types.ObjectId>
  ): Promise<HydratedDocument<Circle>> {
    // console.log("adding");
    const allUpdates = [...new Set(updateIDs)].map((updateID) => {
      return this.update(ownerID, rank, updateID, true);
    });

    await Promise.all(allUpdates);
    return allUpdates[0]; // return circle
  }

  /**
   * Delete a circle associated with given username.
   *
   * @param {Types.ObjectId} ownerID
   * @param {number} rank
   * @return {Promise<Boolean>} - true if the circle has been deleted, false otherwise
   */
  static async deleteOne(ownerID: string, rank: number): Promise<boolean> {
    return (
      (await CircleModel.deleteOne({
        ownerID,
        rank,
      })) !== null
    );
  }
}

export default CircleCollection;

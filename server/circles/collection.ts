import { HydratedDocument, Types } from "mongoose";
import type { Circle } from "./model";
import UserCollection from "../user/collection";
import CircleModel from "./model";

class CircleCollection {
  /**
   * Add a circle to the collection
   *
   * @param {Types.ObjectId} author - The author (user) of the circle
   * @param userId: Types.ObjectId,
   * @param {number} rank - The level to add the user to
   * @return {Promise<HydratedDocument<Circle>>} - The updated Circle
   */
  static async addOne(
    ownerId: Types.ObjectId,
    userId: Types.ObjectId,
    rank: number
  ): Promise<HydratedDocument<Circle>> {
    const newCircle = new CircleModel({
      ownerId,
      userId,
      rank,
    });

    await CircleModel.deleteMany({ ownerId, userId, rank }); // remove duplicates

    return (await newCircle.save()).populate("userId ownerId");
  }

  /**
   * Get specific circle of user
   *
   * @param {Types.ObjectId} ownerId - The ID to get
   * @param {number} rank - circle rank to get
   * @return {Promise<HydratedDocument<Circle>> | Promise<null> } - The circle with matching ownerId, if any
   */
  static async findOne(
    ownerId: string | Types.ObjectId,
    rank: number
  ): Promise<HydratedDocument<Circle>> {
    return await CircleModel.findOne({
      ownerId,
      rank,
    }).populate("userId ownerId");
  }

  /**
   * Get all the circles in DataBase
   *
   * @return {Promise<HydratedDocument<Circle>[]>} - An array of all the circles
   */
  static async findAll(): Promise<Array<HydratedDocument<Circle>>> {
    return await CircleModel.find({}).populate("userId ownerId");
  }

  /**
   * Get all the circles in DataBase
   *
   * @return {Promise<HydratedDocument<Circle>[]>} - An array of all the circles
   */
  static async findAllByRankOwnwerId(
    ownerId: string | Types.ObjectId,
    rank: number
  ): Promise<Array<HydratedDocument<Circle>>> {
    return await CircleModel.find({ ownerId, rank }).populate("userId ownerId");
  }

  /**
   * Get all the circles by given author
   *
   * @param {string} ownerId - The ownderId of a circle
   * @return {Promise<HydratedDocument<Freet>[]>} - Array of circles author owns
   */
  static async findAllByOwnerId(
    ownerId: string | Types.ObjectId
  ): Promise<Array<HydratedDocument<Circle>>> {
    return CircleModel.find({ ownerId })
      .sort({ rank: 1 })
      .populate("userId ownerId");
  }

  /**
   * Get all the circles by given author
   *
   * @param {string} ownerId - The ownderId of a circle
   * @return {Promise<HydratedDocument<Freet>[]>} - Array of circles author owns
   */
  static async findAllByRankUserId(
    userId: string | Types.ObjectId,
    rank: number
  ): Promise<Array<HydratedDocument<Circle>>> {
    return CircleModel.find({ userId, rank }).populate("userId ownerId");
  }

  /**
   * Delete a circle associated with given userId.
   *
   * @param {Types.ObjectId} userId
   * @param {number} rank
   * @return {Promise<Boolean>} - true if the circle has been deleted, false otherwise
   */
  static async deleteOne(userId: string, rank: number): Promise<boolean> {
    return !!(await CircleModel.deleteOne({ userId, rank }));
  }
}

export default CircleCollection;

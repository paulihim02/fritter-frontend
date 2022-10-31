import { HydratedDocument, Types } from "mongoose";
import type { CircleMe, PopulatedCircleMe } from "./model";
import UserCollection from "../user/collection";
import CircleMeModel from "./model";

class CircleMeCollection {
  /**
   * Add a circleMe to the collection
   *
   * @param {Types.ObjectId} circleId - id of the circle
   * @param {Types.ObjectId} freetId - id of the freet
   * @return {Promise<HydratedDocument<PopulatedCircleMe>>} - The updated Circle
   */
  static async addOne(
    circleId: Types.ObjectId,
    freetId: Types.ObjectId,
    canShare: Boolean,
    canRefreet: Boolean,
    canComment: Boolean
  ): Promise<HydratedDocument<PopulatedCircleMe>> {
    console.log("addOne", circleId, freetId, canShare, canRefreet, canComment);

    const newCircleMe = new CircleMeModel({
      circleId,
      freetId,
      canShare,
      canRefreet,
      canComment,
    });

    return (await newCircleMe.save()).populate("circleId freetId");
  }

  /**
   * Get CircleMe based on ID
   *
   * @param {Types.ObjectId} circleMeId - The ID to get
   * @return {Promise<HydratedDocument<PopulatedCircleMe>> | Promise<null> } - The circleMe with matching circleMeId, if any
   */
  static async findOne(
    circleMeId: string | Types.ObjectId
  ): Promise<HydratedDocument<PopulatedCircleMe>> {
    return await CircleMeModel.findOne({
      _id: circleMeId,
    }).populate("circleId freetId");
  }

  /**
   * Get all the circleMes in DataBase
   *
   * @return {Promise<HydratedDocument<Circle>[]>} - An array of all the circleMe
   */
  static async findAll(): Promise<Array<HydratedDocument<PopulatedCircleMe>>> {
    return await CircleMeModel.find({}).populate("circleId freetId");
  }

  /**
   * Get all the circleMe by given author
   *
   * @param {string} ownerId - The ownerId of the circle of circleMe
   * @return {Promise<HydratedDocument<PopulatedCircleMe>[]>} - Array of circleMes author owns
   */
  static async findAllByCircleId(
    ownerId: string | Types.ObjectId
  ): Promise<Array<HydratedDocument<PopulatedCircleMe>>> {
    const circles: Array<HydratedDocument<PopulatedCircleMe>> =
      await CircleMeModel.find({}).populate("circleId freetId");

    const filteredCircles = circles.filter(
      (circle) => circle.circleId.ownerID.toString() === ownerId.toString()
    );

    return filteredCircles;
  }

  /**
   * Update a circleMe with the new permissions
   *
   * @param {string} circleMeId
   * @param {boolean} canRefreet
   * @param {boolean} canComment
   * @param {boolean} canShare
   * @return {Promise<HydratedDocument<PopulatedCircleMe>>} - The newly updated circle
   */
  static async update(
    circleMeId: Types.ObjectId,
    canRefreet: boolean,
    canComment: boolean,
    canShare: boolean
  ): Promise<HydratedDocument<PopulatedCircleMe>> {
    // we first get the circle
    const circleMe = await this.findOne(circleMeId);
    console.log("circ", circleMe);
    circleMe.canRefreet = canRefreet;
    circleMe.canShare = canShare;
    circleMe.canComment = canComment;

    return await circleMe.save();
  }

  /**
   * Delete a circleMe basedon circleMeId
   *
   * @param {Types.ObjectId} circleMeId
   * @return {Promise<Boolean>} - true if the circle has been deleted, false otherwise
   */
  static async deleteOne(
    circleMeId: string | Types.ObjectId
  ): Promise<boolean> {
    return (
      (await CircleMeModel.deleteOne({
        _id: circleMeId,
      })) !== null
    );
  }
}

export default CircleMeCollection;

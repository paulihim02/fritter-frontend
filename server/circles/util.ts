import type { Types, HydratedDocument } from "mongoose";
import moment from "moment";
import type { Circle, PopulatedCircle } from "./model";
import { User } from "../user/model";

// Update this if you add a property to the Circle type!
type CircleResponse = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  rank: number;
  ownerId: string; // owner of circle
  userId: Types.ObjectId;
};

/**
 * Transform a raw Circle object from the database into an object
 * with all the information needed by the frontend
 *
 * @param {HydratedDocument<Circle>} circle
 * @returns {CircleResponse} - The circle object formatted for the frontend
 */
const constructCircleResponse = (
  circle: HydratedDocument<Circle>
): CircleResponse => {
  if (!circle) {
    return;
  }

  const circleCopy: PopulatedCircle = {
    ...circle.toObject({
      versionKey: false, // Cosmetics; prevents returning of __v property
    }),
  };

  console.log(circleCopy.ownerId);
  return {
    ...circleCopy,
    ownerId: JSON.stringify(circleCopy.ownerId).replace("\\", ""),
  };
};

export { constructCircleResponse };

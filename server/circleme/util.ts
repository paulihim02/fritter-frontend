import type { Types, HydratedDocument } from "mongoose";
import moment from "moment";
import type { CircleMe, PopulatedCircleMe } from "./model";

// Update this if you add a property to the Circle type!
type CircleMeResponse = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  circle: any;
  freet: any;
  permissions: { canRefreet: boolean; canShare: boolean; canComment: boolean };
};

/**
 * Transform a raw Circle object from the database into an object
 * with all the information needed by the frontend
 *
 * @param {HydratedDocument<PopulatedCircleMe>}
 * @returns {CircleMeResponse} - The circle object formatted for the frontend
 */
const constructCircleMeResponse = (
  circleMe: HydratedDocument<PopulatedCircleMe>
): CircleMeResponse => {
  const circleMeCopy: PopulatedCircleMe = {
    ...circleMe.toObject({
      versionKey: false, // Cosmetics; prevents returning of __v property
    }),
  };

  // // console.log(circleMeCopy.);
  return {
    _id: circleMeCopy._id,
    circle: circleMeCopy.circleId,
    freet: circleMeCopy.freetId,
    permissions: {
      canRefreet: circleMeCopy.canRefreet as boolean,
      canComment: circleMeCopy.canComment as boolean,
      canShare: circleMeCopy.canShare as boolean,
    },
  };
};

export { constructCircleMeResponse };

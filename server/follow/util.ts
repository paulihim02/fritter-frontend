import type { HydratedDocument } from "mongoose";
import moment from "moment";
import { PopulatedFollow, Follow } from "./model";

// Update this if you add a property to the Freet type!
type FollowResponse = {
  _id: string;
  user: string;
  following: string;
  timeStamp: string;
};

/**
 * Encode a date as an unambiguous string
 *
 * @param {Date} date - A date object
 * @returns {string} - formatted date as string
 */
const formatDate = (date: Date): string =>
  moment(date).format("MMMM Do YYYY, h:mm:ss a");

/**
 * Transform a raw Freet object from the database into an object
 * with all the information needed by the frontend
 *
 * @param {HydratedDocument<Freet>} freet - A freet
 * @returns {FreetResponse} - The freet object formatted for the frontend
 */
const constructFollowResponse = (
  follow: HydratedDocument<PopulatedFollow>
): FollowResponse => {
  return {
    _id: follow._id.toString(),
    user: follow.personOneId.toString(),
    following: follow.personTwoId.username.toString(),
    timeStamp: formatDate(follow.timeStamp),
  };
};

export { constructFollowResponse };

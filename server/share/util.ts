import type { HydratedDocument } from "mongoose";
import moment from "moment";
import { PopulatedShare } from "./model";

// Update this if you add a property to the Freet type!
type ShareResponse = {
  _id: string;
  freetId: string;
  freetContent: string;
  sharedWith: string;
  sharedBy: string;
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
 * Transform a raw Share object from the database into an object
 * with all the information needed by the frontend
 *
 * @param {HydratedDocument<PopulatedShare>} vally
 * @returns {ShareResponse} - The share object formatted for the frontend
 */
const constructShareResponse = (
  share: HydratedDocument<PopulatedShare>
): ShareResponse => {
  const { freetId, audienceId, sharedById } = share;
  return {
    _id: share._id.toString(),
    freetId: freetId._id.toString(),
    freetContent: freetId.content,
    sharedWith: audienceId.username,
    sharedBy: sharedById.username,
  };
};

export { constructShareResponse };

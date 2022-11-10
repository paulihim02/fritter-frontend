import type { HydratedDocument } from "mongoose";
import moment from "moment";
import { PopulatedShare } from "./model";

// Update this if you add a property to the Freet type!
type ShareResponse = {
  _id: any;
  freetId: any;
  sharedById: any;
  freetContent: string;
  audienceId: any;
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
  share: HydratedDocument<PopulatedShare> | any
): ShareResponse => {
  const { freetId, audienceId, sharedById, _id } = share;
  return {
    _id,
    freetId: share.freetId,
    sharedById: share.sharedById,
    audienceId: share.audienceId,
    freetContent: freetId.content,
    sharedWith: audienceId.username,
    sharedBy: sharedById.username,
  };
};

export { constructShareResponse };

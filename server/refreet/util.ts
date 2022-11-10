import type { HydratedDocument } from "mongoose";
import moment from "moment";
import type { Freet, PopulatedFreet } from "../freet/model";
import { PopulatedRefreet, Refreet } from "./model";

// Update this if you add a property to the Freet type!
type RefreetResponse = {
  originalAuthor: any;
  refreeter: any;
  caption: string;
  timeStamp: string;
  dateModified: string;
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
const constructRefreetResponse = (
  refreet: HydratedDocument<Refreet>
): RefreetResponse => {
  const refreetCopy: PopulatedRefreet = {
    ...refreet.toObject({
      versionKey: false, // Cosmetics; prevents returning of __v property
    }),
  };

  return {
    ...refreetCopy,
    refreeter: refreetCopy.refreeterId,
    originalAuthor: refreetCopy.freetId,
    timeStamp: formatDate(refreetCopy.timeStamp),
    dateModified: formatDate(refreetCopy.dateModified),
  };
};

export { constructRefreetResponse };

import type { HydratedDocument } from "mongoose";
import moment from "moment";
import type { Freet, PopulatedFreet } from "../freet/model";
import { PopulatedVally } from "./model";

// Update this if you add a property to the Freet type!
type VallyResponse = {
  _id: string;
  freetId: string;
  freetContent: string;
  valliedBy: string;
  vallyStrength: number;
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
 * Transform a raw Vally object from the database into an object
 * with all the information needed by the frontend
 *
 * @param {HydratedDocument<PopulatedVally>} vally
 * @returns {VallyResponse} - The vally object formatted for the frontend
 */
const constructVallyResponse = (
  vally: HydratedDocument<PopulatedVally>
): VallyResponse => {
  const { freetId, userId } = vally;
  console.log("vally util", {
    _id: vally._id.toString(),
    freetId: freetId._id.toString(),
    freetContent: freetId.content,
    valliedBy: userId.username,
    vallyStrength: vally.points,
  });
  return {
    _id: vally._id.toString(),
    freetId: freetId._id.toString(),
    freetContent: freetId.content,
    valliedBy: userId.username,
    vallyStrength: vally.points,
  };
};

export { constructVallyResponse };

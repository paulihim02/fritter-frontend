import type { Request, Response, NextFunction } from "express";
import { Types } from "mongoose";
import * as FreetValidator from "../freet/middleware";
import ShareCollection from "./collection";

/**
 * Checks if a freet with freetId is req.params exists
 */
const isShareExists = async (
  req: Request,
  res: Response,
  next: NextFunction,
  returnBool?: boolean
) => {
  const shareId = req.body.shareId || req.params.shareId || req.query.shareId;

  const freetId = req.body.freetId || req.params.freetId || req.query.freetId;
  const audienceId =
    req.body.audienceId || req.params.audienceId || req.query.audienceId;

  const sharedById =
    req.body.sharedById || req.params.sharedById || req.query.sharedById;

  const share = await ShareCollection.findOne(shareId);
  const shareFreetAud = await ShareCollection.findOneByFreetAudienceSharedById(
    freetId,
    audienceId,
    sharedById
  );

  if (returnBool) {
    return !!(share || shareFreetAud);
  }

  return !!(share || shareFreetAud)
    ? next()
    : res.status(404).json({ error: "share could not be found" });
};

const isShareNotExists = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // console.log("from return", isShareExists(req, res, next, true));
  return !(await isShareExists(req, res, next, true))
    ? next()
    : res.status(400).json({
        message: "this share already exists. do you want to edit it?",
      });
};

const isNotShareCycle = async (
  // sharing something with yourself
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const audienceId =
    req.body.audienceId || req.params.audienceId || req.query.audienceId;

  return audienceId === req.session.userId
    ? res.status(400).json({ message: "cannot share something with yourself!" })
    : next();
};

const isValidShareId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const shareId = req.body.shareId || req.params.shareId || req.query.shareId;

  return Types.ObjectId.isValid(shareId)
    ? next()
    : res.status(400).json({
        message: "shareId is not a valid Id",
      });
};

const isValidShareModifier = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const shareId = req.body.shareId || req.params.shareId || req.query.shareId;

  const share = await ShareCollection.findOne(shareId);

  return share.sharedById._id.toString() === req.session.userId
    ? next()
    : res
        .status(403)
        .json({ message: "you cannot modify another user's share" });
};

export {
  isShareExists,
  isShareNotExists,
  isValidShareId,
  isValidShareModifier,
  isNotShareCycle,
};

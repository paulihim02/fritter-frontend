import type { Request, Response, NextFunction } from "express";
import { Types } from "mongoose";
import * as freetValidator from "../freet/middleware";
import FollowCollection from "./collection";
import RefreetCollection from "./collection";

/**
 * Checks if user can delete follow
 */
const isValidModifier = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const followId =
    req.params.followId || req.body.followId || req.query.followId;
  const validFormat = Types.ObjectId.isValid(followId);

  if (!validFormat) {
    return res.status(404).json({
      message: "follow with this id was not found",
    });
  }
  const follow = await FollowCollection.findOne(followId);

  if (!follow) {
    return res.status(404).json({
      message: "follow with this id was not found",
    });
  }

  return !follow.personOneId.toString() === req.session.userId
    ? res.status(404).json({
        message: "you're not allowed to modify someone else's follow",
      })
    : next();
};

const isFollowIdExists = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const followId =
    req.params.followId || req.body.followId || req.query.followId;

  return !(await FollowCollection.findOne(followId))
    ? res.status(404).json({ error: "Follow of this ID could not be found" })
    : next();
};

export { isValidModifier, isFollowIdExists };

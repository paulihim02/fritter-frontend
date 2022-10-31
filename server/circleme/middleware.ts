import type { Request, Response, NextFunction } from "express";
import FreetCollection from "../freet/collection";
import { Types } from "mongoose";
import CircleMeCollection from "./collection";
import CircleMeModel, { CircleMe } from "./model";

/* Checks if a user can make a circle */
const isAllowedToMakeCircleMe = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { freetId, circleId } = req.body;

  const circleCount = await CircleMeModel.count({ circleId, freetId });

  // we shouldn't have seen this pair of circleMe before; since the number of circles is at most
  // 3, we'd have at most three circleMes per freet

  return circleCount > 0
    ? res.status(400).json({
        message:
          "cannot add circle to circleMe; circle already exists in circleMe",
      })
    : next();
};

/**
 * Checks if the current user is the author of the freet whose freetId is in req.params
 */
const isAllowedToUpdateCircle = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { circleMeId } = req.body;

  const circleMe = await CircleMeCollection.findOne(circleMeId);
  console.log("id is", circleMeId, circleMe, req.session.userId);
  return circleMe.circleId.ownerID.toString() === req.session.userId
    ? next()
    : res.status(400).json({
        message: "you're not allowed to update other people's circleMe's!",
      });
};

const isCircleMeExists = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const circleMeId =
    req.body.circleMeId || req.query.circleMeId || req.params.circleMeId;
  console.log("heree3");
  return Types.ObjectId.isValid(circleMeId)
    ? !!(await CircleMeCollection.findOne(circleMeId))
      ? next()
      : res.status(404).json({ message: "circle could not be found" })
    : res.status(400).json({ message: "circleMeId is not a valid ID" });
};

const isFreetExistsCircleMe = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { circleMeId, freetId } = req.params;

  const freet = await FreetCollection.findOne(freetId);

  const circleMe = await CircleMeCollection.findOne(circleMeId);

  return circleMe.freetId._id.toString() === freet._id.toString()
    ? next()
    : res.status(400).json({
        message: "this freet is not included in this circleMe",
      });
};

export {
  isAllowedToMakeCircleMe,
  isAllowedToUpdateCircle,
  isCircleMeExists,
  isFreetExistsCircleMe,
};

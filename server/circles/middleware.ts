import type { Request, Response, NextFunction } from "express";
import { Types } from "mongoose";
import CircleCollection from "./collection";
import CircleModel, { Circle } from "./model";

/* Checks if a user can make a circle */
const isAllowedToMakeCircle = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!Types.ObjectId.isValid(req.session.userId)) {
    return res.status(404).json({
      error: {
        invalidOwnerID: `${req.session.userId} is not a valid ID. Circle for this user could not be found.`,
      },
    });
  }

  const circles = await CircleCollection.findAllByownerID(req.session.userId);

  const uniqueRank = circles.reduce(
    (prevCircle, currCircle: Circle) => prevCircle.add(currCircle.rank),
    new Set<number>()
  );

  const rankConstraints = {
    // at most three circles, one of each rank, and rank should be positive
    rankLEQTwo: Math.max(...uniqueRank) < 3,
    rankGEQZero: Math.min(...uniqueRank) >= 0,
  };

  if (
    Object.values(rankConstraints).every((constraint: boolean) => constraint)
  ) {
    return next(); // allowed to create if all constraints are satisfied
  }

  return res.status(400).json({
    error: {
      canCreateCircle: `Unfortunately, you're not allowed to create more than three circles!`,
    },
  });
};

/**
 * Checks if the current user is the author of the freet whose freetId is in req.params
 */
const isAllowedToUpdateCircle = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const circleId =
    req.query.circleId || req.params.circleId || req.body.circleId;

  const circle = await CircleModel.findOne({ _id: circleId });

  if (req.session.userId !== circle.ownerID.toString()) {
    res.status(403).json({
      error: "Cannot modify other users' circles.",
    });
    return;
  }
  next();
};

const isCircleExists = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let circleId = req.body.circleId || req.query.circleId || req.params.circleId;
  circleId = circleId.trim();

  return Types.ObjectId.isValid(circleId)
    ? (await CircleModel.find({ _id: circleId }))
      ? next()
      : res.status(404).json({ message: "circle could not be found" })
    : res.status(400).json({ message: "circleId is not a valid ID" });
};

export { isAllowedToMakeCircle, isAllowedToUpdateCircle, isCircleExists };

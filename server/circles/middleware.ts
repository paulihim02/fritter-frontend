import type { Request, Response, NextFunction } from "express";
import { Types } from "mongoose";
import CircleCollection from "./collection";
import CircleModel, { Circle } from "./model";

const isCircleExists = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { userId, rank } = req.body;

  const circle = await CircleCollection.findAllByRankUserId(userId, rank);

  return circle ? next() : res.status(404).json({ error: "circle not found" });
};

const isCircleNotExists = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  return !isCircleExists(req, res, next);
};

const isValidRank = async (req: Request, res: Response, next: NextFunction) => {
  const rank = req.body.rank || req.query.rank || req.params.rank;

  try {
    return 1 <= parseInt(rank) && parseInt(rank) <= 3
      ? next()
      : res.status(500).json({ error: "circle rank is not a valid rank" });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ error: "circle rank is not a valid rank" });
  }
};

export { isCircleExists, isCircleNotExists, isValidRank };

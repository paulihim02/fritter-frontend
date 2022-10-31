import type { Request, Response, NextFunction } from "express";
import { Types } from "mongoose";
import * as freetValidator from "../freet/middleware";
import RefreetCollection from "./collection";

/**
 * Checks if a freet with freetId is req.params exists
 */
const isRefreetExists = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const validFormat = Types.ObjectId.isValid(req.params.refreetID);
  const freet = validFormat
    ? await RefreetCollection.findOne(req.params.refreetID)
    : "";
  if (!freet) {
    res.status(404).json({
      error: {
        refreetNotFound: `refreet with ID ${req.params.refreetID} does not exist.`,
      },
    });
    return;
  }

  next();
};

/**
 * Checks if the content of the freet in req.body is valid, i.e not a stream of empty
 * spaces and not more than 140 characters
 */
const isValidRefreetCaption = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { caption } = req.body;
  if (!caption.trim()) {
    return res.status(400).json({
      error: "Refreet caption must be at least one character long.",
    });
  }

  if (caption.length > 140) {
    return res.status(413).json({
      error: "Refreet caption must be no more than 140 characters.",
    });
  }

  return next();
};

/**
 * Checks if the current user is the author of the freet whose freetId is in req.params
 */
const isValidRefreetModifier = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const ID = req.params.refreetID || req.body.refreetID || req.query.refreetID;
  const validFormat = Types.ObjectId.isValid(ID);
  console.log("ID", req.params, req.query, req.body, ID);

  if (!validFormat) {
    return res.status(404).json({
      error: "Refreet could not be found",
    });
  }

  const refreet = await RefreetCollection.findOne(ID);

  if (req.session.userId !== refreet.refreeterId.toString()) {
    return res.status(403).json({
      error: "Cannot modify other users' refreets.",
    });
  }

  return next();
};

const isValidRefreetID = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  return !(await RefreetCollection.findOne(req.params.refreetID))
    ? res.status(404).json({ error: "Refreet of this ID could not be found" })
    : next();
};

export {
  isValidRefreetCaption,
  isRefreetExists,
  isValidRefreetModifier,
  isValidRefreetID,
};

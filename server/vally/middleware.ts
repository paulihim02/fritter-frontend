import type { Request, Response, NextFunction } from "express";
import { Types } from "mongoose";
import * as FreetValidator from "../freet/middleware";
import VallyCollection from "./collection";

/**
 * Checks if a freet with freetId is req.params exists
 */
const isVallyExists = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const vallyId = req.body.vallyId || req.params.vallyId || req.query.vallyId;
  const freetId = req.body.freetId || req.params.freetId || req.query.freetId;

  const vally = await VallyCollection.findOne(vallyId);
  const vallyFreetId = await VallyCollection.findOneByFreetUserId(
    freetId,
    req.session.userId
  );

  return !!vally || vallyFreetId
    ? next()
    : res.status(404).json({ error: "this vally could not be found" });
};

const isVallyNotExist = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const freetId = req.body.freetId || req.params.freetId || req.query.freetId;

  const vally = await VallyCollection.findOneByFreetUserId(
    freetId,
    req.session.userId
  );
  return !vally
    ? next()
    : res.status(400).json({
        message: "this vally already exists. do you want to edit it?",
      });
};

const isValidVallyId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const vallyId = req.body.vallyId || req.params.vallyId || req.query.vallyId;
  console.log("valid vallid", vallyId);
  return Types.ObjectId.isValid(vallyId)
    ? next()
    : res.status(400).json({
        message: "vallyId is not a valid vally Id",
      });
};

/**
 * Checks if the content of the freet in req.body is valid, i.e not a stream of empty
 * spaces and not more than 140 characters
 */
const isValidVallyScore = (req: Request, res: Response, next: NextFunction) => {
  const points = req.body.points || req.params.points || req.query.points;
  return -5 <= points && points <= 5
    ? next()
    : res.status(400).json({
        message: "vally points are outside of accepted ranges (-5 to 5)",
      });
};

/**
 * Checks if the current user is the author of the freet whose freetId is in req.params
 */
const isValidVallyModifier = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const vallyId = req.body.vallyId || req.params.vallyId || req.query.vallyId;

  const vally = await VallyCollection.findOne(vallyId);

  return vally.userId._id.toString() === req.session.userId
    ? next()
    : res
        .status(403)
        .json({ message: "you cannot modify another user's vally" });
};

export {
  isValidVallyScore,
  isVallyExists,
  isVallyNotExist,
  isValidVallyId,
  isValidVallyModifier,
};

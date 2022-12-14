import type { Request, Response, NextFunction } from "express";
import { Types } from "mongoose";
import FreetCollection from "../freet/collection";

/**
 * Checks if a freet with freetId is req.params exists
 */
const isFreetExists = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const ID = req.params.freetId || req.body.freetId || req.query.freetId;
  const validFormat = Types.ObjectId.isValid(ID);

  const freet = validFormat ? await FreetCollection.findOne(ID) : "";

  if (!freet) {
    res.status(404).json({
      error: `Freet with this ID does not exist.`,
    });
    return;
  }

  next();
};

/**
 * Checks if the content of the freet in req.body is valid, i.e not a stream of empty
 * spaces and not more than 140 characters
 */
const isValidFreetContent = (
  req: Request,
  res: Response,
  next: NextFunction,
  nonFreet?: { type: string }
) => {
  const { content } = req.body;
  if (!content.trim()) {
    res.status(400).json({
      error: `${
        nonFreet ? nonFreet.type : "Freet"
      } content must be at least one character long.`,
    });
    return;
  }

  if (content.length > 140) {
    res.status(413).json({
      error: `${
        nonFreet ? nonFreet.type : "Freet"
      } content must be no more than 140 characters.`,
    });
    return;
  }

  next();
};

/**
 * Checks if the current user is the author of the freet whose freetId is in req.params
 */
const isValidFreetModifier = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const freetId = req.params.freetId || req.body.freetId || req.query.freetId;
  const freet = await FreetCollection.findOne(freetId);
  const userId = freet.authorID._id;
  if (req.session.userId !== userId.toString()) {
    res.status(403).json({
      error: "Cannot modify other users' freets.",
    });
    return;
  }

  next();
};

export { isValidFreetContent, isFreetExists, isValidFreetModifier };

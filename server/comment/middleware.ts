import type { Request, Response, NextFunction } from "express";
import FreetCollection from "../freet/collection";
import { Types } from "mongoose";
import * as FreetValidator from "../freet/middleware";
import CommentCollection from "./collection";

/**
 * Checks if a freet with freetItemId is req.params exists
 */
const isValidCommentExists = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { freetComment } = req.query;
  const { freetItemId } = req.body;
  const commentItemId =
    req.body.commentItemId ||
    req.params.commentItemId ||
    req.query.commentItemId;

  if (!freetComment && !Types.ObjectId.isValid(commentItemId)) {
    return res.status(404).json({ error: "cannot find comment with this id" });
  }

  if (freetComment && !Types.ObjectId.isValid(freetItemId)) {
    return res.status(404).json({ error: "cannot find freet with this id" });
  }

  // commenting on freet
  if (freetComment) {
    const freet = await FreetCollection.findOne(freetItemId);
    return freet
      ? next()
      : res
          .status(404)
          .json({ error: "freet could not be found with this Id" });
  }

  const comment = await CommentCollection.findOne(commentItemId);

  return comment
    ? next()
    : res
        .status(404)
        .json({ error: "comment could not be found with this ID" });
};

/**
 * Checks if the content of the freet in req.body is valid, i.e not a stream of empty
 * spaces and not more than 140 characters
 */
const isValidCommentContent = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  return FreetValidator.isValidFreetContent(req, res, next, {
    type: "comment",
  });
};

/**
 * Checks if the current user is the author of the freet whose freetItemId is in req.params
 */
const isValidCommentModifier = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const commentItemId =
    req.body.commentItemId ||
    req.query.commentItemId ||
    req.params.commentItemId;

  const comment = await CommentCollection.findOne(commentItemId);

  if (comment.authorId.toString() !== req.session.userId) {
    return res
      .status(403)
      .json({ error: "you cannot edit someone else's comment" });
  }

  return next();
};

export { isValidCommentContent, isValidCommentModifier, isValidCommentExists };

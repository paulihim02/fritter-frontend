import type { Request, Response, NextFunction } from "express";
import FreetCollection from "../freet/collection";
import { Types } from "mongoose";
import * as FreetValidator from "../freet/middleware";
import CommentCollection from "./collection";

/**
 * Checks if a freet with freetId is req.params exists
 */
const isValidCommentExists = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { freetComment } = req.query;
  const { freetId } = req.body;
  const commentId =
    req.body.commentId || req.params.commentId || req.query.commentId;

  console.log(
    "free comment",
    freetComment,
    commentId,
    Types.ObjectId.isValid(commentId)
  );

  if (!freetComment && !Types.ObjectId.isValid(commentId)) {
    return res
      .status(404)
      .json({ message: "cannot find comment with this id" });
  }

  if (freetComment && !Types.ObjectId.isValid(freetId)) {
    return res.status(404).json({ message: "cannot find freet with this id" });
  }

  // commenting on freet
  if (freetComment) {
    const freet = await FreetCollection.findOne(freetId);
    return freet
      ? next()
      : res
          .status(404)
          .json({ message: "freet could not be found with this Id" });
  }

  const comment = await CommentCollection.findOne(commentId);

  return comment
    ? next()
    : res
        .status(404)
        .json({ message: "comment could not be found with this ID" });
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
 * Checks if the current user is the author of the freet whose freetId is in req.params
 */
const isValidCommentModifier = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const commentId =
    req.body.commentId || req.query.commentId || req.params.commentId;

  const comment = await CommentCollection.findOne(commentId);

  if (comment.authorId.toString() !== req.session.userId) {
    return res
      .status(403)
      .json({ message: "you cannot edit someone else's comment" });
  }

  return next();
};

export { isValidCommentContent, isValidCommentModifier, isValidCommentExists };

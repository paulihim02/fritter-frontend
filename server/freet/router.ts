import type { NextFunction, Request, Response } from "express";
import express from "express";
import FreetCollection from "./collection";
import * as userValidator from "../user/middleware";
import * as freetValidator from "../freet/middleware";
import * as util from "./util";
import FreetModel from "./model";

const router = express.Router();

router.use("/", async (req: Request, res: Response, next: NextFunction) => {
  const freetsWithDeletedAuthors = (await FreetCollection.findAll()).filter(
    (freet) => !freet.authorID
  );

  const freetsToDelete = freetsWithDeletedAuthors.map((freet) =>
    FreetModel.deleteOne({ _id: freet._id })
  );

  await Promise.all(freetsToDelete);

  return next();
});

/**
 * Get all the freets
 *
 * @name GET /api/freets
 *
 * @return {FreetResponse[]} - A list of all the freets sorted in descending
 *                      order by date modified
 * @throws {400} - If ownerId is not given
 * @throws {404} - If no user has given ownerId
 *
 */
router.get(
  "/",
  async (req: Request, res: Response, next: NextFunction) => {
    const { username } = req.query;

    if (username) {
      return next();
    }

    const allFreets = await FreetCollection.findAll();
    const response = allFreets.map(util.constructFreetResponse);
    return res.status(200).json(response);
  },
  [userValidator.isUsernameExists],
  async (req: Request, res: Response) => {
    const { username } = req.query;
    const freets = await FreetCollection.findAllByUsername(username as string);
    const response = freets.map(util.constructFreetResponse);
    return res.status(200).json(response);
  }
);

/**
 * Create a new freet.
 *
 * @name POST /api/freets
 *
 * @param {string} content - The content of the freet
 * @return {FreetResponse} - The created freet
 * @throws {403} - If the user is not logged in
 * @throws {400} - If the freet content is empty or a stream of empty spaces
 * @throws {413} - If the freet content is more than 140 characters long
 */
router.post(
  "/",
  [userValidator.isUserLoggedIn, freetValidator.isValidFreetContent],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? ""; // Will not be an empty string since its validated in isUserLoggedIn
    const freet = await FreetCollection.addOne(userId, req.body.content);

    res.status(201).json({
      message: "Your freet was created successfully.",
      freet: util.constructFreetResponse(freet),
    });
  }
);

/**
 * gets a specific freet with ID.
 *
 * @name POST /api/freets/freetId
 *
 * @param {string} content - The content of the freet
 * @return {FreetResponse} - The created freet
 * @throws {403} - If the user is not logged in
 * @throws {400} - If the freet content is empty or a stream of empty spaces
 * @throws {413} - If the freet content is more than 140 characters long
 */
router.get(
  "/:freetId",
  [userValidator.isUserLoggedIn],
  async (req: Request, res: Response) => {
    const freet = await FreetCollection.findOne(req.params.freetId);

    return res.status(201).json({
      message: "found freet.",
      freet: util.constructFreetResponse(freet),
    });
  }
);

/**
 * Delete a freet
 *
 * @name DELETE /api/freets/:id
 *
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in or is not the author of
 *                 the freet
 * @throws {404} - If the freetId is not valid
 */
router.delete(
  "/:freetId?",
  [
    userValidator.isUserLoggedIn,
    freetValidator.isFreetExists,
    freetValidator.isValidFreetModifier,
  ],
  async (req: Request, res: Response) => {
    await FreetCollection.deleteOne(req.params.freetId);
    res.status(200).json({
      message: "Your freet was deleted successfully.",
    });
  }
);

/**
 * Modify a freet
 *
 * @name PATCH /api/freets/:id
 *
 * @param {string} content - the new content for the freet
 * @return {FreetResponse} - the updated freet
 * @throws {403} - if the user is not logged in or not the author of
 *                 of the freet
 * @throws {404} - If the freetId is not valid
 * @throws {400} - If the freet content is empty or a stream of empty spaces
 * @throws {413} - If the freet content is more than 140 characters long
 */
router.patch(
  "/:freetId?",
  [
    userValidator.isUserLoggedIn,
    freetValidator.isFreetExists,
    freetValidator.isValidFreetModifier,
    freetValidator.isValidFreetContent,
  ],
  async (req: Request, res: Response) => {
    const freet = await FreetCollection.updateOne(
      req.params.freetId,
      req.body.content
    );
    res.status(200).json({
      message: "Your freet was updated successfully.",
      freet: util.constructFreetResponse(freet),
    });
  }
);

export { router as freetRouter };

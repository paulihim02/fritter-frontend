import type { NextFunction, Request, Response } from "express";
import express from "express";
import RefreetCollection from "./collection";
import * as userValidator from "../user/middleware";
import * as freetValidator from "../freet/middleware";
import * as refreetValidator from "./middleware";
import RefreetModel from "./model";
import * as util from "./util";

const router = express.Router();

router.use("/", async (req: Request, res: Response, next: NextFunction) => {
  await RefreetModel.deleteMany({ freetId: null }); // we clear our refreets for freets that were deleted in the past
  return next();
});

/**
 * Get all the refreets
 *
 * @name GET /api/refreets
 *
 * @return {RefreetResponse[]} - A list of all the refreets sorted in descending
 *                      order by date modified
 * @throws {400} - If ownerID is not given
 * @throws {404} - If no user has given ownerID
 *
 */
router.get(
  "/",
  async (req: Request, res: Response, next: NextFunction) => {
    const { username } = req.query;
    console.log("username is", username);
    if (username !== undefined) {
      return next();
    }

    const allRefreets = await RefreetCollection.findAll();
    console.log("all refreets", allRefreets);
    const response = allRefreets.map(util.constructRefreetResponse);
    return res.status(200).json(response);
  },
  [userValidator.isUsernameExists],
  async (req: Request, res: Response) => {
    const { username } = req.query;
    const refreets = await RefreetCollection.findAllByUsername(
      username as string
    );
    const response = refreets.map(util.constructRefreetResponse);
    return res.status(200).json(response);
  }
);

/**
 * Create a new refreet.
 *
 * @name POST /api/refreets
 *
 * @param {string} caption - The caption of the refreet
 * @return {RefreetResponse} - The created refreet
 * @throws {403} - If the user is not logged in
 * @throws {400} - If the refreet caption is empty or a stream of empty spaces
 * @throws {413} - If the refreet caption is more than 140 characters long
 */
router.post(
  "/",
  [
    userValidator.isUserLoggedIn,
    refreetValidator.isValidRefreetCaption,
    freetValidator.isFreetExists,
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    console.log("creating refreet");
    const refreet = await RefreetCollection.addOne(
      req.body.freetId,
      req.body.caption,
      req.session.userId
    );

    return res.status(201).json({
      message: `Your refreet was successfully created`,
      refreet: util.constructRefreetResponse(refreet),
    });
  }
);

/**
 * edit a refreet.
 *
 * @name POST /api/refreets/:freet_id
 *
 * @param {string} caption - The caption of the refreet
 * @return {RefreetResponse} - The updated refreet
 * @throws {403} - If user is not logged in
 * @throws {400} - If refreet caption is empty or a stream of empty spaces
 * @throws {413} - If refreet caption is more than 140 characters long
 */
router.put(
  "/:refreetID",
  [
    userValidator.isUserLoggedIn,
    refreetValidator.isValidRefreetCaption,
    refreetValidator.isRefreetExists,
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    console.log("updating refreet", req.params);

    const { refreetID } = req.params;
    const updatedRefreet = await RefreetCollection.updateOne(
      refreetID,
      req.body.caption // caption must exist since valid caption
    );

    return res.status(201).json({
      message: "Your refreet was updated successfully.",
      refreet: util.constructRefreetResponse(updatedRefreet),
    });
  }
);

/**
 * Delete a refreet
 *
 * @name DELETE /api/refreets/:id
 *
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in or is not the author of
 *                 the freet
 * @throws {404} - If the freetId is not valid
 */
router.delete(
  "/:refreetID",
  [
    userValidator.isUserLoggedIn,
    refreetValidator.isValidRefreetModifier,
    refreetValidator.isRefreetExists,
  ],
  async (req: Request, res: Response) => {
    console.log("deleting refreet");
    await RefreetCollection.deleteOne(req.params.refreetID);
    res.status(200).json({
      message: "Your freet was deleted successfully.",
    });
  }
);

/**
 * Modify a refreet
 *
 * @name PUT /api/refreets/:id
 *
 * @param {string} content - the new content for the refreet
 * @return {RefreetResponse} - the updated freet
 * @throws {403} - if the user is not logged in or not the author of
 *                 of the freet
 * @throws {404} - If the freetId is not valid
 * @throws {400} - If the freet content is empty or a stream of empty spaces
 * @throws {413} - If the freet content is more than 140 characters long
 */
router.put(
  "/:freetId?",
  [
    userValidator.isUserLoggedIn,
    refreetValidator.isRefreetExists,
    refreetValidator.isValidRefreetModifier,
    refreetValidator.isValidRefreetCaption,
  ],
  async (req: Request, res: Response) => {
    const refreet = await RefreetCollection.updateOne(
      req.params.freetId,
      req.body.caption
    );
    res.status(200).json({
      message: "Your refreet was updated successfully.",
      freet: util.constructRefreetResponse(refreet),
    });
  }
);

export { router as refreetRouter };

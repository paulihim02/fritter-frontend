import type { NextFunction, Request, Response } from "express";
import express from "express";
import FollowCollection from "./collection";
import * as util from "./util";
import * as userValidator from "../user/middleware";
import * as followValidator from "./middleware";
import FollowModel from "./model";

const router = express.Router();

router.use("/", async (req: Request, res: Response, next: NextFunction) => {
  await FollowModel.deleteMany({
    $or: [{ personOneId: { $eq: null } }, { personTwoId: { $eq: null } }],
  }); // we clear our follows for users deleted
  return next();
});

/**
 * Get all the follows
 *
 * @name GET /api/follows
 *
 * @return {FollowResponse[]} - A list of all the follows sorted in descending
 *                      order by timestamp
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

    const allFollows = await FollowCollection.findAll();
    console.log("all follows", allFollows, await FollowModel.find({}));
    const response = allFollows.map(util.constructFollowResponse);
    return res.status(200).json(response);
  },
  [userValidator.isUsernameExists],
  async (req: Request, res: Response) => {
    const { username } = req.query;
    const follows = await FollowCollection.findAllByUsername(
      username as string
    );
    const response = follows.map(util.constructFollowResponse);
    return res.status(200).json(response);
  }
);

/**
 * Create a new follow.
 *
 * @name POST /api/follows
 *
 * @param {string} id - of the person to follow
 * @return {RefreetResponse} - The created refreet
 * @throws {403} - If the user is not logged in
 * @throws {400} - If the refreet caption is empty or a stream of empty spaces
 * @throws {413} - If the refreet caption is more than 140 characters long
 */
router.post(
  "/",
  [userValidator.isUserLoggedIn, userValidator.isUserIdExists],
  async (req: Request, res: Response, next: NextFunction) => {
    console.log("creating follow");
    const ID = req.body.userId;
    await FollowCollection.deleteManyReverse(ID); // remove duplicates
    const follow = await FollowCollection.addOne(req.session.userId, ID);

    return res.status(201).json({
      message: `follow »» successfully created`,
      follow: util.constructFollowResponse(follow),
    });
  }
);

/**
 * Delete a follow
 *
 * @name DELETE /api/follows/:followID
 *
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in or is not the author of
 *                 the freet
 * @throws {404} - If the freetId is not valid
 */
router.delete(
  "/:followId",
  [
    userValidator.isUserLoggedIn,
    followValidator.isValidModifier,
    followValidator.isFollowIdExists,
  ],
  async (req: Request, res: Response) => {
    console.log("deleting follow", req.params.followId);
    await FollowCollection.deleteOne(req.params.followId);
    res.status(200).json({
      message: "successfully deleted follow.",
    });
  }
);

export { router as followRouter };

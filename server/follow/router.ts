import type { NextFunction, Request, Response } from "express";
import express from "express";
import FollowCollection from "./collection";
import * as util from "./util";
import * as userValidator from "../user/middleware";
import * as followValidator from "./middleware";
import FollowModel, { PopulatedFollow } from "./model";
import UserCollection from "../user/collection";

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
 * @throws {400} - If ownerId is not given
 * @throws {404} - If no user has given ownerId
 *
 */
router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  const allFollows = await FollowCollection.findAll();
  const response = allFollows.map(util.constructFollowResponse);
  return res.status(200).json(response);
});

router.get(
  "/:username",
  [userValidator.isUserLoggedIn, userValidator.isUsernameExists],
  async (req: Request, res: Response) => {
    const { username } = req.params;

    const follows = await FollowCollection.findAllByUsername(
      username as string
    );
    const followedBy: PopulatedFollow[] =
      await FollowCollection.findAllFollowersById(req.session.userId);

    const response = {
      message: "successfully got followers",
      user: req.session.userId,
      following: follows.map((follow) => follow.personTwoId),
      followers: followedBy.map((followBy) => followBy.personOneId),
    };

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
  [userValidator.isUserLoggedIn, userValidator.isUsernameExists],
  async (req: Request, res: Response, next: NextFunction) => {
    const username = req.body.username;
    const user = await UserCollection.findOneByUsername(username);

    if (user._id.toString() === req.session.userId.toString()) {
      return res.status(400).json({ error: "You cannot follow yourself!" });
    }

    await FollowCollection.deleteMany(user._id); // remove duplicates
    const follow = await FollowCollection.addOne(req.session.userId, user._id);

    return res.status(201).json({
      message: `follow »» successfully created`,
      follow: util.constructFollowResponse(follow),
    });
  }
);

/**
 * Delete a follow
 *
 * @name DELETE /api/follows/:username
 *
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in or is not the author of
 *                 the freet
 * @throws {404} - If the username is not valid
 */
router.delete(
  "/:username",
  [userValidator.isUsernameExists, userValidator.isUserLoggedIn],
  async (req: Request, res: Response) => {
    const username = req.params.username;

    const user = await UserCollection.findOneByUsername(username);
    if (user._id.toString() === req.session.userId.toString()) {
      return res.status(400).json({ error: "You cannot unfollow yourself!" });
    }

    await FollowCollection.deleteManyReverse(user._id); // remove duplicates

    res.status(200).json({
      message: "successfully deleted follow.",
    });
  }
);

export { router as followRouter };

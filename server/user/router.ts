import type { Request, Response } from "express";
import express from "express";
import FreetCollection from "../freet/collection";
import UserCollection from "./collection";
import * as userValidator from "../user/middleware";
import * as util from "./util";
import { Types } from "mongoose";

const router = express.Router();

/**
 * Sign in user.
 *
 * @name POST /api/users/session
 *
 * @param {string} username - The user's username
 * @param {string} password - The user's password
 * @return {UserResponse} - An object with user's details
 * @throws {403} - If user is already signed in
 * @throws {400} - If username or password is  not in the correct format,
 *                 or missing in the req
 * @throws {401} - If the user login credentials are invalid
 *
 */
router.post(
  "/session",
  [
    userValidator.isUserLoggedOut,
    userValidator.isValidUsername,
    userValidator.isValidPassword,
    userValidator.isAccountExists,
  ],
  async (req: Request, res: Response) => {
    console.log("post session");
    const user = await UserCollection.findOneByUsernameAndPassword(
      req.body.username,
      req.body.password
    );
    req.session.userId = user._id.toString();
    return res.status(201).json({
      message: "You have logged in successfully",
      user: util.constructUserResponse(user),
    });
  }
);

/**
 * Sign out a user
 *
 * @name DELETE /api/users/session
 *
 * @return - None
 * @throws {403} - If user is not logged in
 *
 */
router.delete(
  "/session",
  [userValidator.isUserLoggedIn],
  (req: Request, res: Response) => {
    req.session.userId = undefined;
    res.status(200).json({
      message: "You have been logged out successfully.",
    });
  }
);

/**
 * Create a user account.
 *
 * @name POST /api/users
 *
 * @param {string} username - username of user
 * @param {string} password - user's password
 * @return {UserResponse} - The created user
 * @throws {403} - If there is a user already logged in
 * @throws {409} - If username is already taken
 * @throws {400} - If password or username is not in correct format
 *
 */
router.post(
  "/",
  [
    userValidator.isUserLoggedOut,
    userValidator.isValidUsername,
    userValidator.isUsernameNotAlreadyInUse,
    userValidator.isValidPassword,
  ],
  async (req: Request, res: Response) => {
    const user = await UserCollection.addOne(
      req.body.username,
      req.body.password
    );
    req.session.userId = user._id.toString();
    res.status(201).json({
      message: `Your account was created successfully. You have been logged in as ${user.username}`,
      user: util.constructUserResponse(user),
    });
  }
);

/**
 * Follow a user
 *
 * @name PUT /api/users/follow
 *
 * @param {string | Types.ObjectId} nameOrID - The user's new username
 * @return {UserResponse} - The updated user
 * @throws {403} - If action is not allowed
 * @throws {404} - If user cannot be identified
 */
router.post(
  "/follow",
  [userValidator.isUserLoggedIn],
  async (req: Request, res: Response) => {
    // first update the person the user is trying to follow so if they don't exist, we catch it
    console.log("following a user", req.body);

    const { follower } = req.body;

    let otherUser;

    try {
      otherUser =
        (await UserCollection.findOneByUsername(follower)) ||
        (await UserCollection.findOneByUserId(follower));
    } catch (e) {
      return res.status(404).json({
        message: "the user you're trying to follow cannot be found",
      });
    }

    if (otherUser._id.toString() === req.session.userId.toString()) {
      return res.status(403).json({
        message: "no matter how cool you are, you can't follow yourself!",
      });
    }

    // go ahead and update users both ways
    const updates = [
      UserCollection.updateOne(req.session.userId, {
        following: [otherUser._id],
      }),
      UserCollection.updateOne(otherUser._id, { followers: [otherUser._id] }),
    ];

    await Promise.all(updates);
    res.status(200).json({
      message: "You're now a fan!",
      updatedProfile: util.constructUserResponse(await updates[0]), // await for typechecking :()
    });
  }
);

/**
 * Update a user's profile.
 *
 * @name PUT /api/users
 *
 * @param {string} username - The user's new username
 * @param {string} password - The user's new password
 * @return {UserResponse} - The updated user
 * @throws {403} - If user is not logged in
 * @throws {409} - If username already taken
 * @throws {400} - If username or password are not of the correct format
 */
router.put(
  "/",
  [
    userValidator.isUserLoggedIn,
    userValidator.isValidUsername,
    userValidator.isUsernameNotAlreadyInUse,
    userValidator.isValidPassword,
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? ""; // Will not be an empty string since its validated in isUserLoggedIn
    const user = await UserCollection.updateOne(userId, req.body);
    res.status(200).json({
      message: "Your profile was updated successfully.",
      user: util.constructUserResponse(user),
    });
  }
);

/**
 * Delete a user.
 *
 * @name DELETE /api/users
 *
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in
 */
router.delete(
  "/",
  [userValidator.isUserLoggedIn],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? ""; // Will not be an empty string since its validated in isUserLoggedIn
    await UserCollection.deleteOne(userId);
    await FreetCollection.deleteMany(userId);
    req.session.userId = undefined;
    res.status(200).json({
      message: "Your account has been deleted successfully.",
    });
  }
);

export { router as userRouter };

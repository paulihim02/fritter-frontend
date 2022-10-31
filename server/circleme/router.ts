import type { NextFunction, Request, Response } from "express";
import e from "express";
import express from "express";
import UserCollection from "../user/collection";
import * as userValidator from "../user/middleware";
import * as freetValidator from "../freet/middleware";
import CircleMeCollection from "./collection";
import * as circleMeValidator from "./middleware";
import * as circleValidator from "../circles/middleware";
import * as util from "./util";
import FreetCollection from "../freet/collection";

const router = express.Router();

/** gets all CircleMes */
router.get("/", async (req: Request, res: Response) => {
  return await CircleMeCollection.findAll()
    .then((circleMe) => {
      const response = circleMe.map(util.constructCircleMeResponse);
      return res.status(200).json(response);
    })
    .catch((e) =>
      res.status(500).json({
        error: `Encounted the following error \n${e}. Please try again later`,
      })
    );
});

router.get(
  "/:username",
  [userValidator.isUsernameExists],
  async (req: Request, res: Response, next: NextFunction) => {
    const { username } = req.params;
    const user = await UserCollection.findOneByUsername(username);
    // console.log("user is", user);
    const circleMes = await CircleMeCollection.findAllByCircleId(user._id);
    // console.log("mes is", circleMes);

    return res.status(201).json({
      message: "successly got circleMes for user",
      circleMes: circleMes.map(util.constructCircleMeResponse),
    });
  }
);

router.get(
  "/test/:circleMeId/:freetId",
  [
    userValidator.isUserLoggedIn,
    freetValidator.isFreetExists,
    circleMeValidator.isCircleMeExists,
    circleMeValidator.isFreetExistsCircleMe,
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    const { circleMeId } = req.params;
    const circleMe = await CircleMeCollection.findOne(circleMeId);

    return res.status(201).json({
      message: "successly got circleMes for user",
      canComment: circleMe.canComment,
      canRefreet: circleMe.canRefreet,
      canShare: circleMe.canShare,
    });
  }
);

/**
 * Creates a circleMe. Requires user to be signed in.
 *
 * @name POST /api/circleMe
 *
 * @throws {404} - If user is not signed in
 *
 */
router.post(
  "/",
  [
    userValidator.isUserLoggedIn,
    freetValidator.isFreetExists,
    freetValidator.isValidFreetModifier,
    circleValidator.isCircleExists,
    circleValidator.isAllowedToUpdateCircle,
    circleMeValidator.isAllowedToMakeCircleMe,
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    const { circleId, freetId, canShare, canRefreet, canComment } = req.body;
    const circleMe = await CircleMeCollection.addOne(
      circleId,
      freetId,
      canShare === "on",
      canRefreet === "on",
      canComment === "on"
    );

    return res.status(200).json({
      message: "successfully added circleMe",
      circleMe: util.constructCircleMeResponse(circleMe),
    });
  }
);

router.put(
  "/:circleMeId",
  [
    userValidator.isUserLoggedIn,
    circleMeValidator.isAllowedToUpdateCircle,
    circleMeValidator.isCircleMeExists,
  ],
  async (req: Request, res: Response) => {
    const { circleMeId, canComment, canShare, canRefreet } = req.body;
    // // console.log(req.body);
    const circleMe = await CircleMeCollection.update(
      circleMeId,
      canComment === "on",
      canShare === "on",
      canRefreet === "on"
    );

    return res.status(200).json({
      message: "successfully edited circle",
      circleMe: util.constructCircleMeResponse(circleMe),
    });
  }
);

router.delete(
  "/:circleMeId",
  [
    userValidator.isUserLoggedIn,
    circleMeValidator.isAllowedToUpdateCircle,
    circleMeValidator.isCircleMeExists,
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    const { circleMeId } = req.params;

    await CircleMeCollection.deleteOne(circleMeId);

    return res.status(200).json({ message: "circleMe successfully deleted!" });
  }
);

export { router as circleMeRouter };

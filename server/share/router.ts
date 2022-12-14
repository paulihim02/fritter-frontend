import type { NextFunction, Request, Response } from "express";
import express from "express";
import * as userValidator from "../user/middleware";
import * as freetValidator from "../freet/middleware";
import * as shareValidator from "./middleware";
import * as util from "./util";
import ShareCollection from "./collection";

const router = express.Router();

router.use("/", async (req: Request, res: Response, next: NextFunction) => {
  const toRemove = (await ShareCollection.findAll()).filter((share) => {
    return !share.freetId || !share.audienceId || !share.sharedById;
  });
  await Promise.all(
    toRemove.map((share: any) => ShareCollection.deleteOne(share._id))
  );

  return next();
});

/** gets all share */
router.get(
  "/",
  async (req: Request, res: Response, next: NextFunction) => {
    const { username, sharedWith } = req.query;

    if (username) {
      return next();
    }
    console.log("finding all");

    return await ShareCollection.findAll()
      .then((share) => {
        const response = share.map(util.constructShareResponse);
        return res.status(200).json({ message: "success", shares: response });
      })
      .catch((e) =>
        res.status(500).json({
          error: `Encounted the following error \n${e}. Please try again later`,
        })
      );
  },
  async (req: Request, res: Response, next: NextFunction) => {
    const { username, sharedWith } = req.query;

    if (sharedWith) {
      const shar = (await ShareCollection.findAllAudienceIdFromUsername(
        username as string
      )) as any;
      return res
        .status(200)
        .json({ shares: shar.map(util.constructShareResponse) });
    }

    const share = await ShareCollection.findAllByUsername(username as string);

    return res.status(201).json({
      message: "successly got share by user",
      shares: share.map(util.constructShareResponse),
    });
  }
);

router.get(
  "/:username",
  [userValidator.isUsernameExists],
  async (req: Request, res: Response, next: NextFunction) => {
    const { username } = req.params;

    const share = await ShareCollection.findAllByUsername(username);

    return res.status(201).json({
      message: "successly got share by user",
      shares: share.map(util.constructShareResponse),
    });
  }
);

/**
 * shares a freet.
 *
 * @name POST /api/shares
 *
 * @throws {404} - If user is not signed in
 *
 */
router.post(
  "/",
  [
    userValidator.isUserLoggedIn,
    freetValidator.isFreetExists,
    shareValidator.isShareNotExists,
    shareValidator.isNotShareCycle,
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    const { freetId, audienceId } = req.body;

    const share = await ShareCollection.addOne(
      freetId,
      audienceId,
      req.session.userId
    );

    return res.status(200).json({
      message: "successfully added share",
      shares: util.constructShareResponse(share),
    });
  }
);

router.delete(
  "/:shareId",
  [
    userValidator.isUserLoggedIn,
    shareValidator.isValidShareId,
    shareValidator.isShareExists,
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    const { shareId } = req.params;

    await ShareCollection.deleteOne(shareId);

    return res.status(200).json({ message: "share successfully deleted!" });
  }
);

export { router as shareRouter };

import type { NextFunction, Request, Response } from "express";
import express from "express";
import * as userValidator from "../user/middleware";
import * as freetValidator from "../freet/middleware";
import * as shareValidator from "./middleware";
import * as util from "./util";
import ShareCollection from "./collection";

const router = express.Router();

/** gets all share */
router.get("/", async (req: Request, res: Response) => {
  return await ShareCollection.findAll()
    .then((share) => {
      const response = share.map(util.constructShareResponse);
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
    const share = await ShareCollection.findAllByUsername(username);

    return res.status(201).json({
      message: "successly got share by user",
      share: share.map(util.constructShareResponse),
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
      share: util.constructShareResponse(share),
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

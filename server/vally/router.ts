import type { NextFunction, Request, Response } from "express";
import express from "express";
import * as userValidator from "../user/middleware";
import * as freetValidator from "../freet/middleware";
import * as vallyValidator from "./middleware";
import * as util from "./util";
import VallyCollection from "./collection";

const router = express.Router();

/** gets all Vally */
router.get("/", async (req: Request, res: Response) => {
  return await VallyCollection.findAll()
    .then((vally) => {
      const response = vally.map(util.constructVallyResponse);
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
    const vally = await VallyCollection.findAllByUsername(username);

    return res.status(201).json({
      message: "successly got vally for user",
      vally: vally.map(util.constructVallyResponse),
    });
  }
);

/**
 * vallys a freet.
 *
 * @name POST /api/vally
 *
 * @throws {404} - If user is not signed in
 *
 */
router.post(
  "/",
  [
    userValidator.isUserLoggedIn,
    freetValidator.isFreetExists,
    vallyValidator.isVallyNotExist,
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    const { freetId, points } = req.body;
    console.log(freetId, points);
    const vally = await VallyCollection.addOne(
      freetId,
      req.session.userId,
      points
    );

    return res.status(200).json({
      message: "successfully added vally",
      vally: util.constructVallyResponse(vally),
    });
  }
);

router.put(
  "/:vallyId",
  [
    userValidator.isUserLoggedIn,
    vallyValidator.isValidVallyId,
    vallyValidator.isVallyExists,
    vallyValidator.isValidVallyModifier,
  ],
  async (req: Request, res: Response) => {
    const { vallyId, points } = req.body;
    const vally = await VallyCollection.updateOne(vallyId, points);

    return res.status(200).json({
      message: "successfully updated vally",
      vally: util.constructVallyResponse(vally),
    });
  }
);

router.delete(
  "/:vallyId",
  [
    userValidator.isUserLoggedIn,
    vallyValidator.isValidVallyId,
    vallyValidator.isVallyExists,
    vallyValidator.isValidVallyModifier,
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    const { vallyId } = req.params;

    await VallyCollection.deleteOne(vallyId);

    return res.status(200).json({ message: "vally successfully deleted!" });
  }
);

export { router as vallyRouter };

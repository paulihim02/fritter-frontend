import type { NextFunction, Request, Response } from "express";
import e from "express";
import express from "express";
import UserCollection from "../user/collection";

import * as userValidator from "../user/middleware";
import CircleCollection from "./collection";
import * as circleValidator from "./middleware";
import * as util from "./util";

const router = express.Router();

/**
 * Creates a circle. Requires user to be signed in.
 *
 * @name POST /api/circles
 *
 * @param {rank} level - The circle level to create
 * @return {UserResponse} - An object with user's details
 * @throws {404} - If user is not signed in
 *
 */
router.post(
  "/",
  [userValidator.isUserLoggedIn, circleValidator.isAllowedToMakeCircle],
  async (req: Request, res: Response) => {
    const { rank } = req.body;
    return await CircleCollection.addOne(req.session.userId, rank)
      .then((circle) =>
        res.status(201).json({
          message: `Circle was created successfully!`,
          user: util.constructCircleResponse(circle),
        })
      )
      .catch((e) =>
        res
          .status(500)
          .json({ error: "Could not create circle. Please try again later." })
      );
  }
);

/** gets all circles */
router.get("/", async (req: Request, res: Response) => {
  return await CircleCollection.findAll()
    .then((circles) => {
      const response = circles.map(util.constructCircleResponse);
      return res.status(200).json(response);
    })
    .catch((e) =>
      res.status(500).json({
        error: `Encounted the following error \n${e}. Please try again later`,
      })
    );
});

router.get("/:username/:level", async (req: Request, res: Response) => {
  console.log("hitting here");
  const { username, level } = req.params;
  const user = await UserCollection.findOneByUsername(username);

  if (!user) {
    return res
      .status(404)
      .json({ message: "User of that username could not be found" });
  }

  const circle = await CircleCollection.findOne(user._id, parseInt(level));

  return res.status(200).json(
    circle
      ? util.constructCircleResponse(circle)
      : {
          message:
            "Circle could not be found; are you sure this circle has been created already?",
        }
  );
});

function throwError(
  req: Request,
  res: Response,
  code: number,
  message: any
): Promise<any> {
  res.send(code).json(message);
  return new Promise(() => {});
}

const UNKNOWN_ERROR = (req: Request, res: Response, e: any): any => {
  return res.status(500).json({
    error: e,
    message:
      "unforunately the server encountered an unexpected error. please try again later",
  });
};

const NOT_FOUND = (req: Request, res: Response, x: string): any => {
  return res.status(404).json({
    message: `${x} could not be found`,
  });
};

router.put(
  "/",
  userValidator.isUserLoggedIn,
  async (req: Request, res: Response) => {
    console.log(req.body, req.params);
    const { add, username } = req.body;
    const rank = parseInt(req.body.rank);

    const circle = await CircleCollection.findOne(req.session.userId, rank);
    const user = await UserCollection.findOneByUsername(username);

    if (!circle) {
      return NOT_FOUND(req, res, "circle");
    }
    if (!user) {
      return NOT_FOUND(req, res, "user");
    }

    const updatedCircle = add
      ? CircleCollection.addToCircle(req.session.userId, rank, [user._id])
      : CircleCollection.removeFromCircle(req.session.userId, rank, [user._id]);
    return res
      .status(200)
      .json(util.constructCircleResponse(await updatedCircle));
  }
);

router.delete(
  "/",
  [userValidator.isUserLoggedIn],
  async (req: Request, res: Response, next: NextFunction) => {
    const { rank } = req.body;
    console.log("req body is", req.body, req.params, req.query);
    if (!rank) {
      return res
        .status(400)
        .json({ message: "Cannot delete a circle that doesn't exist" });
    }

    const circle = await CircleCollection.deleteOne(
      req.session.userId,
      parseInt(rank)
    );
    return res
      .status(200)
      .json({ message: `circle was successfully deleted`, circle });
  }
);

export { router as circlesRouter };

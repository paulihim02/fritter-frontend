import type { NextFunction, Request, Response } from "express";
import express from "express";
import UserCollection from "../user/collection";

import * as userValidator from "../user/middleware";
import CircleCollection from "./collection";
import * as circleValidator from "./middleware";
import CircleModel from "./model";
import * as util from "./util";

const router = express.Router();

// router.use("/", async (req: Request, res: Response, next: NextFunction) => {
// await CircleModel.deleteMany({
//   ownerId: { $eq: null },
// }); // we clear our circles for users deleted
// const toDelete: any = [];
// await CircleModel.find({})
//   .populate("ownerId userId")
//   .then(async (circles: any) => {
//     for (const circle of circles) {
//       if (!circle.ownerId) {
//         // to delete
//         toDelete.push(circle._id);
//       }
//       const gooduserId = circle.userId.filter((id: any) => !!id);
//       circle.userId = gooduserId.map((userId: any) => userId._id);
//       await circle.save();
//     }
//   });
// await toDelete.map((circleId: any) => CircleModel.deleteOne(circleId));
// return next();
// });

/**
 * Creates a circle. Requires user to be signed in.
 *
 * @name POST /api/circles
 *
 * @param {rank} level - The circle level to create
 * @return {} - An object with user's details
 * @throws {404} - If user is not signed in
 *
 */
router.post(
  "/",
  [
    userValidator.isUserIdExists,
    circleValidator.isCircleNotExists,
    circleValidator.isValidRank,
  ],
  async (req: Request, res: Response) => {
    const { userId, rank } = req.body;

    return await CircleCollection.addOne(req.session.userId, userId, rank)
      .then((circle) =>
        res.status(201).json({
          message: `Circle was created successfully!`,
          circle: util.constructCircleResponse(circle),
        })
      )
      .catch((e) =>
        res
          .status(500)
          .json({ error: "Could not create circle. Please try again later." })
      );
  }
);

/** gets all circles owned by ownerId of a specific rank */
router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  const { ownerId, rank } = req.query;
  if (!ownerId || !rank) {
    return next();
  }

  const circles = await CircleCollection.findAllByRankOwnwerId(
    ownerId as string,
    rank as any
  );
  res.status(201).json({ circles: circles.map(util.constructCircleResponse) });
  return;
});

/** gets all circles owned by userId */
router.get("/:userId", async (req: Request, res: Response) => {
  const { userId } = req.params;

  const circles = await CircleCollection.findAllByOwnerId(
    userId || req.session.userId
  );
  res.status(201).json({ circles: circles.map(util.constructCircleResponse) });
  return;
});

router.get(
  "/:ownerId/:userId/:rank",
  [userValidator.isUserIdExists],
  async (req: Request, res: Response) => {
    const { userId, ownerId, rank } = req.params;

    const circle = await CircleCollection.findOne(
      ownerId,
      userId,
      parseInt(rank)
    );

    if (!circle) {
      return res.status(404).json({ error: "circle couldn't be found" });
    }

    return res
      .status(200)
      .json({ circle: util.constructCircleResponse(circle) });
  }
);

router.delete(
  "/",
  async (req: Request, res: Response, next: NextFunction) => {
    const { circleId } = req.body;

    if (circleId) {
      const circ = await CircleModel.deleteOne({ _id: circleId });
      console.log("circl", circ);
      return res
        .status(200)
        .json({ message: "user successfully removed", removed: circ });
    }
    return next();
  },
  [userValidator.isUserIdExists, circleValidator.isValidRank],
  async (req: Request, res: Response, next: NextFunction) => {
    const { ownerId, userId, rank, circleId } = req.body;
    const circle = await CircleCollection.deleteOne(
      ownerId,
      userId,
      parseInt(rank)
    );
    console.log("circle");
    return res
      .status(200)
      .json({ message: `user successfully removed`, removed: circle });
  }
);

export { router as circlesRouter };

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
    console.log("user to add to cirlce", userId, rank);
    console.log(
      "user to asdfasfdsafasdfsafsadfsafsafadd to cirlce",
      userId,
      rank
    );
    return await CircleCollection.addOne(req.session.userId, userId, rank)
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
  "/:userId/:level",
  [userValidator.isUserIdExists],
  async (req: Request, res: Response) => {
    const { userId, level } = req.params;

    const circle = await CircleCollection.findOne(userId, parseInt(level));

    if (!circle) {
      res.status(404).json({ error: "circle couldn't be found" });
    }

    return res.status(200).json(util.constructCircleResponse(circle));
  }
);

router.delete(
  "/",
  [userValidator.isUserIdExists],
  async (req: Request, res: Response, next: NextFunction) => {
    const { userId, rank } = req.body;

    if (!rank) {
      return res.status(400).json({ error: "please specify circle rank" });
    }

    const circle = await CircleCollection.deleteOne(userId, parseInt(rank));
    return res
      .status(200)
      .json({ message: `circle was successfully deleted`, circle });
  }
);

export { router as circlesRouter };

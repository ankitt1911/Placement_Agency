const express = require("express");
const broadcastRouter = express.Router();
const jwtMiddleware = require("../middleware/jwtMiddleware");
const { getActiveBroadcasts, getBroadcasts, createBroadcast, updateBroadcast, toggleBroadcast, deleteBroadcast } = require("../controllers/broadcastController");

broadcastRouter.use(jwtMiddleware);
// Any signed-in user can read the ongoing broadcasts; the rest is operations-only.
broadcastRouter.get("/active", getActiveBroadcasts);
broadcastRouter.get("/", getBroadcasts);
broadcastRouter.post("/", createBroadcast);
broadcastRouter.put("/:id", updateBroadcast);
broadcastRouter.patch("/:id/toggle", toggleBroadcast);
broadcastRouter.delete("/:id", deleteBroadcast);

module.exports = broadcastRouter;

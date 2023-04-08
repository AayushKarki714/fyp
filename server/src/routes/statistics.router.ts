import express from "express";
import { getPopularUsersByRole } from "../controllers/statistics.controller";

const statisticsRouter = express.Router();

statisticsRouter.get("/users/:role/popular", getPopularUsersByRole);

export default statisticsRouter;

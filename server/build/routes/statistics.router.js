"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const statistics_controller_1 = require("../controllers/statistics.controller");
const statisticsRouter = express_1.default.Router();
statisticsRouter.get("/users/:role/popular", statistics_controller_1.getPopularUsersByRole);
exports.default = statisticsRouter;

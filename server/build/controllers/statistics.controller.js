"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPopularUsersByRole = void 0;
const prisma_1 = __importDefault(require("../utils/prisma"));
function getPopularUsersByRole(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { role } = req.params;
        console.log({ role });
        const popular = yield prisma_1.default.member.groupBy({
            by: ["userId"],
            where: {
                role: role,
                recieverInvitations: {
                    some: {
                        status: "ACCEPTED",
                    },
                },
            },
            _count: {
                _all: true,
            },
            orderBy: {
                _count: {
                    userId: "desc",
                },
            },
            take: 10,
        });
        const finalData = yield Promise.all(popular.map((data) => __awaiter(this, void 0, void 0, function* () {
            const { userId, _count: { _all: totalCount }, } = data;
            const memberData = yield prisma_1.default.user.findUnique({
                where: { id: userId },
            });
            return Object.assign(Object.assign({}, memberData), { totalCount });
        })));
        return res.status(200).json({
            message: `Top 10 most popular member by ${role}`,
            data: finalData,
        });
    });
}
exports.getPopularUsersByRole = getPopularUsersByRole;

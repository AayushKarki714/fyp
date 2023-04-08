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
exports.getUserBySearch = exports.getWorkspaceBySearch = exports.getWorkspaceRegisteredByMonth = exports.getUsersRegisteredByMonth = exports.getAdditionalWorkspaceDetails = exports.getTotalWorkspaceandUser = exports.deleteWorkspace = exports.deRegisterUser = exports.getAllWorkspace = exports.getAllRegisteredUser = exports.handleSystemAdminLogin = void 0;
const api400Error_1 = __importDefault(require("../utils/api400Error"));
const prisma_1 = __importDefault(require("../utils/prisma"));
const api401Error_1 = __importDefault(require("../utils/api401Error"));
const generateToken_1 = __importDefault(require("../utils/generateToken"));
const verifyPassword_1 = __importDefault(require("../utils/verifyPassword"));
function decodeCount(countObj) {
    var _a;
    return (_a = countObj._count._all) !== null && _a !== void 0 ? _a : 0;
}
const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
];
function handleSystemAdminLogin(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { username, password } = req.body;
        if (!username || !password)
            throw new api400Error_1.default("Username and Password must be Provided!!");
        const systemAdmin = yield prisma_1.default.admin.findFirst({
            where: { username },
        });
        if (!systemAdmin)
            throw new api401Error_1.default("You are not allowed to Login");
        yield (0, verifyPassword_1.default)(password, systemAdmin.password);
        const token = (0, generateToken_1.default)({ id: systemAdmin.id });
        return res.status(200).json({
            message: "Logged in SuccessFully as a System Admin",
            data: { token, id: systemAdmin.id, username: systemAdmin.username },
        });
    });
}
exports.handleSystemAdminLogin = handleSystemAdminLogin;
function getAllRegisteredUser(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { page } = req.query;
        const pageCount = 10;
        const registeredUser = yield prisma_1.default.user.findMany({
            skip: (Number(page) - 1) * pageCount,
            take: pageCount,
        });
        return res.json({
            message: "All Registered User Fetched Successfully",
            data: registeredUser,
        });
    });
}
exports.getAllRegisteredUser = getAllRegisteredUser;
function getAllWorkspace(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { page } = req.query;
        const pageCount = 4;
        const workspaces = yield prisma_1.default.workspace.findMany({
            skip: (Number(page) - 1) * pageCount,
            take: pageCount,
        });
        return res.json({
            message: "All Registered User Fetched Successfully",
            data: workspaces,
        });
    });
}
exports.getAllWorkspace = getAllWorkspace;
function deRegisterUser(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { userId } = req.params;
        console.log({ userId });
        const deletedUser = yield prisma_1.default.user.delete({ where: { id: userId } });
        return res
            .status(200)
            .json({ message: "De-Registered User Successfully", data: deletedUser });
    });
}
exports.deRegisterUser = deRegisterUser;
function deleteWorkspace(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { workspaceId } = req.params;
        const deletedWorkspace = yield prisma_1.default.workspace.delete({
            where: {
                id: workspaceId,
            },
        });
        return res.status(200).json({
            message: "Deleted Workspace Successfully",
            data: deletedWorkspace,
        });
    });
}
exports.deleteWorkspace = deleteWorkspace;
function getTotalWorkspaceandUser(req, res, next) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield prisma_1.default.user.aggregate({
            _count: {
                _all: true,
            },
        });
        const workspace = yield prisma_1.default.workspace.aggregate({
            _count: {
                _all: true,
            },
        });
        const userCount = (_a = user._count._all) !== null && _a !== void 0 ? _a : 0;
        const workspaceCount = (_b = workspace._count._all) !== null && _b !== void 0 ? _b : 0;
        return res.status(200).json({
            message: "Count Fetched Successfully",
            data: { userCount, workspaceCount },
        });
    });
}
exports.getTotalWorkspaceandUser = getTotalWorkspaceandUser;
function getAdditionalWorkspaceDetails(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { workspaceId } = req.params;
        const todoContainer = yield prisma_1.default.todoContainer.aggregate({
            where: {
                workspaceId,
            },
            _count: {
                _all: true,
            },
        });
        const progressContainer = yield prisma_1.default.progressContainer.aggregate({
            where: {
                workspaceId,
            },
            _count: {
                _all: true,
            },
        });
        const galleryContainer = yield prisma_1.default.galleryContainer.aggregate({
            where: {
                workspaceId,
            },
            _count: {
                _all: true,
            },
        });
        const members = yield prisma_1.default.member.findMany({
            where: {
                workspaceId,
                recieverInvitations: {
                    some: {
                        status: "ACCEPTED",
                    },
                },
            },
            include: {
                user: true,
            },
        });
        return res.status(200).json({
            message: "fetched Successfully",
            data: {
                members,
                galleryContainerCount: decodeCount(galleryContainer),
                todoContainerCount: decodeCount(todoContainer),
                progressContainerCount: decodeCount(progressContainer),
            },
        });
    });
}
exports.getAdditionalWorkspaceDetails = getAdditionalWorkspaceDetails;
function getUsersRegisteredByMonth(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const startOfYear = new Date(new Date().getFullYear(), 0, 1); // January 1st of this year
        const endOfYear = new Date(new Date().getFullYear() + 1, 0, 1); // January 1st
        const users = yield prisma_1.default.user.findMany({
            select: {
                id: true,
                createdAt: true,
            },
            where: {
                createdAt: {
                    gte: startOfYear,
                    lt: endOfYear,
                },
            },
            orderBy: {
                createdAt: "asc",
            },
        });
        const usersByMonth = users.reduce((acc, user) => {
            const monthIdx = user.createdAt.getMonth();
            const key = months[monthIdx];
            if (!acc[key]) {
                acc[key] = 0;
            }
            acc[key]++;
            return acc;
        }, {});
        return res
            .status(200)
            .json({ message: "data fetched successfully", data: usersByMonth });
    });
}
exports.getUsersRegisteredByMonth = getUsersRegisteredByMonth;
function getWorkspaceRegisteredByMonth(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const startOfYear = new Date(new Date().getFullYear(), 0, 1);
        const endOfYear = new Date(new Date().getFullYear() + 1, 0, 1);
        const workspaces = yield prisma_1.default.workspace.findMany({
            where: {
                createdAt: {
                    gte: startOfYear,
                    lte: endOfYear,
                },
            },
        });
        const workspaceByMonth = workspaces.reduce((acc, workspace) => {
            const monthIdx = workspace.createdAt.getMonth();
            const key = months[monthIdx];
            if (!acc[key]) {
                acc[key] = 0;
            }
            acc[key]++;
            return acc;
        }, {});
        return res
            .status(200)
            .json({ message: "Workspace by Month", data: workspaceByMonth });
    });
}
exports.getWorkspaceRegisteredByMonth = getWorkspaceRegisteredByMonth;
function getWorkspaceBySearch(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { searchTerm } = req.params;
        if (!searchTerm)
            throw new api400Error_1.default("Search Term was not Provided");
        const searchResults = yield prisma_1.default.workspace.findMany({
            where: {
                name: {
                    contains: searchTerm,
                },
            },
            include: {
                admin: {
                    select: {
                        photo: true,
                        email: true,
                        userName: true,
                    },
                },
            },
        });
        return res.status(200).json({
            message: "Search Results Fetched Successfully",
            data: searchResults,
        });
    });
}
exports.getWorkspaceBySearch = getWorkspaceBySearch;
function getUserBySearch(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { searchTerm } = req.params;
        if (!searchTerm)
            throw new api400Error_1.default("Search Term was not Provided");
        const searchResults = yield prisma_1.default.user.findMany({
            where: {
                OR: [
                    {
                        userName: {
                            contains: searchTerm.toUpperCase(),
                        },
                    },
                    {
                        userName: {
                            contains: searchTerm,
                        },
                    },
                    {
                        userName: {
                            contains: searchTerm.toLowerCase(),
                        },
                    },
                ],
            },
        });
        return res.status(200).json({
            message: "Search Results Fetched Successfully",
            data: searchResults,
        });
    });
}
exports.getUserBySearch = getUserBySearch;
function getUserById(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { userId } = req.params;
        if (!userId)
            throw new api400Error_1.default("User Id was not Provided!!");
        const findWorkspace = yield prisma_1.default.user.findUnique({
            where: {
                id: userId,
            },
        });
        return res
            .status(200)
            .json({ message: "Workspace by Id", data: findWorkspace });
    });
}

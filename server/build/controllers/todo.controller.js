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
exports.handleDeleteTodoById = exports.handleTodoCardTitleUpdate = exports.handleToggleTodoCommentLikes = exports.handleGetTodoCommentLikeCount = exports.handleTodoDeleteComment = exports.handleTodoUpdateComment = exports.getSingleTodo = exports.handleCreateTodoComment = exports.handleTodoCompletedUpdate = exports.handleTodoCompletionUpdate = exports.handleTodoDescriptionUpdate = exports.handleTodoTitleUpdate = exports.handleTodoContainerTitleUpdate = exports.handleDeleteTodoCard = exports.handleDeleteTodoContainer = exports.handleUpdateTodoStatus = exports.getAllTodosInTodoCard = exports.handleCreateTodo = exports.getAllTodoCardInTodoContainer = exports.handleCreateTodoCard = exports.getAllTodoContainer = exports.handleCreateTodoContainer = void 0;
const client_1 = require("@prisma/client");
const api400Error_1 = __importDefault(require("../utils/api400Error"));
const api401Error_1 = __importDefault(require("../utils/api401Error"));
const api403Error_1 = __importDefault(require("../utils/api403Error"));
const checkIfUserIdMatches_1 = __importDefault(require("../utils/checkIfUserIdMatches"));
const prisma_1 = __importDefault(require("../utils/prisma"));
const verifyCreatedUserId_1 = __importDefault(require("../utils/verifyCreatedUserId"));
const verifyRole_1 = __importDefault(require("../utils/verifyRole"));
function handleCreateTodoContainer(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { title } = req.body;
        const { workspaceId, userId } = req.params;
        (0, checkIfUserIdMatches_1.default)(req, userId);
        yield (0, verifyRole_1.default)(["ADMIN", "LANCER"], workspaceId, userId);
        const findByTitle = yield prisma_1.default.todoContainer.findFirst({
            where: {
                title,
                workspaceId,
            },
        });
        if (findByTitle)
            throw new api400Error_1.default(`${findByTitle.title} already Exist's as a Todo Container`);
        const todoContainer = yield prisma_1.default.todoContainer.create({
            data: {
                title,
                createdByUserId: userId,
                workspaceId,
            },
        });
        return res.status(201).json({
            message: `${todoContainer.title} was created SuccessFully`,
            data: todoContainer,
        });
    });
}
exports.handleCreateTodoContainer = handleCreateTodoContainer;
function getAllTodoContainer(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { workspaceId } = req.params;
        const allTodoContainer = yield prisma_1.default.todoContainer.findMany({
            where: {
                workspaceId,
            },
            orderBy: {
                createdAt: "asc",
            },
            include: {
                user: {
                    select: {
                        userName: true,
                        photo: true,
                    },
                },
            },
        });
        return res.status(200).json({
            message: "Fetched TodoContainer SuccessFully",
            data: allTodoContainer,
        });
    });
}
exports.getAllTodoContainer = getAllTodoContainer;
function handleCreateTodoCard(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { title } = req.body;
        const { workspaceId, todoContainerId, userId } = req.params;
        (0, checkIfUserIdMatches_1.default)(req, userId);
        yield (0, verifyRole_1.default)(["LANCER", "ADMIN"], workspaceId, userId);
        if (!title)
            throw new api400Error_1.default("Missing Required Field (title)");
        const workspace = yield prisma_1.default.workspace.findUnique({
            where: { id: workspaceId },
        });
        if (!workspace)
            throw new api400Error_1.default("The Workspace with the Id doesn't exist");
        const todoCard = yield prisma_1.default.todoCard.create({
            data: {
                title,
                createdByUserId: userId,
                todoContainerId,
            },
        });
        return res.status(201).json({
            message: `${todoCard.title} was created SucessFully`,
            data: todoCard,
        });
    });
}
exports.handleCreateTodoCard = handleCreateTodoCard;
function getAllTodoCardInTodoContainer(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { workspaceId, todoContainerId } = req.params;
        const workspace = yield prisma_1.default.workspace.findUnique({
            where: { id: workspaceId },
        });
        if (!workspace)
            throw new api400Error_1.default("The Workspace with the Id doesn't exist");
        const todoCards = yield prisma_1.default.todoCard.findMany({
            where: {
                todoContainerId: todoContainerId,
            },
            orderBy: {
                createdAt: "asc",
            },
            include: {
                user: {
                    select: {
                        photo: true,
                        userName: true,
                    },
                },
            },
        });
        return res
            .status(200)
            .json({ message: "TodoCards Fetched SucessFully", data: todoCards });
    });
}
exports.getAllTodoCardInTodoContainer = getAllTodoCardInTodoContainer;
function handleCreateTodo(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { text, status } = req.body;
        const { todoContainerId, todoCardId, workspaceId, userId } = req.params;
        (0, checkIfUserIdMatches_1.default)(req, userId);
        yield (0, verifyRole_1.default)(["ADMIN", "LANCER"], workspaceId, userId);
        if (!text)
            throw new api400Error_1.default("Missing Required Field (text)");
        const todoContainer = yield prisma_1.default.todoContainer.findUnique({
            where: { id: todoContainerId },
        });
        if (!todoContainer)
            return res
                .status(400)
                .json({ message: "TodoContainer was Found", data: null });
        const todoCard = yield prisma_1.default.todoCard.findUnique({
            where: { id: todoCardId },
        });
        if (!todoCard)
            throw new api400Error_1.default("Todo Card was not Found");
        const todo = yield prisma_1.default.todo.create({
            data: {
                text,
                status,
                todoCardId,
                dueDate: new Date(),
                createdByUserId: userId,
            },
        });
        return res
            .status(201)
            .json({ message: `${todo.text} was created SuccessFully`, data: todo });
    });
}
exports.handleCreateTodo = handleCreateTodo;
function getAllTodosInTodoCard(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { todoCardId, todoContainerId } = req.params;
        const todoContainer = yield prisma_1.default.todoContainer.findUnique({
            where: { id: todoContainerId },
        });
        if (!todoContainer)
            throw new api400Error_1.default("Todo Container was not Found!!");
        const todoCard = yield prisma_1.default.todoCard.findUnique({
            where: { id: todoCardId },
        });
        if (!todoCard)
            throw new api400Error_1.default("Todo Card with the given Id was not found!!");
        const todos = yield prisma_1.default.todo.findMany({
            where: {
                todoCardId,
            },
            select: {
                id: true,
                text: true,
                completed: true,
                completionDate: true,
                description: true,
                status: true,
                dueDate: true,
                todoCardId: true,
                createdAt: true,
                _count: {
                    select: {
                        comments: true,
                    },
                },
                user: {
                    select: {
                        photo: true,
                        userName: true,
                    },
                },
            },
            orderBy: {
                updatedAt: "asc",
            },
        });
        return res
            .status(200)
            .json({ message: "Todos Fetched SucessFully", data: todos });
    });
}
exports.getAllTodosInTodoCard = getAllTodosInTodoCard;
function handleUpdateTodoStatus(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { todoId, todoCardId, userId, workspaceId } = req.params;
        const { status } = req.body;
        (0, checkIfUserIdMatches_1.default)(req, userId);
        const role = yield (0, verifyRole_1.default)(["ADMIN", "LANCER"], workspaceId, userId);
        const findTodo = yield prisma_1.default.todo.findUnique({ where: { id: todoId } });
        if (role === client_1.Role.LANCER)
            (0, verifyCreatedUserId_1.default)(findTodo === null || findTodo === void 0 ? void 0 : findTodo.createdByUserId, userId);
        const updateTodoStatus = yield prisma_1.default.todo.update({
            data: {
                todoCardId,
                status,
            },
            where: {
                id: todoId,
            },
        });
        return res
            .status(200)
            .json({ message: "Updated SucessFully", data: updateTodoStatus });
    });
}
exports.handleUpdateTodoStatus = handleUpdateTodoStatus;
function handleDeleteTodoContainer(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { todoContainerId, userId, workspaceId, createdByUserId } = req.params;
        // checks if the users is same or not
        (0, checkIfUserIdMatches_1.default)(req, userId);
        const role = yield (0, verifyRole_1.default)(["ADMIN", "LANCER"], workspaceId, userId);
        const findTodoContainer = yield prisma_1.default.todoContainer.findUnique({
            where: { id: todoContainerId },
        });
        if (role === client_1.Role.LANCER) {
            (0, verifyCreatedUserId_1.default)(findTodoContainer === null || findTodoContainer === void 0 ? void 0 : findTodoContainer.createdByUserId, userId);
        }
        const deletedTodoContainer = yield prisma_1.default.todoContainer.delete({
            where: { id: todoContainerId },
        });
        return res.status(200).json({
            message: `${deletedTodoContainer.title} was SuccessFully Deleted`,
            data: deletedTodoContainer,
        });
    });
}
exports.handleDeleteTodoContainer = handleDeleteTodoContainer;
function handleDeleteTodoCard(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { todoContainerId, userId, workspaceId, todoCardId } = req.params;
        (0, checkIfUserIdMatches_1.default)(req, userId);
        const role = yield (0, verifyRole_1.default)(["ADMIN", "LANCER"], workspaceId, userId);
        const findTodoCard = yield prisma_1.default.todoCard.findUnique({
            where: {
                id_todoContainerId: { id: todoCardId, todoContainerId },
            },
        });
        if (role === client_1.Role.LANCER)
            (0, verifyCreatedUserId_1.default)(findTodoCard === null || findTodoCard === void 0 ? void 0 : findTodoCard.createdByUserId, userId);
        const deleteTodoCard = yield prisma_1.default.todoCard.delete({
            where: {
                id_todoContainerId: { id: todoCardId, todoContainerId },
            },
        });
        return res.status(200).json({
            message: `${deleteTodoCard === null || deleteTodoCard === void 0 ? void 0 : deleteTodoCard.title} was SuccessFully Deleted`,
            data: deleteTodoCard,
        });
    });
}
exports.handleDeleteTodoCard = handleDeleteTodoCard;
function handleTodoContainerTitleUpdate(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { title } = req.body;
        const { todoContainerId, userId, workspaceId } = req.params;
        (0, checkIfUserIdMatches_1.default)(req, userId);
        const role = yield (0, verifyRole_1.default)(["ADMIN", "LANCER"], workspaceId, userId);
        const findTodoContainer = yield prisma_1.default.todoContainer.findUnique({
            where: {
                id: todoContainerId,
            },
        });
        if (role === client_1.Role.LANCER)
            (0, verifyCreatedUserId_1.default)(findTodoContainer === null || findTodoContainer === void 0 ? void 0 : findTodoContainer.createdByUserId, userId);
        if (!title)
            throw new api400Error_1.default("Missing Required Fields");
        const updateTodo = yield prisma_1.default.todoContainer.update({
            data: {
                title,
            },
            where: {
                id: todoContainerId,
            },
        });
        return res.status(200).json({
            message: `TodoContainer title SuccessFully Update to ${updateTodo.title}`,
            data: updateTodo,
        });
    });
}
exports.handleTodoContainerTitleUpdate = handleTodoContainerTitleUpdate;
function handleTodoTitleUpdate(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { text } = req.body;
        const { todoCardId, todoId, userId, workspaceId } = req.params;
        (0, checkIfUserIdMatches_1.default)(req, userId);
        const role = yield (0, verifyRole_1.default)(["ADMIN", "LANCER"], workspaceId, userId);
        const findTodo = yield prisma_1.default.todo.findUnique({
            where: { id_todoCardId: { id: todoId, todoCardId } },
        });
        if (role === client_1.Role.LANCER)
            (0, verifyCreatedUserId_1.default)(findTodo === null || findTodo === void 0 ? void 0 : findTodo.createdByUserId, userId);
        if (!text)
            throw new api400Error_1.default("Updated Todo Text can't be Empty");
        const todoCard = yield prisma_1.default.todoCard.findUnique({
            where: { id: todoCardId },
        });
        if (!todoCard)
            throw new api400Error_1.default("Invalid Todo Id was Provided, Not Found!!");
        const todo = yield prisma_1.default.todo.findUnique({
            where: { id_todoCardId: { id: todoId, todoCardId } },
        });
        if (!todo)
            throw new api400Error_1.default("Invalid Todo id, Todo was not Found in the Specified Todo card");
        const updateTodo = yield prisma_1.default.todo.update({
            data: {
                text,
            },
            where: {
                id_todoCardId: { id: todoId, todoCardId },
            },
        });
        return res.status(200).json({
            message: `${todo.text} was successfully updated to ${updateTodo.text}`,
            data: updateTodo,
        });
    });
}
exports.handleTodoTitleUpdate = handleTodoTitleUpdate;
function handleTodoDescriptionUpdate(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { description } = req.body;
        const { todoCardId, todoId, workspaceId, userId } = req.params;
        (0, checkIfUserIdMatches_1.default)(req, userId);
        const role = yield (0, verifyRole_1.default)(["LANCER", "ADMIN"], workspaceId, userId);
        const findTodo = yield prisma_1.default.todo.findUnique({
            where: {
                id_todoCardId: { id: todoId, todoCardId },
            },
        });
        if (role === client_1.Role.LANCER)
            (0, verifyCreatedUserId_1.default)(findTodo === null || findTodo === void 0 ? void 0 : findTodo.createdByUserId, userId);
        if (!description)
            throw new api400Error_1.default("Updated Todo description can't be Emtpy!!");
        const todoCard = yield prisma_1.default.todoCard.findUnique({
            where: { id: todoCardId },
        });
        if (!todoCard)
            throw new api400Error_1.default("Invalid Todo Id was Provided, Not Found!!");
        const todo = yield prisma_1.default.todo.findUnique({
            where: { id_todoCardId: { id: todoId, todoCardId } },
        });
        if (!todo)
            throw new api400Error_1.default("Invalid Todo Id, Todo was not Found in the Specified Todo card");
        const updateTodo = yield prisma_1.default.todo.update({
            data: {
                description,
            },
            where: {
                id_todoCardId: { id: todoId, todoCardId },
            },
        });
        return res.status(200).json({
            message: `${updateTodo.text} description  was successfully updated`,
            data: updateTodo,
        });
    });
}
exports.handleTodoDescriptionUpdate = handleTodoDescriptionUpdate;
function handleTodoCompletionUpdate(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { completionDate } = req.body;
        const { todoCardId, todoId, userId, workspaceId } = req.params;
        (0, checkIfUserIdMatches_1.default)(req, userId);
        const role = yield (0, verifyRole_1.default)(["ADMIN", "LANCER"], workspaceId, userId);
        const findTodo = yield prisma_1.default.todo.findUnique({
            where: { id_todoCardId: { id: todoId, todoCardId } },
        });
        if (role === client_1.Role.LANCER)
            (0, verifyCreatedUserId_1.default)(findTodo === null || findTodo === void 0 ? void 0 : findTodo.createdByUserId, userId);
        if (!completionDate)
            throw new api400Error_1.default("Updated  Completion date can't be Emtpy!!");
        const todoCard = yield prisma_1.default.todoCard.findUnique({
            where: { id: todoCardId },
        });
        if (!todoCard)
            return res.status(400).json({
                message: "Invalid Todo Id was Provided, Not Found!!",
                data: null,
            });
        const todo = yield prisma_1.default.todo.findUnique({
            where: { id_todoCardId: { id: todoId, todoCardId } },
        });
        if (!todo)
            throw new api400Error_1.default("Invalid Todo Id, Todo was not Found in the Specified Todo card");
        const updateTodo = yield prisma_1.default.todo.update({
            data: {
                completionDate: new Date(completionDate),
            },
            where: {
                id_todoCardId: { id: todoId, todoCardId },
            },
        });
        return res.status(200).json({
            message: `Completion date was sucessfully assigned to ${completionDate}`,
            data: updateTodo,
        });
    });
}
exports.handleTodoCompletionUpdate = handleTodoCompletionUpdate;
function handleTodoCompletedUpdate(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const completed = Boolean(req.body.completed);
        const { todoCardId, todoId, userId, workspaceId } = req.params;
        (0, checkIfUserIdMatches_1.default)(req, userId);
        const role = yield (0, verifyRole_1.default)(["ADMIN", "LANCER"], workspaceId, userId);
        const todoCard = yield prisma_1.default.todoCard.findUnique({
            where: { id: todoCardId },
        });
        if (!todoCard)
            throw new api400Error_1.default("Invalid Todo Id was Provided, Not Found!!");
        const todo = yield prisma_1.default.todo.findUnique({
            where: { id_todoCardId: { id: todoId, todoCardId } },
        });
        if (role === client_1.Role.LANCER)
            (0, verifyCreatedUserId_1.default)(todo === null || todo === void 0 ? void 0 : todo.createdByUserId, userId);
        if (!todo)
            throw new api400Error_1.default("Invalid Todo Id, Todo was not Found in the Specified Todo card");
        const updateTodo = yield prisma_1.default.todo.update({
            data: {
                completed,
            },
            where: {
                id_todoCardId: { id: todoId, todoCardId },
            },
        });
        return res.status(200).json({
            message: `${updateTodo.text} was successfully completed`,
            data: updateTodo,
        });
    });
}
exports.handleTodoCompletedUpdate = handleTodoCompletedUpdate;
function getSingleTodo(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { todoId } = req.params;
        const todo = yield prisma_1.default.todo.findUnique({
            where: { id: todoId },
            select: {
                id: true,
                text: true,
                comments: {
                    orderBy: {
                        createdAt: "desc",
                    },
                    select: {
                        id: true,
                        contents: true,
                        parentId: true,
                        createdAt: true,
                        updatedAt: true,
                        user: {
                            select: {
                                id: true,
                                userName: true,
                                photo: true,
                            },
                        },
                    },
                },
            },
        });
        return res.status(200).json({ message: "Fetched SucessFully", data: todo });
    });
}
exports.getSingleTodo = getSingleTodo;
function handleCreateTodoComment(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { contents, parentId } = req.body;
        const { todoId, userId } = req.params;
        if (!contents)
            throw new api400Error_1.default("Comments is Required");
        if (userId !== req.user.id)
            throw new api403Error_1.default("You are not allowed to Comment Forbidden!!");
        const comment = yield prisma_1.default.comment.create({
            data: {
                contents,
                userId,
                todoId,
                parentId: parentId || null,
            },
        });
        return res
            .status(201)
            .json({ message: "Comment Created SucessFully", data: comment });
    });
}
exports.handleCreateTodoComment = handleCreateTodoComment;
function handleTodoUpdateComment(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { contents } = req.body;
        const { commentId } = req.params;
        if (!contents) {
            throw new api400Error_1.default("Error Arose From the handleTodoUpdateComment Contents Required");
        }
        const user = yield prisma_1.default.comment.findUnique({
            where: { id: commentId },
            select: { userId: true },
        });
        if ((user === null || user === void 0 ? void 0 : user.userId) !== req.user.id) {
            throw new api401Error_1.default("You don't have permission to edit the message ");
        }
        const updateComment = yield prisma_1.default.comment.update({
            where: { id: commentId },
            data: { contents },
        });
        return res
            .status(200)
            .json({ message: "Comment Updated SucessFully", data: updateComment });
    });
}
exports.handleTodoUpdateComment = handleTodoUpdateComment;
function handleTodoDeleteComment(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { commentId } = req.params;
        const user = yield prisma_1.default.comment.findUnique({
            where: { id: commentId },
            select: { userId: true },
        });
        if ((user === null || user === void 0 ? void 0 : user.userId) !== req.user.id) {
            throw new api401Error_1.default("You don't have permission to edit the message ");
        }
        const deleteComment = yield prisma_1.default.comment.delete({
            where: { id: commentId },
        });
        return res
            .status(200)
            .json({ message: "Comment deleted SucessFully", data: deleteComment });
    });
}
exports.handleTodoDeleteComment = handleTodoDeleteComment;
function handleGetTodoCommentLikeCount(req, res, next) {
    var _a, _b, _c;
    return __awaiter(this, void 0, void 0, function* () {
        const { commentId, userId } = req.params;
        const totalLikes = yield prisma_1.default.like.groupBy({
            by: ["commentId"],
            where: { commentId },
            _count: {
                _all: true,
            },
        });
        const isLiked = yield prisma_1.default.like.findUnique({
            where: { userId_commentId: { userId, commentId } },
        });
        return res.status(200).json({
            data: {
                likedByMe: Boolean(isLiked),
                totalLikes: (_c = (_b = (_a = totalLikes[0]) === null || _a === void 0 ? void 0 : _a._count) === null || _b === void 0 ? void 0 : _b._all) !== null && _c !== void 0 ? _c : 0,
            },
        });
    });
}
exports.handleGetTodoCommentLikeCount = handleGetTodoCommentLikeCount;
function handleToggleTodoCommentLikes(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { userId, commentId } = req.params;
        const isExist = yield prisma_1.default.like.findUnique({
            where: { userId_commentId: { userId, commentId } },
        });
        if (!isExist) {
            const like = yield prisma_1.default.like.create({ data: { commentId, userId } });
            return res.status(201).json({ message: "Liked SuccessFully", data: like });
        }
        const deleteLike = yield prisma_1.default.like.delete({
            where: { userId_commentId: { userId, commentId } },
        });
        return res
            .status(200)
            .json({ message: "deleted SucessFully", data: deleteLike });
    });
}
exports.handleToggleTodoCommentLikes = handleToggleTodoCommentLikes;
function handleTodoCardTitleUpdate(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { title } = req.body;
        const { userId, workspaceId, todoContainerId, todoCardId } = req.params;
        (0, checkIfUserIdMatches_1.default)(req, userId);
        const role = yield (0, verifyRole_1.default)(["ADMIN", "LANCER"], workspaceId, userId);
        const findTodoCard = yield prisma_1.default.todoCard.findUnique({
            where: {
                id_todoContainerId: { id: todoCardId, todoContainerId },
            },
        });
        if (role === client_1.Role.LANCER)
            (0, verifyCreatedUserId_1.default)(findTodoCard === null || findTodoCard === void 0 ? void 0 : findTodoCard.createdByUserId, userId);
        if (!title)
            throw new api400Error_1.default("Missing Required Fields* (title)");
        const updateTodoCardTitle = yield prisma_1.default.todoCard.update({
            data: {
                title,
            },
            where: {
                id_todoContainerId: { id: todoCardId, todoContainerId },
            },
        });
        return res.status(200).json({
            message: `TodoCard title was succesfully updated to ${updateTodoCardTitle.title}`,
        });
    });
}
exports.handleTodoCardTitleUpdate = handleTodoCardTitleUpdate;
function handleDeleteTodoById(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { todoCardId, todoId, userId, workspaceId } = req.params;
        (0, checkIfUserIdMatches_1.default)(req, userId);
        const role = yield (0, verifyRole_1.default)([client_1.Role.ADMIN, client_1.Role.LANCER], workspaceId, userId);
        const findTodo = yield prisma_1.default.todo.findUnique({
            where: { id_todoCardId: { id: todoId, todoCardId } },
        });
        if (role === client_1.Role.LANCER)
            (0, verifyCreatedUserId_1.default)(findTodo === null || findTodo === void 0 ? void 0 : findTodo.createdByUserId, userId);
        const deleteTodo = yield prisma_1.default.todo.delete({
            where: {
                id_todoCardId: { id: todoId, todoCardId },
            },
        });
        return res.status(200).json({
            message: `${deleteTodo.text} was deleted Successfully`,
            data: null,
        });
    });
}
exports.handleDeleteTodoById = handleDeleteTodoById;

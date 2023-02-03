import { Role } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import Api400Error from "../utils/api400Error";
import Api401Error from "../utils/api401Error";
import Api403Error from "../utils/api403Error";
import prisma from "../utils/prisma";

function checkIfUserIdMatches(req: Request, userId: string) {
  if (userId !== (req.user as any).id) {
    throw new Api401Error(
      "You are not Authorized to do the following Actions!!"
    );
  }
}

async function verifyRole(role: Role[], workspaceId: string, userId: string) {
  const findUser = await prisma.member.findUnique({
    where: { workspaceId_userId: { workspaceId, userId } },
  });
  const assignedRole = findUser!.role;

  const isAllowed = role.includes(assignedRole);

  if (!isAllowed) {
    throw new Api403Error(
      `Member with the role: ${assignedRole} is restricted to perform the Following Tasks`
    );
  }
}

async function handleCreateTodoContainer(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { title } = req.body;
  const { workspaceId, userId } = req.params;

  checkIfUserIdMatches(req, userId);

  await verifyRole(["ADMIN", "LANCER"], workspaceId, userId);

  const findByTitle = await prisma.todoContainer.findFirst({
    where: {
      title,
      workspaceId,
    },
  });

  if (findByTitle)
    throw new Api400Error(
      `${findByTitle.title} alread Exist's as a Todo Container`
    );

  const todoContainer = await prisma.todoContainer.create({
    data: {
      title,
      workspaceId,
    },
  });

  return res.status(201).json({
    message: `${todoContainer.title} was created SuccessFully`,
    data: todoContainer,
  });
}

async function getAllTodoContainer(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { workspaceId } = req.params;

  const allTodoContainer = await prisma.todoContainer.findMany({
    where: {
      workspaceId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return res.status(200).json({
    message: "Fetched TodoContainer SuccessFully",
    data: allTodoContainer,
  });
}

async function handleCreateTodoCard(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { title } = req.body;
  const { workspaceId, todoContainerId, userId } = req.params;

  checkIfUserIdMatches(req, userId);
  await verifyRole(["LANCER", "ADMIN"], workspaceId, userId);

  if (!title) throw new Api400Error("Missing Required Field (title)");

  const workspace = await prisma.workspace.findUnique({
    where: { id: workspaceId },
  });

  if (!workspace)
    throw new Api400Error("The Workspace with the Id doesn't exist");

  const todoCard = await prisma.todoCard.create({
    data: {
      title,
      todoContainerId,
    },
  });

  return res.status(201).json({
    message: `${todoCard.title} was created SucessFully`,
    data: todoCard,
  });
}

async function getAllTodoCardInTodoContainer(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { workspaceId, todoContainerId } = req.params;

  const workspace = await prisma.workspace.findUnique({
    where: { id: workspaceId },
  });

  if (!workspace)
    throw new Api400Error("The Workspace with the Id doesn't exist");

  const todoCards = await prisma.todoCard.findMany({
    where: {
      todoContainerId: todoContainerId,
    },
  });
  return res
    .status(200)
    .json({ message: "TodoCards Fetched SucessFully", data: todoCards });
}

async function handleCreateTodo(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { text, status } = req.body;
  const { todoContainerId, todoCardId, workspaceId, userId } = req.params;

  checkIfUserIdMatches(req, userId);
  await verifyRole(["ADMIN", "LANCER"], workspaceId, userId);

  if (!text) throw new Api400Error("Missing Required Field (text)");

  const todoContainer = await prisma.todoContainer.findUnique({
    where: { id: todoContainerId },
  });

  if (!todoContainer)
    return res
      .status(400)
      .json({ message: "TodoContainer was Found", data: null });

  const todoCard = await prisma.todoCard.findUnique({
    where: { id: todoCardId },
  });

  if (!todoCard) throw new Api400Error("Todo Card was not Found");

  const todo = await prisma.todo.create({
    data: {
      text,
      status,
      dueDate: new Date(),
      todoCardId,
    },
  });
  return res
    .status(201)
    .json({ message: `${todo.text} was created SuccessFully`, data: todo });
}

async function getAllTodosInTodoCard(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { todoCardId, todoContainerId } = req.params;

  const todoContainer = await prisma.todoContainer.findUnique({
    where: { id: todoContainerId },
  });

  if (!todoContainer) throw new Api400Error("Todo Container was not Found!!");

  const todoCard = await prisma.todoCard.findUnique({
    where: { id: todoCardId },
  });

  if (!todoCard)
    throw new Api400Error("Todo Card with the given Id was not found!!");

  const todos = await prisma.todo.findMany({
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
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return res
    .status(200)
    .json({ message: "Todos Fetched SucessFully", data: todos });
}

async function handleUpdateTodoStatus(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { todoId, todoCardId, userId, workspaceId } = req.params;
  const { status } = req.body;

  checkIfUserIdMatches(req, userId);
  verifyRole(["ADMIN", "LANCER"], workspaceId, userId);

  const findTodo = await prisma.todo.findUnique({ where: { id: todoId } });
  const deletedTodo = await prisma.todo.delete({ where: { id: todoId } });

  if (!deletedTodo || !findTodo) throw new Api400Error("Not found my boi!!");

  await prisma.todo.create({
    data: {
      ...deletedTodo,
      todoCardId: todoCardId,
      status,
    },
  });

  return res.status(200).json({ message: "Updated SucessFully", data: null });
}

async function handleDeleteTodoContainer(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { todoContainerId, userId, workspaceId } = req.params;

  checkIfUserIdMatches(req, userId);
  await verifyRole(["ADMIN", "LANCER"], workspaceId, userId);

  const deletedTodoContainer = await prisma.todoContainer.delete({
    where: { id: todoContainerId },
  });

  return res.status(200).json({
    message: `${deletedTodoContainer.title} was SuccessFully Deleted`,
    data: deletedTodoContainer,
  });
}

async function handleDeleteTodoCard(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { todoContainerId, userId, workspaceId, todoCardId } = req.params;

  checkIfUserIdMatches(req, userId);
  await verifyRole(["ADMIN", "LANCER"], workspaceId, userId);

  const deleteTodoCard = await prisma.todoCard.delete({
    where: {
      id_todoContainerId: { id: todoCardId, todoContainerId },
    },
  });

  return res.status(200).json({
    message: `${deleteTodoCard?.title} was SuccessFully Deleted`,
    data: deleteTodoCard,
  });
}

async function handleTodoContainerTitleUpdate(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { title } = req.body;
  const { todoContainerId, userId, workspaceId } = req.params;

  checkIfUserIdMatches(req, userId);

  await verifyRole(["ADMIN", "LANCER"], workspaceId, userId);

  if (!title) throw new Api400Error("Missing Required Fields");

  const updateTodo = await prisma.todoContainer.update({
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
}

async function handleTodoTitleUpdate(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { text } = req.body;
  const { todoCardId, todoId, userId, workspaceId } = req.params;

  checkIfUserIdMatches(req, userId);
  await verifyRole(["ADMIN", "LANCER"], workspaceId, userId);

  if (!text) throw new Api400Error("Updated Todo Text can't be Empty");

  const todoCard = await prisma.todoCard.findUnique({
    where: { id: todoCardId },
  });

  if (!todoCard)
    throw new Api400Error("Invalid Todo Id was Provided, Not Found!!");

  const todo = await prisma.todo.findUnique({
    where: { id_todoCardId: { id: todoId, todoCardId } },
  });

  if (!todo)
    throw new Api400Error(
      "Invalid Todo id, Todo was not Found in the Specified Todo card"
    );

  const updateTodo = await prisma.todo.update({
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
}

async function handleTodoDescriptionUpdate(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { description } = req.body;
  const { todoCardId, todoId, workspaceId, userId } = req.params;

  checkIfUserIdMatches(req, userId);
  await verifyRole(["LANCER", "ADMIN"], workspaceId, userId);

  if (!description)
    throw new Api400Error("Updaed Todo description can't be Emtpy!!");

  const todoCard = await prisma.todoCard.findUnique({
    where: { id: todoCardId },
  });

  if (!todoCard)
    throw new Api400Error("Invalid Todo Id was Provided, Not Found!!");

  const todo = await prisma.todo.findUnique({
    where: { id_todoCardId: { id: todoId, todoCardId } },
  });

  if (!todo)
    throw new Api400Error(
      "Invalid Todo Id, Todo was not Found in the Specified Todo card"
    );

  const updateTodo = await prisma.todo.update({
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
}

async function handleTodoCompletionUpdate(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { completionDate } = req.body;
  const { todoCardId, todoId, userId, workspaceId } = req.params;

  checkIfUserIdMatches(req, userId);
  await verifyRole(["ADMIN", "LANCER"], workspaceId, userId);

  if (!completionDate)
    throw new Api400Error("Updated  Completion date can't be Emtpy!!");

  const todoCard = await prisma.todoCard.findUnique({
    where: { id: todoCardId },
  });

  if (!todoCard)
    return res.status(400).json({
      message: "Invalid Todo Id was Provided, Not Found!!",
      data: null,
    });

  const todo = await prisma.todo.findUnique({
    where: { id_todoCardId: { id: todoId, todoCardId } },
  });

  if (!todo)
    throw new Api400Error(
      "Invalid Todo Id, Todo was not Found in the Specified Todo card"
    );

  const updateTodo = await prisma.todo.update({
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
}

async function handleTodoCompletedUpdate(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const completed = Boolean(req.body.completed);
  const { todoCardId, todoId, userId, workspaceId } = req.params;

  checkIfUserIdMatches(req, userId);
  await verifyRole(["ADMIN", "LANCER"], workspaceId, userId);

  const todoCard = await prisma.todoCard.findUnique({
    where: { id: todoCardId },
  });

  if (!todoCard)
    throw new Api400Error("Invalid Todo Id was Provided, Not Found!!");

  const todo = await prisma.todo.findUnique({
    where: { id_todoCardId: { id: todoId, todoCardId } },
  });

  if (!todo)
    throw new Api400Error(
      "Invalid Todo Id, Todo was not Found in the Specified Todo card"
    );

  const updateTodo = await prisma.todo.update({
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
}

async function getSingleTodo(req: Request, res: Response, next: NextFunction) {
  const { todoId } = req.params;

  const todo = await prisma.todo.findUnique({
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
}

async function handleCreateTodoComment(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { contents, parentId } = req.body;
  const { todoId, userId } = req.params;

  if (!contents) throw new Api400Error("Comments is Required");

  if (userId !== (req.user as any).id)
    throw new Api403Error("You are not allowed to Comment Forbidden!!");

  const comment = await prisma.comment.create({
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
}

async function handleTodoUpdateComment(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { contents } = req.body;
  const { commentId } = req.params;

  if (!contents) {
    throw new Api400Error(
      "Error Arose From the handleTodoUpdateComment Contents Required"
    );
  }

  const user = await prisma.comment.findUnique({
    where: { id: commentId },
    select: { userId: true },
  });

  if (user?.userId !== (req.user as any).id) {
    throw new Api401Error("You don't have permission to edit the message ");
  }

  const updateComment = await prisma.comment.update({
    where: { id: commentId },
    data: { contents },
  });

  return res
    .status(200)
    .json({ message: "Comment Updated SucessFully", data: updateComment });
}

async function handleTodoDeleteComment(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { commentId } = req.params;

  const user = await prisma.comment.findUnique({
    where: { id: commentId },
    select: { userId: true },
  });

  if (user?.userId !== (req.user as any).id) {
    throw new Api401Error("You don't have permission to edit the message ");
  }

  const deleteComment = await prisma.comment.delete({
    where: { id: commentId },
  });

  return res
    .status(200)
    .json({ message: "Comment deleted SucessFully", data: deleteComment });
}

async function handleGetTodoCommentLikeCount(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { commentId, userId } = req.params;

  const totalLikes = await prisma.like.groupBy({
    by: ["commentId"],
    where: { commentId },
    _count: {
      _all: true,
    },
  });

  const isLiked = await prisma.like.findUnique({
    where: { userId_commentId: { userId, commentId } },
  });

  return res.status(200).json({
    data: {
      likedByMe: Boolean(isLiked),
      totalLikes: totalLikes[0]?._count?._all ?? 0,
    },
  });
}

async function handleToggleTodoCommentLikes(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { userId, commentId } = req.params;

  const isExist = await prisma.like.findUnique({
    where: { userId_commentId: { userId, commentId } },
  });

  if (!isExist) {
    const like = await prisma.like.create({ data: { commentId, userId } });
    return res.status(201).json({ message: "Liked SuccessFully", data: like });
  }

  const deleteLike = await prisma.like.delete({
    where: { userId_commentId: { userId, commentId } },
  });

  return res
    .status(200)
    .json({ message: "deleted SucessFully", data: deleteLike });
}

export {
  handleCreateTodoContainer,
  getAllTodoContainer,
  handleCreateTodoCard,
  getAllTodoCardInTodoContainer,
  handleCreateTodo,
  getAllTodosInTodoCard,
  handleUpdateTodoStatus,
  handleDeleteTodoContainer,
  handleDeleteTodoCard,
  handleTodoContainerTitleUpdate,
  handleTodoTitleUpdate,
  handleTodoDescriptionUpdate,
  handleTodoCompletionUpdate,
  handleTodoCompletedUpdate,
  handleCreateTodoComment,
  getSingleTodo,
  handleTodoUpdateComment,
  handleTodoDeleteComment,
  handleGetTodoCommentLikeCount,
  handleToggleTodoCommentLikes,
};

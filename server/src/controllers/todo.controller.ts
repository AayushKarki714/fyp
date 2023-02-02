import { RequestHandler } from "express";
import prisma from "../utils/prisma";

const handleCreateTodoContainer: RequestHandler = async (req, res) => {
  const { title } = req.body;
  const { workspaceId } = req.params;
  try {
    const findByTitle = await prisma.todoContainer.findFirst({
      where: {
        title,
        workspaceId,
      },
    });

    if (findByTitle)
      return res.status(400).json({
        message: `${findByTitle.title} already Exists as a Todo container `,
      });

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
  } catch (error: any) {
    return res
      .status(400)
      .json({ message: error.message || "Error Encountered" });
  }
};

const getAllTodoContainer: RequestHandler = async (req, res) => {
  const { workspaceId } = req.params;
  try {
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
  } catch (error: any) {
    return res
      .status(400)
      .json({ message: error.message || "Error Encountered" });
  }
};

const handleCreateTodoCard: RequestHandler = async (req, res) => {
  const { title } = req.body;
  const { workspaceId, todoContainerId } = req.params;

  if (!title)
    return res.status(400).json({ message: "Missing Required Field (title)" });

  try {
    const workspace = await prisma.workspace.findUnique({
      where: { id: workspaceId },
    });

    if (!workspace)
      return res.status(400).json({
        message: "The Workspace with the Id doesn't exist",
        data: null,
      });

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
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};

const getAllTodoCardInTodoContainer: RequestHandler = async (req, res) => {
  const { workspaceId, todoContainerId } = req.params;
  try {
    const workspace = await prisma.workspace.findUnique({
      where: { id: workspaceId },
    });

    if (!workspace)
      return res
        .status(400)
        .json({ message: "The Workspace with the Id doesn't exist " });

    const todoCards = await prisma.todoCard.findMany({
      where: {
        todoContainerId: todoContainerId,
      },
    });
    return res
      .status(200)
      .json({ message: "TodoCards Fetched SucessFully", data: todoCards });
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};

const handleCreateTodo: RequestHandler = async (req, res) => {
  const { text, status } = req.body;
  const { todoContainerId, todoCardId } = req.params;
  if (!text)
    return res.status(400).json({ message: "Missing Required Field (text)" });
  try {
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

    if (!todoCard)
      return res
        .status(400)
        .json({ message: "TodoCard was not Found", data: null });

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
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};

const getAllTodosInTodoCard: RequestHandler = async (req, res) => {
  const { todoCardId, todoContainerId } = req.params;
  try {
    const todoContainer = await prisma.todoContainer.findUnique({
      where: { id: todoContainerId },
    });

    if (!todoContainer)
      return res.status(400).json({ message: "Todo Container Was not Found" });

    const todoCard = await prisma.todoCard.findUnique({
      where: { id: todoCardId },
    });

    if (!todoCard)
      return res
        .status(200)
        .json({ message: "Todo Card with the given Id was not found" });

    const todos = await prisma.todo.findMany({
      where: {
        todoCardId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res
      .status(200)
      .json({ message: "Todos Fetched SucessFully", data: todos });
  } catch (error: any) {
    return res.status(400).json({ message: error.message, data: null });
  }
};

const handleUpdateTodoStatus: RequestHandler = async (req, res) => {
  const { todoId, todoCardId } = req.params;
  const { status } = req.body;
  try {
    const findTodo = await prisma.todo.findUnique({ where: { id: todoId } });
    const deletedTodo = await prisma.todo.delete({ where: { id: todoId } });

    if (!deletedTodo || !findTodo)
      return res.status(400).json({ message: "Not found my boi!!" });
    await prisma.todo.create({
      data: {
        ...deletedTodo,
        todoCardId: todoCardId,
        status,
      },
    });
    return res.status(200).json({ message: "Updated SucessFully", data: null });
  } catch (error: any) {
    return res.status(400).json({ message: error.message, data: null });
  }
};

const handleDeleteTodoContainer: RequestHandler = async (req, res) => {
  const { todoContainerId } = req.params;
  try {
    const deletedTodoContainer = await prisma.todoContainer.delete({
      where: { id: todoContainerId },
    });
    return res.status(200).json({
      message: `${deletedTodoContainer.title} was SuccessFully Deleted`,
      data: deletedTodoContainer,
    });
  } catch (error: any) {
    return res.status(400).json({ message: error.message, data: null });
  }
};

const handleTodoContainerTitleUpdate: RequestHandler = async (req, res) => {
  const { title } = req.body;
  const { todoContainerId } = req.params;

  if (!title)
    return res
      .status(200)
      .json({ message: "Missing Required Fields", data: null });

  try {
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
  } catch (error: any) {
    return res
      .status(400)
      .json({ message: error.message || "Unexpected Error Encountered" });
  }
};

const handleTodoTitleUpdate: RequestHandler = async (req, res) => {
  const { text } = req.body;
  const { todoCardId, todoId } = req.params;

  if (!text)
    return res
      .status(400)
      .json({ message: "Updated Todo Text can't be Emtpy!!" });

  try {
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
      return res.status(400).json({
        message:
          "Invalid Todo Id, Todo was not Found in the Specified Todo card",
        data: null,
      });

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
  } catch (error: any) {
    return res.status(400).json({ message: error.message, data: null });
  }
};

const handleTodoDescriptionUpdate: RequestHandler = async (req, res) => {
  const { description } = req.body;
  const { todoCardId, todoId } = req.params;

  if (!description)
    return res
      .status(400)
      .json({ message: "Updated Todo description can't be Emtpy!!" });

  try {
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
      return res.status(400).json({
        message:
          "Invalid Todo Id, Todo was not Found in the Specified Todo card",
        data: null,
      });

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
  } catch (error: any) {
    return res.status(400).json({ message: error.message, data: null });
  }
};

const handleTodoCompletionUpdate: RequestHandler = async (req, res) => {
  const { completionDate } = req.body;
  const { todoCardId, todoId } = req.params;

  if (!completionDate)
    return res
      .status(400)
      .json({ message: "Updated  Completion date can't be Emtpy!!" });

  try {
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
      return res.status(400).json({
        message:
          "Invalid Todo Id, Todo was not Found in the Specified Todo card",
        data: null,
      });

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
  } catch (error: any) {
    return res.status(400).json({ message: error.message, data: null });
  }
};

const handleTodoCompletedUpdate: RequestHandler = async (req, res) => {
  const completed = Boolean(req.body.completed);
  const { todoCardId, todoId } = req.params;

  try {
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
      return res.status(400).json({
        message:
          "Invalid Todo Id, Todo was not Found in the Specified Todo card",
        data: null,
      });

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
  } catch (error: any) {
    return res.status(400).json({ message: error.message, data: null });
  }
};

const getSingleTodo: RequestHandler = async (req, res) => {
  const { todoId } = req.params;
  try {
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
  } catch (error: any) {
    return res.status(400).json({ message: error.message, data: null });
  }
};

const handleCreateTodoComment: RequestHandler = async (req, res) => {
  const { contents, parentId } = req.body;
  const { todoId, userId } = req.params;

  if (!contents)
    return res.status(400).json({ message: "Comments is Required" });

  if (userId !== (req.user as any).id)
    return res.status(403).json({ message: "You are not allowed to Comment" });

  try {
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
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};

const handleTodoUpdateComment: RequestHandler = async (req, res) => {
  const { contents } = req.body;
  const { commentId } = req.params;
  console.log("commentId", commentId);
  if (!contents) {
    return res.status(400).json({
      message: "Missing nicet thing in the world Contents Required",
      data: null,
    });
  }

  try {
    const user = await prisma.comment.findUnique({
      where: { id: commentId },
      select: { userId: true },
    });

    if (user?.userId !== (req.user as any).id) {
      return res
        .status(401)
        .json("You don't have permission to edit the message ");
    }

    const updateComment = await prisma.comment.update({
      where: { id: commentId },
      data: { contents },
    });
    return res
      .status(200)
      .json({ message: "Comment Updated SucessFully", data: updateComment });
  } catch (error: any) {
    return res.status(400).json({ message: error.message, data: null });
  }
};

const handleTodoDeleteComment: RequestHandler = async (req, res) => {
  const { commentId } = req.params;

  try {
    const user = await prisma.comment.findUnique({
      where: { id: commentId },
      select: { userId: true },
    });

    if (user?.userId !== (req.user as any).id) {
      return res
        .status(401)
        .json("You don't have permission to edit the message ");
    }

    const deleteComment = await prisma.comment.delete({
      where: { id: commentId },
    });
    return res
      .status(200)
      .json({ message: "Comment deleted SucessFully", data: deleteComment });
  } catch (error: any) {
    return res.status(400).json({ message: error.message, data: null });
  }
};

const handleGetTodoCommentLikeCount: RequestHandler = async (req, res) => {
  const { commentId, userId } = req.params;
  try {
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
  } catch (error: any) {
    return res.status(200).json({ message: error.message, data: null });
  }
};

const handleToggleTodoCommentLikes: RequestHandler = async (req, res) => {
  const { userId, commentId } = req.params;
  try {
    const isExist = await prisma.like.findUnique({
      where: { userId_commentId: { userId, commentId } },
    });

    if (!isExist) {
      const like = await prisma.like.create({ data: { commentId, userId } });
      return res
        .status(201)
        .json({ message: "Liked SuccessFully", data: like });
    }
    const deleteLike = await prisma.like.delete({
      where: { userId_commentId: { userId, commentId } },
    });
    return res
      .status(200)
      .json({ message: "deleted SucessFully", data: deleteLike });
  } catch (error: any) {
    return res.status(400).json({ message: error.message, data: null });
  }
};

export {
  handleCreateTodoContainer,
  getAllTodoContainer,
  handleCreateTodoCard,
  getAllTodoCardInTodoContainer,
  handleCreateTodo,
  getAllTodosInTodoCard,
  handleUpdateTodoStatus,
  handleDeleteTodoContainer,
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

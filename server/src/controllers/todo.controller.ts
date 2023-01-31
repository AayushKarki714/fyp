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

const handleTodoTitleUpdate: RequestHandler = (req, res) => {};

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
};

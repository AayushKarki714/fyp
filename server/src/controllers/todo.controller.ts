import { RequestHandler } from "express";
import prisma from "../utils/prisma";

const handleCreateTodoContainer: RequestHandler = async (req, res) => {
  const { title } = req.body;
  const { workspaceId } = req.params;
  try {
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
  const { text } = req.body;
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

export {
  handleCreateTodoContainer,
  getAllTodoContainer,
  handleCreateTodoCard,
  getAllTodoCardInTodoContainer,
  handleCreateTodo,
  getAllTodosInTodoCard,
};

interface CreateTodoContainerPayload {
  title: string;
}

interface CreateTodoProps {
  onSubmit: (data: CreateTodoContainerPayload) => void;
}

interface ITodoContainerPayload {
  id: string;
  title: string;
  createdByUserId: string;
  user: {
    photo: string;
    userName: string;
  };
}

interface ITodoCardPayload {
  title: string;
}

interface ITodoPayload {
  text: string;
  status: string;
}

interface ITodo {
  id: string;
  todoCardId: string;
  text: string;
  completionDate: Date;
  createdAt: Date;
  completed: boolean;
  _count: any;
}

export type {
  CreateTodoContainerPayload,
  CreateTodoProps,
  ITodoContainerPayload,
  ITodoCardPayload,
  ITodoPayload,
  ITodo,
};

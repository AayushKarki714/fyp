interface CreateTodoContainerPayload {
  title: string;
}

interface CreateTodoProps {
  onSubmit: (data: CreateTodoContainerPayload) => void;
}

interface ITodoContainerPayload {
  id: string;
  title: string;
}

interface ITodoCardPayload {
  title: string;
}

interface ITodoPayload {
  text: string;
}

interface ITodo {
  id: string;
  text: string;
}

export type {
  CreateTodoContainerPayload,
  CreateTodoProps,
  ITodoContainerPayload,
  ITodoCardPayload,
  ITodoPayload,
  ITodo,
};

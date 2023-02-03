import Comment from "./Comment";

interface Props {
  todo: any;
  todoId: string;
  getReplies: (data: any) => any;
  comments: any[];
}

function CommentList({ todo, comments, getReplies, todoId }: Props) {
  return (
    <>
      {comments.map((comment: any) => (
        <div key={comment.id} className="flex flex-col gap-2">
          <Comment
            todo={todo}
            todoId={todoId}
            getReplies={getReplies}
            {...comment}
          />
        </div>
      ))}
    </>
  );
}

export default CommentList;

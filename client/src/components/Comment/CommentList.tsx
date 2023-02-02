import Comment from "./Comment";

interface Props {
  todoId: string;
  getReplies: (data: any) => any;
  comments: any[];
}

function CommentList({ comments, getReplies, todoId }: Props) {
  return (
    <>
      {comments.map((comment: any) => (
        <div key={comment.id} className="flex flex-col gap-2">
          <Comment todoId={todoId} getReplies={getReplies} {...comment} />
        </div>
      ))}
    </>
  );
}

export default CommentList;

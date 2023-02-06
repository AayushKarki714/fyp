import { useState } from "react";
import {
  PencilSquareIcon,
  TrashIcon,
  HeartIcon as OutlineHeartIcon,
  ArrowUturnRightIcon,
} from "@heroicons/react/24/outline";
import { HeartIcon } from "@heroicons/react/24/solid";
import { formatDistance, formatRelative } from "date-fns";
import { useMutation, useQuery, useQueryClient } from "react-query";
import axios from "../../api/axios";
import { useAppSelector } from "../../redux/store/hooks";
import CommentForm from "./CommentForm";
import CommentList from "./CommentList";
import CommentButton from "./CommentButton";

function Comment({
  todo,
  contents,
  user,
  createdAt,
  updatedAt,
  getReplies,
  id: commentId,
  todoId,
}: any) {
  const queryClient = useQueryClient();
  const {
    user: { id },
  } = useAppSelector((state) => state.auth);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isReplying, setIsReplying] = useState<boolean>(false);
  const [areChildrenHidden, setAreChildrenHidden] = useState<boolean>(true);
  const childComments = getReplies(commentId);

  const likedQuery = useQuery(["like-query", commentId], async () => {
    const res = await axios.get(
      `/todo/${id}/${commentId}/comments/get-like-count`
    );
    return res?.data;
  });

  const likedQueryData = likedQuery?.data?.data;

  const timeFormatter = (createdAt: Date, updatedAt: Date) => {
    const isEqual =
      new Date(createdAt).getTime() === new Date(updatedAt).getTime();
    if (!isEqual) {
      return "updated " + formatRelative(new Date(updatedAt), new Date());
    }
    return "created " + formatRelative(new Date(createdAt), new Date());
  };

  const commentUpdateMutation = useMutation(
    async (data: any) => {
      const res = await axios.post(
        `/todo/${todoId}/${id}/comments/${commentId}`,
        data
      );
      return res.data;
    },
    {
      onError: (error) => {
        console.log("error", error);
      },
      onSuccess: (data) => {
        queryClient.invalidateQueries(["todo-query", todo.todoCardId]);
        queryClient.invalidateQueries(["single-todo"], todoId);
      },
    }
  );

  const commentReplyMutation = useMutation(
    async (payload: any) => {
      console.log("payload", payload);
      const res = await axios.post(`/todo/${todoId}/${id}/comments`, {
        ...payload,
        parentId: commentId,
      });
      return res.data;
    },
    {
      onError: (error) => {
        console.log("error", error);
      },
      onSuccess: (data) => {
        queryClient.invalidateQueries(["todo-query", todo.todoCardId]);
        queryClient.invalidateQueries(["single-todo"], todoId);
      },
    }
  );
  const commentDeleteMutation = useMutation(
    async () => {
      const res = await axios.delete(
        `/todo/${todoId}/${id}/comments/${commentId}`
      );
      return res.data;
    },
    {
      onError: (error) => {
        console.log("error", error);
      },
      onSuccess: (data) => {
        queryClient.invalidateQueries(["todo-query", todo.todoCardId]);
        queryClient.invalidateQueries(["single-todo"], todoId);
      },
    }
  );

  const toggleLikeMutation = useMutation(
    async () => {
      const res = await axios.post(
        `/todo/${id}/${commentId}/comment/toggle-like`
      );
      return res.data;
    },
    {
      onError: (error) => {
        console.log("error", error);
      },
      onSuccess: (data) => {
        queryClient.invalidateQueries(["todo-query", todo.todoCardId]);
        queryClient.invalidateQueries(["like-query"], commentId);
      },
    }
  );
  const commentReplySubmit = (data: any) => {
    commentReplyMutation.mutate(data);
  };

  const commentUpdateSubmit = (data: any) => {
    commentUpdateMutation.mutate(data);
  };

  const commentDeleteSubmit = () => {
    commentDeleteMutation.mutate();
  };

  const commentLikeToggleSubmit = () => {
    toggleLikeMutation.mutate();
  };

  const timeFormat = timeFormatter(createdAt, updatedAt);

  return (
    <>
      <div className="m-2 ">
        <div className="flex gap-2">
          <div className="relative flex items-center rounded-full">
            <img
              className="w-10 h-10 cursor-pointer rounded-full"
              src={user?.photo}
              alt="User Profile"
              referrerPolicy="no-referrer"
            />{" "}
          </div>
          <div className="flex flex-col gap-1 w-full rounded-md ">
            <div className="flex flex-col gap-1 p-2 rounded-md bg-custom-light-dark ">
              <h2 className="text-custom-light-green text-xs">
                {user?.userName}
              </h2>
              <p className="text-gray-300">{contents}</p>
            </div>
            <div className="flex items-center gap-3">
              <CommentButton
                onClick={commentLikeToggleSubmit}
                Icon={likedQueryData?.likedByMe ? HeartIcon : OutlineHeartIcon}
                activeClass={
                  likedQueryData?.likedByMe ? "text-custom-light-green" : ""
                }
              >
                {likedQueryData?.totalLikes}
                {likedQueryData?.totalLikes < 2 ? " Like" : " Likes"}
              </CommentButton>
              <CommentButton
                onClick={() => {
                  setIsEditing(false);
                  setIsReplying(!isReplying);
                }}
                activeClass={isReplying ? "text-custom-light-green" : ""}
                Icon={ArrowUturnRightIcon}
              >
                Reply
              </CommentButton>
              {id === user.id ? (
                <>
                  <CommentButton
                    activeClass={isEditing ? "text-custom-light-green" : ""}
                    onClick={() => {
                      setIsReplying(false);
                      setIsEditing(!isEditing);
                    }}
                    Icon={PencilSquareIcon}
                  >
                    Edit
                  </CommentButton>
                  <CommentButton
                    onClick={commentDeleteSubmit}
                    Icon={TrashIcon}
                    color="text-red-500"
                  >
                    Delete
                  </CommentButton>
                </>
              ) : null}
              <span className="text-gray-200 text-xs opacity-40  hover:opacity-100 cursor-pointer">
                {timeFormat}
              </span>
            </div>
          </div>
        </div>
      </div>

      {isEditing && (
        <CommentForm
          autoFocus
          onSubmit={commentUpdateSubmit}
          initialValue={contents}
        />
      )}

      {childComments?.length > 0 && (
        <>
          <div
            className={`nested-comments-stack ${
              areChildrenHidden ? "hide" : ""
            }`}
          >
            <button
              className="collapse-line"
              aria-label="Hide Replies"
              onClick={() => setAreChildrenHidden(true)}
            />
            <div className="nested-comments">
              <CommentList
                todo={todo}
                todoId={todoId}
                getReplies={getReplies}
                comments={childComments || []}
              />
            </div>
          </div>
          <button
            className={`btn mt-1 ${!areChildrenHidden ? "hide" : ""}`}
            onClick={() => setAreChildrenHidden(false)}
          >
            Show Replies
          </button>
        </>
      )}
      {isReplying && (
        <div className="mt-2 ml-3">
          <CommentForm autoFocus onSubmit={commentReplySubmit} />
        </div>
      )}
    </>
  );
}

export default Comment;

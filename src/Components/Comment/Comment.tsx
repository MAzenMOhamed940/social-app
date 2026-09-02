import { Edit, Image, Trash } from "iconsax-reactjs";
import type { TopComment } from "../../Pages/Posts/Posts";
import { getRelativeTime } from "../PostCard/PostCard";
import { queryClient } from "../../main";
import { useMutation } from "@tanstack/react-query";
import axiosInter from "../../axiosInterceptors/axiosInterceptors";
import toast from "react-hot-toast";
import { useParams } from "react-router";
import { useContext, useState } from "react";
import { UserTokenContext } from "../../Context/AuthUserContext";
import type { UserData } from "../Navbar/Navbar";

export default function Comment({
  comment: _comment,
  postDetails,
}: {
  comment: TopComment;
  postDetails?: boolean;
}) {
  const { userData } = useContext(UserTokenContext) as {
    userData: UserData | null;
  };
  const { id } = useParams();

  const [isEditing, setIsEditing] = useState(false);
  const [editedComment, setEditedComment] = useState(_comment.content);
  const [file, setFile] = useState<File | null>(null);

  const deleteCommentMutation = useMutation({
    mutationFn: async () => {
      const response = await axiosInter.delete(
        `/posts/${id}/comments/${_comment._id}`,
      );

      return response.data;
    },

    onSuccess: (data) => {
      toast.success(data.message || "Comment deleted successfully");

      queryClient.invalidateQueries({
        queryKey: ["postDetails", `${id}`],
      });

      setIsEditing(false);
    },

    onError: () => {
      toast.error("Failed to delete comment");
    },
  });

  function handleDelete() {
    deleteCommentMutation.mutate();
  }
  const updateCommentMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await axiosInter.put(
        `/posts/${id}/comments/${_comment._id}`,
        formData,
      );
      return response.data;
    },

    onSuccess: (data) => {
      toast.success(data.message || "Comment updated successfully");

      queryClient.invalidateQueries({
        queryKey: ["postDetails", `${id}`],
      });

      setIsEditing(false);
    },

    onError: () => {
      toast.error("Failed to update comment");
    },
  });

  function handleUpdate() {
    if (!editedComment.trim()) {
      toast.error("Comment cannot be empty");
      return;
    }
    const formData = new FormData();

    formData.append("content", editedComment);

    if (file) {
      formData.append("image", file);
    }

    updateCommentMutation.mutate(formData);
  }

  return (
    <>
      <div className="flex gap-3 text-sm w-80 md:w-full">
        <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0">
          <img
            src={_comment.commentCreator.photo}
            alt={_comment.commentCreator.name}
          />
        </div>
        <div className="bg-gray-100 w-100 rounded-xl px-3 py-2 flex-1">
          <div className="flex items-center justify-between mb-0.5">
            <span className="font-semibold text-gray-900 text-xs">
              {_comment.commentCreator.name}
            </span>
            <span className="text-[10px] text-gray-400">
              {getRelativeTime(_comment.createdAt)}
            </span>
          </div>
          <p className="text-gray-700 leading-normal">{_comment.content}</p>
          {_comment.image && (
            <div className="mt-3 overflow-hidden rounded-lg border border-gray-100">
              <img src={_comment.image} className="w-full h-64 object-cover" />
            </div>
          )}

          {userData?._id === _comment.commentCreator._id && postDetails ? (
            <div className="flex justify-between items-center mt-4">
              <button
                onClick={handleDelete}
                disabled={deleteCommentMutation.isPending}
                className="flex gap-1.5 items-center cursor-pointer hover:text-red-500 duration-300 transition-colors disabled:opacity-50"
              >
                <Trash size="22" color="red" />

                <span>
                  {deleteCommentMutation.isPending ? "Deleting..." : "Delete"}
                </span>
              </button>

              <button
                onClick={() => setIsEditing(true)}
                className="flex gap-1.5 items-center cursor-pointer hover:text-green-500 duration-300 transition-colors"
              >
                <Edit size="22" className="text-main-color" />
                <span>Edit</span>
              </button>
            </div>
          ) : (
            ""
          )}
          {isEditing ? (
            <div className="flex flex-col gap-2 mt-2 w-70 md:w-full">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={editedComment}
                  onChange={(e) => setEditedComment(e.target.value)}
                  className="flex-1 w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-main-color"
                />
                <input
                  id={`comment-file-${_comment._id}`}
                  type="file"
                  onChange={(e) => {
                    setFile(e.target.files?.[0] || null);
                  }}
                  className="hidden w-full pl-4 pr-20 py-1.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-main-color focus:ring-1 focus:ring-main-color placeholder-gray-400"
                />
                <label
                  htmlFor={`comment-file-${_comment._id}`}
                  className="cursor-pointer border-2 w-fit rounded-md  my-3 flex items-center p-1 border-main-color"
                >
                  <Image size="22" color="green" />
                </label>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleUpdate}
                  disabled={updateCommentMutation.isPending}
                  className="px-3 py-1 w-full bg-main-color text-white rounded-lg cursor-pointer hover:bg-green-600 duration-300 transition-colors"
                >
                  {updateCommentMutation.isPending ? "Saving..." : "Save"}
                </button>

                <button
                  onClick={() => {
                    setEditedComment(_comment.content);
                    setIsEditing(false);
                  }}
                  className="px-3 py-1 w-full bg-gray-300 rounded-lg cursor-pointer hover:bg-gray-400 duration-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
    </>
  );
}

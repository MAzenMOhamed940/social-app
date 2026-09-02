import { Edit, Image, Like1, Message, Repeat, Trash } from "iconsax-reactjs";
import type { Post } from "../../Pages/Posts/Posts";
import { useContext, useState } from "react";
import { UserTokenContext } from "../../Context/AuthUserContext";
import type { UserData } from "../Navbar/Navbar";
import Comment from "../Comment/Comment";
import { formatDistanceToNow } from "date-fns";
import { Link } from "react-router";
import { useMutation } from "@tanstack/react-query";
import axiosInter from "../../axiosInterceptors/axiosInterceptors";
import toast from "react-hot-toast";
import { queryClient } from "../../main";

export function getRelativeTime(dateString: string) {
  return formatDistanceToNow(new Date(dateString), {
    addSuffix: true,
  });
}
export default function PostCard({
  post,
  postDetails,
  comments,
  id,
}: {
  post: Post;
  postDetails?: boolean;
  comments?: any;
  id?: any;
}) {
  
  const { userData } = useContext(UserTokenContext) as {
    userData: UserData | null;
  };
  const [comment, setComment] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedPost, setEditedPost] = useState(post.body);
  const [postFile, setPostFile] = useState<File | null>(null);
  const [uploadedCommentImage, setUploadedCommentImage] = useState<string | undefined>(undefined);
  const [imagePreview, setImagePreview] = useState<string | null>(
    post.image || null,
  );

  const handleComment = () => {
    const formData = new FormData();

    formData.append("content", comment);

    if (file) {
      formData.append("image", file);
    }

    createCommentMutation.mutate(formData);
  };

  const createCommentMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await axiosInter.post(`/posts/${id}/comments`, formData);
      return response.data.message;
    },
    onSuccess: (message) => {
      toast.success(message);
      queryClient.invalidateQueries({
        queryKey: ["postDetails", `${id}`],
        
      });
      queryClient.invalidateQueries({
        queryKey: ["myProfile"],
        
      });
      setComment("");
      setFile(null);
      setUploadedCommentImage(undefined);
    },

    onError: () => {
      toast.error("Failed to create comment");
    },
  });
  const deletePostMutation = useMutation({
    mutationFn: async () => {
      const response = await axiosInter.delete(`/posts/${post._id}`);

      return response.data;
    },

    onSuccess: (data) => {
      toast.success(data.message || "Post deleted successfully");

      queryClient.invalidateQueries({
        queryKey: ["allPosts"],
      });
            queryClient.invalidateQueries({
        queryKey: ["myProfile"],
        
      });
    },

    onError: () => {
      toast.error("Failed to delete post");
    },
  });
  const handleDeletePost = () => {
    deletePostMutation.mutate();
  };
  const updatePostMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await axiosInter.put(`/posts/${post._id}`, formData);

      return response.data;
    },

    onSuccess: (data) => {
      toast.success(data.message || "Post updated successfully");

      queryClient.invalidateQueries({
        queryKey: ["allPosts"],
      });
                  queryClient.invalidateQueries({
        queryKey: ["myProfile"],
        
      });

      setIsEditing(false);
      setPostFile(null);
    },

    onError: () => {
      toast.error("Failed to update post");
    },
  });

  const handleUpdatePost = () => {
    if (!editedPost.trim()) {
      toast.error("Post cannot be empty");
      return;
    }

    const formData = new FormData();

    formData.append("body", editedPost);

    if (postFile) {
      formData.append("image", postFile);
    }

    updatePostMutation.mutate(formData);
  };

  return (
    <article className="w-full min-w-0 lg:max-w-xl bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden font-sans">
      <div className="flex items-center px-4 py-3 border-b border-gray-100">
        <div className="w-10 h-10 rounded-full items-center justify-center font-bold mr-3">
          <img src={post.user.photo} alt={post.user.name} />
        </div>
        <div>
          <h4 className="text-sm font-semibold text-gray-900 leading-tight">
            {post.user.name}
          </h4>
          <span className="text-xs text-gray-500">
            {getRelativeTime(post.createdAt)}
          </span>
        </div>
        
            {userData?._id === post.user._id && (
        <div className="flex gap-3 my-2 ms-50">
          <button
            onClick={handleDeletePost}
            disabled={deletePostMutation.isPending}
            className="flex items-center gap-1 text-red-500 hover:text-red-700 disabled:opacity-50 cursor-pointer"
          >
            <Trash size="18" />

            {deletePostMutation.isPending ? "Deleting..." : "Delete"}
          </button>

          <button
            onClick={() => {
              setEditedPost(post.body);
              setIsEditing(true);
            }}
            className="flex items-center gap-1 text-main-color hover:text-green-600 cursor-pointer"
          >
            <Edit size="18" />
            Edit
          </button>
        </div>
      )}

      </div>


      <div className="p-4">
        {isEditing ? (
          <div className="flex flex-col gap-3">
            <textarea
              value={editedPost}
              onChange={(e) => setEditedPost(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:border-main-color resize-none"
              rows={4}
            />

            <div className="flex items-center gap-2">
              <label
                htmlFor={`post-image-${post._id}`}
                className="cursor-pointer border-2 rounded-md flex items-center p-2 border-main-color"
              >
                <Image size="22" color="green" />
              </label>

              <input
                id={`post-image-${post._id}`}
                type="file"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];

                  if (file) {
                    setPostFile(file);
                    setImagePreview(URL.createObjectURL(file));
                  }
                }}
              />

              <button
                onClick={handleUpdatePost}
                disabled={updatePostMutation.isPending}
                className="px-4 py-2 bg-main-color text-white rounded-lg cursor-pointer"
              >
                {updatePostMutation.isPending ? "Saving..." : "Save"}
              </button>

              <button
                onClick={() => {
                  setEditedPost(post.body);
                  setPostFile(null);
                  setIsEditing(false);
                }}
                className="px-4 py-2 bg-gray-200 rounded-lg cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <p className="text-sm text-gray-700 leading-relaxed font-bold">{post.body}</p>
        )}
        {post.image && (
          <div className="mt-3 overflow-hidden rounded-lg border border-gray-100">
            <img
              src={isEditing ? (imagePreview ?? post.image) : post.image}
              alt="omage"
              className="w-full h-64 object-cover"
            />
          </div>
        )}
      </div>

      <div className="flex items-center justify-between px-4 py-2 border-t border-gray-100 bg-gray-50/50">
        <button className="flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-blue-500 transition-colors duration-200">
          <span>
            <Like1 />
          </span>
          <span>{post.likesCount} </span>
          Like
        </button>

        <Link
          to={`/postDetails/${post._id}`}
          className="flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-green-500 transition-colors duration-200"
        >
          <span>
            <Message size="20" />
          </span>
          <span>{post.commentsCount} </span>
          Comment
        </Link>

        <button className="flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-green-700 transition-colors duration-200">
          <span>
            <Repeat size="20" />
          </span>
          <span>{post.sharesCount} </span>
          Share
        </button>
      </div>
      

      <div className="p-4 bg-gray-50/30 space-y-4">
        {postDetails && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0">
              <img src={userData?.photo} alt={userData?.name} />
            </div>
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Write a comment..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full pl-4 pr-20 py-1.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-main-color focus:ring-1 focus:ring-main-color placeholder-gray-400"
              />
              <input
                id="comment-file"
                type="file"
                onChange={(e) => {
                  setFile(e.target.files?.[0] || null)
                  setUploadedCommentImage(URL.createObjectURL(e.target.files![0]));
                }}
                className="hidden w-full pl-4 pr-20 py-1.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-main-color focus:ring-1 focus:ring-main-color placeholder-gray-400"
              />

              <button
                onClick={handleComment}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-semibold text-main-color hover:text-green-600 px-2 py-1 transition-colors"
              >
                Post
              </button>
            </div>
            <label
              htmlFor="comment-file"
              className="cursor-pointer border-2 rounded-md flex items-center p-1 border-main-color"
            >
              <Image size="22" color="green" />
            </label>
          </div>
        )}
        <div className="flex gap-3 text-sm">
          {post.topComment && !postDetails && (
            <Comment comment={post.topComment} postDetails={postDetails}/>
          )}
          <div className="flex flex-col gap-3">
          <img
            src={uploadedCommentImage}
            alt="Uploaded comment"
            className={uploadedCommentImage === undefined ? "hidden" : ""}
          />
            {postDetails &&
              comments!.map((e: any) => <Comment key={e._id} comment={e} postDetails={postDetails} />)}
          </div>
        </div>
      </div>
    </article>
  );
}

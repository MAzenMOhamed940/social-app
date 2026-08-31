import { useQuery } from "@tanstack/react-query";
import PostCard from "../../Components/PostCard/PostCard";
import axiosInter from "../../axiosInterceptors/axiosInterceptors";
import { InfinitySpin } from "react-loader-spinner";
import CreatePost from "./CreatePost/CreatePost";
import toast from "react-hot-toast";
export interface Post {
  _id: string;
  body: string;
  image: string;
  privacy: string;
  user: User;
  sharedPost: any;
  likes: any[];
  createdAt: string;
  commentsCount: number;
  topComment: TopComment;
  sharesCount: number;
  likesCount: number;
  isShare: boolean;
  id: string;
  bookmarked: boolean;
}

export interface User {
  _id: string;
  name: string;
  username: string;
  photo: string;
}

export interface TopComment {
  _id: string;
  content: string;
  image: string
  commentCreator: CommentCreator;
  post: string;
  parentComment: any;
  likes: any[];
  createdAt: string;
}

export interface CommentCreator {
  _id: string;
  name: string;
  username: string;
  photo: string;
}

export default function Posts() {
  async function getAllPosts() {
    try {
      const response = await axiosInter.get("/posts");
      return response.data.data.posts;
    } catch (error) {
      toast.error("failed to Get All Posts")
    }
  }

  const { data, isLoading } = useQuery({
    queryKey: ["allPosts"],
    queryFn: () => getAllPosts(),
  });

  if (isLoading) {
    return <InfinitySpin width="200" color="#4fa94d" />;
  }


  return (
    <>
      <div className="flex flex-col gap-3 w-full p-2 sm:w-3/4 lg:w-130">
      <CreatePost/>
        {data?.map((post: any) => (
          <PostCard key={post._id} post={post} />
        ))}
      </div>
    </>
  );
}

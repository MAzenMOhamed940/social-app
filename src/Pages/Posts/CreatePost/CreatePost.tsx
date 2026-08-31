import { useMutation } from "@tanstack/react-query";
import { useContext, useState } from "react";
import axiosInter from "../../../axiosInterceptors/axiosInterceptors";
import toast from "react-hot-toast";
import { queryClient } from "../../../main";
import { Image } from "iconsax-reactjs";
import { UserTokenContext } from "../../../Context/AuthUserContext";
import type { UserData } from "../../../Components/Navbar/Navbar";

export default function CreatePost() {
  const [post, setPost] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string>("");

  const createPost = () => {
  const formData = new FormData();

  formData.append("body", post);

  if (file) {
    formData.append("image", file);
  }

  createPostMutation.mutate(formData);
};


const createPostMutation = useMutation({
  mutationFn: async (formData: FormData) => {
    const response = await axiosInter.post("/posts", formData);        
    return response.data.message;
  },
   onSuccess: (message) => {
    toast.success(message);
    queryClient.invalidateQueries({
      queryKey: ["allPosts"],
    });
    setPost("");
    setFile(null);
    setUploadedImage("")
  },

  onError: () => {
    toast.error("Failed to create Post");
  },
});

  const { userData } = useContext(UserTokenContext) as {
    userData: UserData | null;
  };


  return (
    <div className="w-full mx-auto my-8 bg-white border border-gray-200 rounded-2xl shadow-sm p-5 font-sans">
      {/* Title Header */}
      <h2 className="text-lg font-bold text-gray-900 mb-4">Create Post</h2>

      <div className="space-y-4">
        {/* User Info Row */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm">
            <img src={userData?.photo} alt="" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-900">{userData?.name}</h4>
            <span className="text-xs text-gray-500">Posting publicly</span>
          </div>
        </div>

        {/* Input Area */}
        <input
          type="text"
          value={post}
          onChange={(e) => setPost(e.target.value)}
          placeholder="What's on your mind?"
          className="w-full text-base text-gray-800 placeholder-gray-400 outline-none resize-none border-b border-gray-100 pb-2 focus:border-indigo-500 transition-colors"
        />

        <div className="flex items-center justify-between py-1.5 px-3 border border-gray-200 rounded-xl bg-gray-50/50">
          <input
            id="post-file"
            type="file"
            onChange={(e) => {
              setFile(e.target.files?.[0] || null)
              setUploadedImage(URL.createObjectURL(e.target.files![0]))
              ;
            }}
            className="hidden w-full pl-4 pr-20 py-1.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-main-color focus:ring-1 focus:ring-main-color placeholder-gray-400"
          />
          <span className="text-xs font-semibold text-gray-500">
            Add to your post
          </span>
          <label
            htmlFor="post-file"
            className="flex items-center gap-1.5 text-sm p-1.5 hover:bg-gray-200/60 rounded-lg transition-colors"
          >
            <span><Image className="text-main-color"/></span>
            <span className="text-xs font-medium text-gray-600">Photo</span>
          </label>
        </div>

        {/* Action Button */}
        <img src={uploadedImage} className="w-full" />
        <button onClick={createPost} className="w-full py-2.5 bg-main-color hover:bg-green-500 cursor-pointer text-white text-sm font-bold rounded-xl shadow-sm transition-colors">
          Post
        </button>
      </div>
    </div>
  );
}

import { useQuery } from "@tanstack/react-query";
import axiosInter from "../../axiosInterceptors/axiosInterceptors";
import { Man, Woman } from "iconsax-reactjs";
import { InfinitySpin } from "react-loader-spinner";
import PostCard from "../../Components/PostCard/PostCard";
import type { Post } from "../Posts/Posts";

export default function ProfilePage() {
  async function getAllPosts() {
    try {
      const response = await axiosInter.get("/posts");
      return response.data.data.posts;
    } catch (error) {
      console.log("error: ", error);
    }
  }
  async function getMyProfile() {
    const respone = axiosInter.get("/users/profile-data");
    return (await respone).data.data.user;
  }

  const { data, isLoading } = useQuery({
    queryKey: ["myProfile"],
    queryFn: async () => {
      const [user, userPosts] = await Promise.all([
        getMyProfile(),
        getAllPosts(),
      ]);

      return { user, userPosts };
    },
  });

  const user = data?.user;
  const allPosts: Post[] = data?.userPosts ?? [];

  const userPosts = allPosts.filter(
    (post: Post) => post.user?._id === user?._id,
  );

  console.log(userPosts);

  const dateFormatter = (dateString: string) => {
    const date = new Date(dateString);

    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (isLoading) {
    return <InfinitySpin width="200" color="#4fa94d" />;
  }

  return (
    <>
      <div className="w-full bg-white border border-gray-200/80 rounded-3xl shadow-xl shadow-gray-100/50 overflow-hidden font-sans">
        <div className="h-40 w-full bg-linear-to-r  from-main-color via-green-400 to-green-600 relative">
          <div className="absolute inset-0 opacity-15 bg-[linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] bg-size-[20px_20px]"></div>
        </div>

        <div className="px-8 pb-10 relative">
          <div className="flex flex-col md:flex-row md:items-end justify-between -mt-16 mb-8 gap-6 border-b border-gray-100 pb-8">
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-5">
              <div className="w-36 h-36 rounded-2xl bg-linear-to-tr from-main-color via-green-400 to-green-600 p-1 shadow-xl">
                <div className="w-full h-full rounded-[14px] bg-white flex items-center justify-center text-4xl font-extrabold text-indigo-600 shadow-inner">
                  <img src={user?.photo} alt={user?.name} />
                </div>
              </div>

              <div className="text-center sm:text-left mb-2 mt-20">
                <div className="flex items-center justify-center sm:justify-start gap-2.5">
                  <h1 className="text-3xl font-black text-gray-900 tracking-tight">
                    {user?.name}
                  </h1>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-green-700 border border-main-color">
                    Verified
                  </span>
                </div>
                <p className="text-base text-gray-500 font-medium">
                  @{user?.username}
                </p>
                <div className="flex gap-3">
                  <p className="text-base font-medium">
                    Followers: {user?.followersCount}
                  </p>
                  <p className="text-base font-medium">
                    Following: {user?.followingCount}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-center gap-3">
              <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Active Now
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
            <div>
              <h3 className="text-xs font-bold text-main-color uppercase tracking-widest mb-4">
                Identity Profile
              </h3>

              <div className="space-y-4">
                <div className="bg-gray-50/60 rounded-xl p-4 border border-gray-100">
                  <p className="text-xs font-medium text-gray-400 mb-0.5">
                    Username
                  </p>
                  <p className="text-base font-bold text-gray-900">
                    {user?.username}
                  </p>
                </div>

                <div className="bg-gray-50/60 rounded-xl p-4 border border-gray-100">
                  <p className="text-xs font-medium text-gray-400 mb-0.5">
                    Full Name
                  </p>
                  <p className="text-base font-bold text-gray-900">
                    {user?.name}
                  </p>
                </div>

                <div className="bg-gray-50/60 rounded-xl p-4 border border-gray-100">
                  <p className="text-xs font-medium text-gray-400 mb-0.5">
                    Primary Email
                  </p>
                  <p className="text-base font-bold text-gray-900 select-all">
                    {user?.email}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <div className="space-y-4">
                <div className="bg-gray-50/60 rounded-xl p-4 border border-gray-100">
                  <p className="text-xs font-medium text-gray-400 mb-0.5">
                    Gender
                  </p>
                  <p className="text-sm font-mono font-bold capitalize text-gray-700 flex gap-2 items-center">
                    {user?.gender == "male" ? (
                      <Man size="22" color="cyan" />
                    ) : (
                      <Woman size="22" color="pink" />
                    )}
                    {user?.gender}
                  </p>
                </div>

                <div className="bg-gray-50/60 rounded-xl p-4 border border-gray-100">
                  <p className="text-xs font-medium text-gray-400 mb-0.5">
                    Account Creation Date
                  </p>
                  <p className="text-base font-bold text-gray-900">
                    {dateFormatter(user?.createdAt)}
                  </p>
                </div>

                <div className="bg-gray-50/60 rounded-xl p-4 border border-gray-100">
                  <p className="text-xs font-medium text-gray-400 mb-0.5">
                    Date Of Birth
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-base font-bold text-gray-900">
                      {dateFormatter(user?.dateOfBirth)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
            <h3 className="text-center text-5xl font-semibold my-4">
              Your Posts
            </h3>
        {userPosts.length === 0 ? (
          <p className="text-center text-3xl p-10 text-gray-400">You didn't creat any posts</p>
        ) : (
          <div className="">
            <div className="flex mx-auto flex-col gap-3 w-full p-2 sm:w-3/4 lg:w-130">
              {userPosts?.map((post: Post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

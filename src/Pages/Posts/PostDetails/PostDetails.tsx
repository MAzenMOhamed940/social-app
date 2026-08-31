import PostCard from '../../../Components/PostCard/PostCard'
import axiosInter from '../../../axiosInterceptors/axiosInterceptors'
import { useQuery } from '@tanstack/react-query'
import {  useParams } from 'react-router'
import { InfinitySpin } from 'react-loader-spinner'

export default function PostDetails() {
  const {id} = useParams()

async function getSinglePost() {
    const response = axiosInter.get(`/posts/${id}`)

    return (await response).data.data.post
    
}
  async function getAllComments() {
    const response = axiosInter.get(`/posts/${id}/comments?page=1&limit=10`)
    return (await response).data.data.comments
  }

 

const {data, isLoading} = useQuery({
    queryKey : ["postDetails",`${id}`],
    queryFn : async ()=> {
      const [post , comments] = await Promise.all([
        getSinglePost(),
        getAllComments()

      ])
      return { post , comments}
    }
})


if (isLoading) {
    return <InfinitySpin width="200" color="#4fa94d" />;
  }


  return (
    <>
       <PostCard post={data?.post} comments={data?.comments} postDetails id={id} />
   
    </>
  )
}

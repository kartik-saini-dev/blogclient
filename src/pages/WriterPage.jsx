
import { FaUserCheck } from "react-icons/fa";
import { useParams } from "react-router-dom";
import NoProfile from "../assets/profile.png";
import {

  Card,
  Pagination,
  PopularPosts,
  PopularWriters,
} from "../components";
import FollowButton from "../components/FollowButton";
import useStore from "../store";
import { formatNumber } from "../utils";
import { popular, posts } from "../utils/dummyData";
import { useFollowWriter, usePaginatedQuery,usePageState } from "../hooks/auth-hook";
import { Toaster } from "sonner";
import { useState ,useEffect} from "react";

const WriterPage = () => {
  const { user } = useStore();
  const { id } = useParams();
  const { mutate } = useFollowWriter(id, user?.token);
  const [followerIds, setFollowerIds] = useState();

  const [page, handlePageChange] = usePageState("writerPage");
  const isLoggedIn = user?.token ? true : false;

  const { data: writerPosts, writerData, totalPages,  totalPosts, isLoading, isError, error } = usePaginatedQuery(
    `http://localhost:8800/users/writer/${id}/posts?page=${page}`
  );
// watch backend and ecommerce website as well 


    useEffect(()=>{
      if (writerData) {
        console.log("here inside useEffect",writerData);
        setFollowerIds(writerData?.followers?.map((f) => f) || []);
      }
    }, [writerData]);

  const handleFollow = () => {
    const userId = user?.user?._id;
    const updatedFollowers = [...followerIds, userId];

    // Optimistically update UI
    setFollowerIds(updatedFollowers);
    mutate();

  };// can also create unfollow 
 

  const writerPostsList = writerPosts?.length > 0 ? writerPosts : null;
  
      
  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error: {error.message}</div>;

  if (!writerPostsList)
    return (
      <div className='w-full h-full py-8 flex items-center justify-center'>
        <span className='text-lg text-slate-500'>No Writer Found</span>
      </div>
    );

  return (
    <div className='px-0 2xl:px-20 '>
      <div className='w-full md:h-60 flex flex-col gap-5 items-center md:flex-row bg-black dark:bg-gradient-to-r from-[#020b19] via-[#071b3e] to-[#020b19]  mt-5 mb-10 rounded-md p-5 md:px-20'>
        <img
          src={writerData?.image || NoProfile}
          alt='Writer'
          className='w-48 h-48 rounded-full border-4 border-slate-400 object-cover'
        />
        <div className='w-full h-full flex flex-col gap-y-5 md:gap-y-8  items-center justify-center'>
          <h2 className='text-white text-4xl 2xl:text-5xl font-bold'>
            {writerData?.name}
          </h2>

          <div className='flex gap-10'>
            <div className='flex flex-col items-center'>
              <p className='text-gray-300 text-2xl font-semibold'>
                {formatNumber(writerData?.followers?.length ?? 0)}
              </p>
              <span className='text-gray-500'>Followers</span>
            </div>

            <div className='flex flex-col items-center'>
              <p className='text-gray-300 text-2xl font-semibold'>
                {formatNumber(totalPosts ?? 0)}
              </p>
              <span className='text-gray-500'>Posts</span>
            </div>
          </div>


          <div>
            {!followerIds?.includes(user?.user?._id) ? (
              <FollowButton
                label='Follow'
                onClick={handleFollow}
                styles='text-slate-800 text-semibold md:-mt-4 px-6 py-1 rounded-full bg-white'
                isLoggedIn={isLoggedIn}
              />
            ) : (
              <div className='flex items-center justify-center gap-2 text-white text-semibold md:-mt-4 px-6 py-1 rounded-full border'>
                <span>Following</span>
                <FaUserCheck />
              </div>
            )}
          </div>

        </div>
      </div>

      <div className='w-full flex flex-col md:flex-row gap-10 2xl:gap-20'>
        {/* LEFT */}
        <div className='w-full md:w-2/3 flex flex-col gap-y-28 md:gap-y-14'>
          {writerPosts?.length === 0 ? (
            <div className='w-full h-full py-8 flex  justify-center'>
              <span className='text-lg text-slate-500'>No Post Available</span>
            </div>
          ) : (
            <>
              {writerPosts?.map((post, index) => (
                <Card key={post?._id + index} post={post} />
              ))}

              <div className='w-full flex items-cemter justify-center'>
                <Pagination totalPages={totalPages} onPageChange={handlePageChange} currentPage={page} />
              </div>
            </>
          )}
        </div>

        {/* RIGHT */}
        <div className='w-full md:w-1/4 flex flex-col gap-y-12'>
          {/* POPULAR POSTS */}
          <PopularPosts posts={popular?.posts} />

          {/* POPULAR WRITERS */}
          <PopularWriters data={popular?.writers} />
        </div>
      </div>
      <Toaster richColors />
    </div>
  );
};

export default WriterPage;

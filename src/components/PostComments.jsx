

import React, { useState } from "react";
import useStore from "../store";
import Button from "./Button";
import { Link } from "react-router-dom";
import Profile from "../assets/profile.png";
import { Toaster } from "sonner";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import axios from "axios";

const PostComments = ({ postId }) => {
  const { user } = useStore();
  const [desc, setDesc] = useState("");
  const queryClient = useQueryClient();

  const fetchComments = async () => {
    const response = await axios.get(`http://localhost:8800/posts/comments/${postId}`, {
      headers: {
        Authorization: `Bearer ${user?.token}`,
      },
    });
    return response.data;
  };

  const { isLoading, error, data } = useQuery({

    queryKey:   ['comments', postId],
    queryFn: fetchComments, 
    enabled: !!user?.token,
    onSuccess: (data) => {
     console.log(data,"data fetching comments");
    },
    onError: (error) => {
      console.log("Error fetching comments", error.message);
    },

});

  const addComment = async (comment) => {
    const response = await axios.post(
      `http://localhost:8800/posts/comment/${postId}`,
      { desc: comment },
      {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      }
    );
    return response.data;
  };

  const deleteComment = async ({ commentId }) => {
    await axios.delete(`http://localhost:8800/posts/comment/${commentId}/${postId}`, {
      headers: {
        Authorization: `Bearer ${user?.token}`,
      },
    });
  };

  const addCommentMutation = useMutation({
    mutationFn:addComment, 
    onSuccess: () => {
      
      queryClient.invalidateQueries(['comments', postId]); ///use toast to show data message 
    },
    onError: (error) => {
      console.log("Error submitting comment", error.message);
    },
  });

  const deleteCommentMutation = useMutation({
     mutationFn:deleteComment, 
    onSuccess: () => {
      queryClient.invalidateQueries(['comments', postId]);
    },
    onError: (error) => {
      console.log("Error deleting comment", error.message);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    addCommentMutation.mutate(desc);
    setDesc(""); // Clear the textarea after submitting
  };

  const handleDeleteComment = (commentId) => {
    deleteCommentMutation.mutate({ commentId });
  };

  return (
    <div className='w-full py-10'>
      <p className='text-lg text-slate-700 dark:text-slate-500 mb-6'>
        Post Comments
      </p>

      {user?.token ? (
        <form className='flex flex-col mb-6' onSubmit={handleSubmit}>
          <textarea
            name='desc'
            onChange={(e) => setDesc(e.target.value)}
            value={desc}
            required={true}
            placeholder='Add a comment...'
            className='bg-transparent w-full p-2 border border-gray-300 focus:outline-none focus:border-blue-600 focus:ring-blue-600 rounded'
          ></textarea>

          <div className='w-full flex justify-end mt-2'>
            <Button
              type='submit'
              label='Submit'
              styles='bg-blue-600 text-white py-2 px-5 rounded'
            />
          </div>
        </form>
      ) : (
        <Link to='/signin' className='flex flex-col py-10'>
          <Button
            label='Sign in to comment'
            styles='flex items-center justify-center bg-white dark:bg-transparent text-black dark:text-gray-500 px-4 py-1.5 rounded-full border'
          />
        </Link>
      )}

      <div className='w-full h-full flex flex-col gap-10 2xl:gap-y-14 px-2'>
        {isLoading ? (
          <span className='text-base text-slate-600'>Loading comments...</span>
        ) : error ? (
          <span className='text-base text-red-600'>Error loading comments</span>
        ) : (
          data?.comments?.map((el) => (
            <div key={el?._id} className='w-full flex gap-4 items-start'>
              <img
                src={el?.user?.image || Profile}
                alt={el?.user?.name}
                className='w-10 h-10 rounded-full'
              />
              <div className='w-full -mt-2'>
                <div className='w-full flex items-center gap-2'>
                  <p className='text-slate-700 dark:text-gray-400 font-medium'>
                    {el?.user?.name}
                  </p>
                  <span className='text-slate-700 text-xs italic'>
                    {new Date(el?.createdAt).toDateString()}
                  </span>
                </div>

                <div className='flex flex-col gap-2'>
                  <span className='text-sm'>{el?.desc}</span> 
                  {/* <span className='text-sm'>{let x = 1; console.log()}</span>  */}

                  {user?.user?._id === el?.user?._id && (
                    <span
                      className='text-base text-red-600 cursor-pointer'
                      onClick={() => handleDeleteComment(el?._id)}
                    >
                      Delete
                    </span>//
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <Toaster richColors />
    </div>
  );
};

export default PostComments;

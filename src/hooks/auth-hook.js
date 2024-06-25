import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import useStore from "../store";
import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import {  toast } from "sonner";

const API_URI = "http://localhost:8800";

export const useEdit = (token, toast) => {
 
  const signIn = useStore(state => state.signIn);
  return useMutation({
    mutationFn: async (formData) => {

      const { data } = await axios.put(`${API_URI}/users/update-user`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return data;
    },
    onError: (error, data) => {

      toast.error(error?.response?.data?.message ?? error.message);
    },
    onSuccess: (data) => {
      console.log(data);
      signIn({ user: data.user, token: data.token })

      toast.success(data?.message);

    },
  });
};

export const useLogin = () => {
  const signIn = useStore(state => state.signIn);
  const navigate = useNavigate();
  return useMutation({
    mutationFn: async ({formData,url}) => {
      const { data } = await axios.post(url, formData);


      return data;
    },
    onError: (error, data) => {

      toast.error(error?.response?.data?.message ?? error.message);
    },
    onSuccess: (data) => {
   
      signIn({ user: data.user, token: data.token })
      navigate("/");
      // console.log(data);
      toast.success(data?.message);

    },
  });
};


export const useFollowWriter = (writerId,token) => {
 
  return useMutation({
    mutationFn: async () => {
      const { data } = await  axios.post(`${API_URI}/users/follower/${writerId}`, null,  {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return data;
    },
    onError: (error, data) => {

      toast.error(error?.response?.data?.message ?? error.message);
    },
    onSuccess: (data) => {
     
      toast.success(data?.message);

    },
  });
};

export const usePaginatedQuery = (url) => {
  const [data, setData] = useState([]);
  const [writerData, setWriterData] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalPosts, setTotalPosts] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(url);
        setData(response.data.posts);
        setWriterData(response.data.user);
        setTotalPages(response.data.totalPages);
        setTotalPosts(response.data.totalPosts);
        setIsLoading(false);
        // console.log(response,"this is ")
      } catch (err) {
        setIsError(true);
        setError(err);
        setIsLoading(false);
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [url]);



  return {
    data,
    writerData,
    totalPages,
    totalPosts,
    isLoading,
    isError,
    error,
  };
};


export const usePageState = (key, initialValue = 1) => {
  const [page, setPage] = useState(() => {
    const savedPage = localStorage.getItem(key);
    return savedPage ? Number(savedPage) : initialValue;
  });

  const handlePageChange = (newPage) => {
    localStorage.setItem(key, newPage);
    setPage(newPage);
  };

  return [page, handlePageChange];
};

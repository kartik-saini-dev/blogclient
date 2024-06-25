

import { useGoogleLogin } from "@react-oauth/google";
import React from "react";
import { FcGoogle } from "react-icons/fc";
import { Toaster, toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import { Divider, Inputbox, Logo } from "../components";
import Button from "../components/Button";
import { useLogin } from '../hooks/auth-hook';
import { useForm } from 'react-hook-form';
import axios from "axios";

const LoginPage = () => {
  const navigate = useNavigate();
  const { mutate } = useLogin();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();// can also integrate with zod and it will care about the validation 

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (response) => {
      try {
        const userInfo = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
          headers: {
            Authorization: `Bearer ${response.access_token}`,
          },
        }).then((res) => res.json());

        const { given_name, family_name, email, picture } = userInfo;
        const userData = {
          name: `${given_name} ${family_name}`,
          email,
          image: picture,
          emailVerified: true,
          accountType: "user",
        };
        mutate({
          url: 'http://localhost:8800/auth/google-signup',
          formData: userData, // User data to be sent
        });

      } catch (error) {
        toast.error("Google login failed");
        console.error(error);
      }
    },
    onFailure: () => {
      toast.error("Google login failed");
    },
  });

  const onSubmit = (values) => {
    const userData = {
      ...values,
      accountType: "user",
    };
    mutate({
      formData: userData,
      url: "http://localhost:8800/auth/login"
    });
  };

  return (
    <div className='flex w-full h-[100vh]'>
      <div className='hidden md:flex flex-col gap-y-4 w-1/3 min-h-screen bg-black items-center justify-center'>
        <Logo type='signin' />
        <span className='text-xl font-semibold text-white'>Welcome, back!</span>
      </div>

      <div className='flex w-full md:w-2/3 h-full bg-white dark:bg-gradient-to-b md:dark:bg-gradient-to-r from-black via-[#071b3e] to-black items-center px-10 md:px-20 lg:px-40'>
        <div className='h-full flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8'>
          <div className='block mb-10 md:hidden'>
            <Logo />
          </div>
          <div className='max-w-md w-full space-y-8'>
            <div>
              <h2 className='mt-6 text-center text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white'>
                Sign in to your account
              </h2>
            </div>

            <Button
              onClick={() => handleGoogleLogin()}
              label='Sign in with Google'
              icon={<FcGoogle className='' />}
              styles='w-full flex flex-row-reverse gap-4 bg-white dark:bg-transparent text-black dark:text-white px-5 py-2.5 rounded-full border border-gray-300'
            />

            <Divider label='or sign in with email' />

            <form className='mt-8 space-y-6' onSubmit={handleSubmit(onSubmit)}>
              <div className='flex flex-col rounded-md shadow-sm -space-y-px gap-5'>
                <Inputbox
                  label='Email Address'
                  name='email'
                  type='email'
                  placeholder='email@example.com'
                  register={register}
                  validationRules={{
                    required: "Email is required",
                    pattern: {
                      value: /^([a-zA-Z0-9_.+-]+)@([a-zA-Z0-9-]+)\.([a-zA-Z]{2,4})$/,
                      message: "Enter a valid email address"
                    }
                  }}
                  error={errors.email}
                />

                <Inputbox
                  label='Password'
                  name='password'
                  type='password'
                  placeholder='Password'
                  register={register}
                  validationRules={{
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 8 characters long"
                    },
                    // pattern: {
                    //   value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/,
                    //   message: "Password must contain letters and numbers"
                    // }
                  }}
                  error={errors.password}
                />
              </div>

              <Button
                isSubmitting={isSubmitting}
                label='Sign In'
                type='submit'
                styles='group relative w-full flex justify-center py-2.5 2xl:py-3 px-4 border border-transparent text-sm font-medium rounded-full text-white bg-black dark:bg-rose-800 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 mt-8'
              />
            </form>

            <div className='flex items-center justify-center text-gray-600 dark:text-gray-300'>
              <p>
                Don't have an account?{" "}
                <Link to='/sign-up' className='text-rose-800 font-medium'>
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      <Toaster richColors />
    </div>
  );
};

export default LoginPage;

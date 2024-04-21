"use client";

import * as React from "react";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import AuthButton from "../components/authButton";
import { SubmitErrorHandler, SubmitHandler, useForm } from "react-hook-form";
import { signIn } from "next-auth/react";
import toast from "react-hot-toast";
import { checkAuthStatus } from "../utils/checkAuthStatus";
import { useSession } from "next-auth/react";
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

export type FormValues = {
  email: string;
  password: string;
};

const schema = yup.object().shape({
  email: yup
    .string()
    .email("Email must be valid")
    .required("Email is required"),
  password: yup
    .string()
    .min(8, "Must be at least 8-digits long")
    .matches(/[A-Z]/, "Must include an Upper Case Character")
    .matches(/[!@#$%^&*(),.?":{}|<>]/, "Must have a Special Character")
    .required("Password is required"),
});

const defaultValues = {
  email: "",
  password: "",
};

interface Props {
  btnText: string;
  selectedRoute: string;
  prompt: string;
}

function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const {
    handleSubmit,
    register,
    formState: { errors, isValid },
   
  } = useForm({
    defaultValues,
    mode: "onBlur",
    resolver: yupResolver(schema),
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsLoading(true);

    signIn("credentials", {
      ...data,
      redirect: false,
    })
      .then((callback) => {
        setIsLoading(false);

        if (callback?.ok) {
          toast.success("Logged in successfully!");

        } else {
          if (callback?.error && JSON.parse(callback?.error)) {
            const errorObj = JSON.parse(callback.error);
           
          }

          toast.error(
            callback?.error
              ? JSON.parse(callback?.error)?.error
              : "Authentication failed"
          );
        }
      })
      .catch((error) => {
        setIsLoading(false);
        console.log("error", error);
        toast.error("Authentication failed");
      });
          
  };

  const onErrors: SubmitErrorHandler<FormValues> = (errors) => {
    console.log("errors", errors);
  };

  const [visible, setVisible] = useState(false);

  const toggleVisibility = () => {
    setVisible(!visible);
  };

  const { status } = useSession();

  checkAuthStatus(status);

  return (
    <div className="flex  justify-center px-0 items-center min-h-screen">
      <div className="my-8 h-full max-h-[800px]">
        <div className="flex w-[400px] md:w-[1000px] shadow-md my-auto justify-center">      
          {/* form slots */}

          <div className="bg-white w-[400px]  md:w-1/2 p-4 rounded-[7.5px]">
          <p className="font-bold text-2xl text-center text-black">Welcome back</p>
          <form
            className="grid grid-cols-2"
            onSubmit={handleSubmit(onSubmit, onErrors)}
          >
            <label htmlFor="">Email address</label>
            <input
              className=" col-span-2"
              {...register("email")}
              placeholder="Email Address"
            />
            <div>
              <span className="text-xs text-red-500">
                {errors.email?.message}
              </span>
            </div>

            <div className="relative col-span-2 pt-4">
              <label htmlFor="password">Password</label>
              <input
                type={visible ? "text" : "password"}
                className="col-span-2 w-full text-black mt-2"
                {...register("password")}
                placeholder="Create password"
              />
              <div>
                <span className="text-xs text-red-500">
                  {errors.password?.message}
                </span>
              </div>
              <button
                className={`absolute right-3 transform top-[${
                  errors.password?.message ? "65%" : "80%"
                }] -translate-y-[80%] focus:outline-none`}
                onClick={toggleVisibility}
                type="button"
              >
              {
                visible ? <RemoveRedEyeIcon sx={{color:"#6936c9"}} /> : <VisibilityOffIcon sx={{color:"#6936c9"}}/>
              }
              </button>
            </div>

            <div className="mt-6 col-span-2 ">
              <AuthButton
                btnText="Log in"
                valid={!isValid}
                loading={isLoading}
                handleClick={() =>{}}
              />
            </div>
          </form>
            </div>
          </div>
        </div>
      </div>

  );
}
export default Login;

"use client";

import * as React from "react";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import AuthButton from "../components/authButton";
import { SubmitErrorHandler, SubmitHandler, useForm } from "react-hook-form";
import { signIn } from "next-auth/react";
import toast from "react-hot-toast";
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import UnAuthenticatedWrapper from "../components/UnAuthWrapper";
import Image from "next/image";

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
    try {
      setIsLoading(true);
      const callback = await signIn("credentials", {
        email: data.email,
        password: data.password,
        type: "login",
        redirect: false,
      })
      setIsLoading(false);
      if (callback?.ok) {
        toast.success("Logged in successfully!");
      } else {
        toast.error(
          callback?.error
            ? JSON.parse(callback?.error)?.message
            : "Authentication failed"
        );
      }
    } catch (error) {
        setIsLoading(false);
        console.log("error", error);
        toast.error("Authentication failed");
    };
  };

  const onErrors: SubmitErrorHandler<FormValues> = (errors) => {
    console.log("errors", errors);
  };

  const [visible, setVisible] = useState(false);

  const toggleVisibility = () => {
    setVisible(!visible);
  };

  return (
    <UnAuthenticatedWrapper>
      <div className="flex  justify-center  items-center min-h-screen bg-gradient-conic-t bg-cover ">
        <div className="my-8 h-full  ">
          <div className="flex w-full md:w-[1000px]  my-auto justify-center items-center">      
            {/* form slots */}

            <div className="bg-white w-[300px]   md:w-1/2 py-12 px-5 md:px-16 rounded-[24px]">
            <p className="font-medium text-2xl md:text-[36px] text-center text-black">Welcome back</p>

            <div className="h-14 rounded-[35px] w-full flex justify-center items-center border border-[#E0DEDE] mt-8">
            <Image
          src="/google-icon.svg"
          alt="podcast image"
          width={23}
          height={23}
          priority
        />
<span className="ml-1 text-[#878787] font-medium text-base">Log in with Google</span>
            </div>
            <form
              className="grid grid-cols-2 mt-8"
              onSubmit={handleSubmit(onSubmit, onErrors)}
            >
              <label htmlFor="">Email*</label>
              <input
                className=" col-span-2 rounded-[35px]"
                {...register("email")}
                placeholder="Email Address"
              />
              <div>
                <span className="text-xs text-red-500">
                  {errors.email?.message}
                </span>
              </div>

              <div className="relative col-span-2 pt-4">
                <label htmlFor="password">Password*</label>
                <input
                  type={visible ? "text" : "password"}
                  className="col-span-2 w-full text-black mt-2 rounded-[35px]"
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
    </UnAuthenticatedWrapper>
  );
}
export default Login;

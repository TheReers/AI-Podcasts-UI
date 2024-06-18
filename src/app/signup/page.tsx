"use client";

import React, { FC, ReactElement } from "react";
import * as yup from "yup";
import { signIn, useSession } from "next-auth/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { SubmitErrorHandler, SubmitHandler, useForm } from "react-hook-form";
import AuthButton from "../components/authButton";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import ErrorIcon from '@mui/icons-material/Error';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import UnAuthenticatedWrapper from "../components/UnAuthWrapper";
import Image from "next/image";

type FormValues = {
  name: string;
  email: string;
  password: string;
};

const schema = yup.object().shape({
  name: yup.string().required("Last name is required"),
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

const passwordCaseConstraint = yup
  .string()
  .matches(/[A-Z]/, "Must include an Upper Case Character");

const passwordCharacterConstraint = yup
  .string()
  .matches(/[!@#$%^&*(),.?":{}|<>]/, "Must have a Special Character");

const defaultValues = {
 name:"",
  email: "",
  password: "",
};

export type VerifyFormValues = {};

const Signup: FC = (): ReactElement => {
  const [visible, setVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const {
    handleSubmit,
    register,
    formState: { errors, isValid },
    watch,
  } = useForm<FormValues>({
    defaultValues,
    mode: "onBlur",
    resolver: yupResolver(schema),
  });

  const password = watch("password");
  const fulfilledPasswordLengthConstraint = password?.length >= 8;

  const fulfilledPasswordCaseConstraint =
    passwordCaseConstraint.isValidSync(password);

  const fulfilledPasswordCharacterConstraint =
    passwordCharacterConstraint.isValidSync(password);

  const onErrors: SubmitErrorHandler<FormValues> = (errors) => {
    console.log("errors", errors);
  };

  const toggleVisibility = () => {
    setVisible(!visible);
  };

  const onSubmit: SubmitHandler<FormValues> = async (body) => {
    try {
      setIsLoading(true)
      const callback = await signIn("credentials", {
        name: body.name,
        email: body.email,
        password: body.password,
        confirm_password: body.password,
        type: "register",
        redirect: false,
      })
      setIsLoading(false)
      if (callback?.ok) {
        toast.success("Sign up successfully!");
      } else {
        toast.error(
          callback?.error
            ? JSON.parse(callback?.error)?.message
            : "Signup failed"
        );
      }
    } catch (error) {
      setIsLoading(false)
      console.log("error", error);
      toast.error("Signup failed");
    }
  }

  return (
    <UnAuthenticatedWrapper>
      <div className="bg-gradient-conic-t bg-cover min-h-screen flex flex-col justify-center  px-12 md:px-0">
        <div className="w-full flex justify-center grow items-center">
      
          <form
            className="shadow-md w-full md:w-[581px] h-fit bg-white  mt-16 px-5  md:px-16 py-12 font-mont mb-5 rounded-[24px]"
            onSubmit={handleSubmit(onSubmit, onErrors)}
          >
            <p className=" text-2xl md:text-[36px] mb-6 text-black text-center mx-auto font-medium">Create account</p>

            <div className="h-14 rounded-[35px] w-full flex justify-center items-center border border-[#E0DEDE] mt-8">
            <Image
          src="/google-icon.svg"
          alt="podcast image"
          width={23}
          height={23}
          priority
        />
<span className="ml-2 text-[#878787] font-medium text-base"> Sign up with Google</span>
            </div>
    
            <div className="grid grid-cols-2  ">
            
                  <label className="text-alt-black" htmlFor="">Full Name *</label>
                  <input
                    className=" h-[44px] col-span-2 rounded-[35px]"
                    {...register("name")}
                    placeholder="Full name"
                  />
                  <div>
                    <span className="text-xs text-red-500">
                      {errors.name?.message}
                    </span>
                  </div>
              
                  <div className="relative col-span-2 pt-4">
              <label className="text-alt-black" htmlFor="">Email address *</label>
              <input
                className=" col-span-2 h-[44px] w-full rounded-[35px] mt-[6px]"
                {...register("email")}
                placeholder="Email Address"
              />
              <div>
                <span className="text-xs text-red-500">
                  {errors.email?.message}
                </span>
              </div>
              </div>
              <div className="relative col-span-2 pt-4">
                <label className="text-alt-black" htmlFor="password">Password *</label>
                <input
                  type={visible ? "text" : "password"}
                  className="col-span-2 h-[44px] w-full  rounded-[35px] mt-[6px]"
                  {...register("password")}
                  placeholder="Create password"
                />
                <button
                  className="absolute right-3 transform top-[80%] -translate-y-[80%] focus:outline-none"
                  onClick={toggleVisibility}
                  type="button"
                >
            { visible ? <RemoveRedEyeIcon sx={{color:"#6936c9"}} /> : <VisibilityOffIcon sx={{color:"#000"}}/>}
                </button>
              </div>
            </div>
            {password && (
              <>
                <div className="flex mt-4">
                <ErrorIcon  sx={{color:"#000",height:15}} />
                  <span className="ml-2 text-xs text-alt-black">Your password</span>
                </div>
                <div className="flex mt-2">
                  <CheckCircleIcon sx={{color:"#000",height:15}} />
                  <span
                    className={`ml-2 ${
                      fulfilledPasswordLengthConstraint
                        ? "text-black"
                        : "text-gray-400"
                    } text-xs`}
                  >
                    Must be at least 8-digits long
                  </span>
                </div>
                <div className="flex mt-2">
                <CheckCircleIcon sx={{color:"#000",height:15}} />
                  <span
                    className={`ml-2 ${
                      fulfilledPasswordCaseConstraint
                        ? "text-black"
                        : "text-gray-400"
                    } text-xs`}
                  >
                    Must include an Upper Case Character
                  </span>
                </div>
                <div className="flex mt-2">
                <CheckCircleIcon sx={{color:"#000",height:15}} />
                  <span
                    className={`ml-2 ${
                      fulfilledPasswordCharacterConstraint
                        ? "text-black"
                        : "text-gray-400"
                    } text-xs`}
                  >
                    Must have a Special Character
                  </span>
                </div>
              </>
            )}
            <div className="mt-6">
              <AuthButton
                data-testid="button"
                btnText="Sign Up"
                valid={!isValid}
                loading={isLoading}
              />

              <div className="mt-6 flex justify-center">
                <span className="text-sm text-gray-600 ">
                  Already have an account ?
                </span>{" "}
                <span
                  className="ml-3 text-sm cursor-pointer text-black"
                  onClick={() => router.push("/login")}
                >
                  Login
                </span>
              </div>
            </div>
          </form>
        </div>
      
      </div>
    </UnAuthenticatedWrapper>
  );
};

export default Signup;

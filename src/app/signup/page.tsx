"use client";

import React, { FC, ReactElement } from "react";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import AuthButton from "../components/authButton";
import { useRouter } from "next/navigation";
import { useMutation } from "react-query";
import { Api, handleApiError } from "../service/axios";
import toast from "react-hot-toast";
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import ErrorIcon from '@mui/icons-material/Error';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

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
  const router = useRouter();

  const {
    handleSubmit,
    register,
    getValues,
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

  const onErrors = (errors: any) => {};

  const toggleVisibility = () => {
    setVisible(!visible);
  };

  async function registerUser(body: FormValues) {
    try {
      const payload = {
        name: body.name,
        email: body.email,
        password: body.password,
        confirm_password: body.password
      };
      const { data } = await Api.post("/api/register", payload);
      return data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  const { isLoading, isError, error, mutate } = useMutation(registerUser, {
    onSuccess() {
    router.push("/login");
    },
    onError(error) {
      toast.error((error as any).message);

      console.log(error as any);
    
    },
  });

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    mutate(data);
  };

  return (
    <div className="bg-bg-secondary min-h-screen flex flex-col">
      <div className="w-full flex justify-center grow">
        <form
          className="shadow-md w-[448px] h-fit bg-white  mt-16  p-6 font-mont mb-5 rounded-[7.5px]"
          onSubmit={handleSubmit(onSubmit, onErrors)}
        >
          <p className="font-bold text-2xl mb-6 text-black">Create new account</p>
  
          <div className="grid grid-cols-2 border-b-[3px] border-b-[#040404] ">
           
                <label htmlFor="">Full Name</label>
                <input
                  className=" mt-2 col-span-2"
                  {...register("name")}
                  placeholder="Full name"
                />
                <div>
                  <span className="text-xs text-red-500">
                    {errors.name?.message}
                  </span>
                </div>
             
                <div className="relative col-span-2 pt-4">
            <label htmlFor="">Email address</label>
            <input
              className=" col-span-2 w-full"
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
              <label htmlFor="password">Password</label>
              <input
                type={visible ? "text" : "password"}
                className="col-span-2 w-full mt-2"
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
                <span className="ml-2 text-xs text-black">Your password</span>
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
              btnText="Get started"
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
  );
};

export default Signup;

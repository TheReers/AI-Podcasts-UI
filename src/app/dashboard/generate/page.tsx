"use client";
import React from "react";
import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import DirectionsIcon from "@mui/icons-material/Directions";
import {
  Controller,
  SubmitErrorHandler,
  SubmitHandler,
  useForm,
} from "react-hook-form";
import { useMutation } from "react-query";
import toast from "react-hot-toast";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { generatePodcast } from "@/app/utils/api";
import PodCard from "../components/PodCard";
import { Box, CircularProgress } from "@mui/material";
import AuthWrapper from "../components/AuthWrapper";

export type FormValues = {
  message: string;
};

const schema = yup.object().shape({
  message: yup.string().required("Message is required"),
});

const GeneratePodcast = () => {
  const [currentIndex, setCurrentIndex] = React.useState<number | null>(null);

  const {
    handleSubmit,
    control,
    formState: { errors, isValid },
  } = useForm<FormValues>({
    defaultValues: {
      message: "",
    },
    mode: "onBlur",
    resolver: yupResolver(schema),
  });

  const { isLoading, mutate, data } = useMutation(generatePodcast, {
    onSuccess(data) {
      toast.success(data.message);
    },
    onError(error) {
      toast.error((error as any).message);

      console.log(error as any);
    },
  });

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    mutate(data);
  };

  const onErrors: SubmitErrorHandler<FormValues> = (errors) => {
    console.log(errors);
  };

  const playPodcast = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <AuthWrapper>
      <div className="min-h-screen p-16">
        <h2 className="text-white text-2xl">Create a podcast</h2>
        <div className="mt-4">
          <Paper
            component="form"
            sx={{
              p: "2px 4px",
              display: "flex",
              alignItems: "center",
              width: 400,
            }}
            onSubmit={handleSubmit(onSubmit, onErrors)}
          >
            <Controller
              name="message"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <InputBase
                  {...field}
                  sx={{ ml: 1, flex: 1 }}
                  placeholder="podcast idea e.g 'How to make a podcast'"
                  inputProps={{ "aria-label": "search google maps" }}
                  error={!isValid}
                />
              )}
            />
            <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
            <IconButton
              color="primary"
              sx={{ p: "10px" }}
              aria-label="directions"
              type="submit"
            >
              <DirectionsIcon />
            </IconButton>
          </Paper>
          <span className="text-red-500 text-xs">{errors.message?.message}</span>
        </div>
        {isLoading ? (
          <Box sx={{ display: "flex", justify: "center" }}>
            <CircularProgress />
          </Box>
        ) : data?.data ? (
          <div className="mt-4">
            <PodCard
              podcasts={[data.data]}
              playPodcast={playPodcast}
              currentIndex={currentIndex}
            />
          </div>
        ) : (
          <></>
        )}
      </div>
    </AuthWrapper>
  );
};

export default GeneratePodcast;

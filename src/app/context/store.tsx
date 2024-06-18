"use client";

import {
  createContext,
  useContext,
  Dispatch,
  SetStateAction,
  useState,
} from "react";

interface ContextProps {
  mobileOpen: boolean;
  setMobileOpen: Dispatch<SetStateAction<boolean>>;
  videoUrl: string;
  setVideoUrl: Dispatch<SetStateAction<string>>;
}

const GlobalContext = createContext<ContextProps>({
  mobileOpen: false,
  setMobileOpen: () => {},
  videoUrl: "",
  setVideoUrl: () => {},
});

// @ts-ignore
export const GlobalContextProvider = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");

  return (
    <GlobalContext.Provider
      value={{ mobileOpen, setMobileOpen, videoUrl, setVideoUrl }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => useContext(GlobalContext);

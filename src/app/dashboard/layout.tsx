"use client";

import React, { useEffect } from "react";
import Box from "@mui/material/Box";
import DashboardDrawer from "./components/sidebar";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useGlobalContext } from "../context/store";


interface Props {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<Props> = ({ children }) => {
  const { data: session } = useSession();
  const { mobileOpen, setMobileOpen } = useGlobalContext();

  return (
    
      <Box sx={{ display: "flex" }}>
        <DashboardDrawer
          
         
          setMobileOpen={setMobileOpen}
          mobileOpen={mobileOpen}
        
        />
        <div className="bg-[#fbfbfb] w-full px-0 sm:px-4 min-h-[100vh]">
          {children}
        </div>
      </Box>
  
  );
};

export default DashboardLayout;

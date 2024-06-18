import * as React from "react";
import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import PodcastsIcon from "@mui/icons-material/Podcasts";

export default function CustomizedInputBase(
  { onChange }: { onChange: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> }
) {
  return (
    <Paper
      component="form"
      sx={{ p: "2px 4px", display: "flex", alignItems: "center", borderRadius: 40, boxShadow:0, border: "1px solid rgba(224, 162, 219, 0.13)"}}
    className="w-[196px] md:w-[400px]"
    >
      

<IconButton type="button" sx={{ p: "10px" }} aria-label="search">
        <SearchIcon />
      </IconButton>
  
      <InputBase
        sx={{ ml: 1, flex: 1 }}
        placeholder="Search"
        inputProps={{ "aria-label": "search google maps" }}
        onChange={onChange}
      />
     
      
    </Paper>
  );
}

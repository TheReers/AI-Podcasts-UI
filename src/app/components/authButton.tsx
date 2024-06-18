import * as React from "react";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";

interface Props {
  btnText: string;
  handleClick?: (e: any) => void;
  valid: boolean;
  loading: boolean;
}

export default function AuthButton({
  btnText,
  handleClick,
  valid,
  loading,
}: Props) {
  return (
    <Stack spacing={1} direction="row">
      <Button
        style={{ width: "100%", background: "linear-gradient(289.33deg, #D391E1 5.5%, #FFD9BB 89.93%)", height: 60, borderRadius: 40}}
        variant="contained"
        type="submit"
        onClick={handleClick}
        disabled={valid || loading}
        sx={{
          "&.Mui-disabled": {
            background: "#eaeaea",
            color: "#c0c0c0",
            opacity: 0.5,
          },
        }}
      >
        {loading ? (
          <CircularProgress size={24} sx={{ color: "#fff" }} />
        ) : (
          <span className="capitalize text-white" style={{  fontWeight: 800 }}>
            {btnText}
          </span>
        )}
      </Button>
    </Stack>
  );
}

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
        style={{ width: "100%", background: "#6936c9", height: 48 }}
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
          <span className="capitalize" style={{  fontWeight: 800 }}>
            {btnText}
          </span>
        )}
      </Button>
    </Stack>
  );
}

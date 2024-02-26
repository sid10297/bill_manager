import { Box } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";

export function Loader() {
  return (
    <Box
      sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
    >
      <CircularProgress />
    </Box>
  );
}

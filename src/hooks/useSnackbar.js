import { useState } from "react";

function useSnackbar() {
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
  };

  return { openSnackbar, setOpenSnackbar, handleSnackbarClose };
}

export default useSnackbar;

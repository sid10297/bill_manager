import { useState } from "react";

function useSnackbar() {
  const [isSnackbarVisible, showSnackbar] = useState(false);

  const closeSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    showSnackbar(false);
  };

  return { isSnackbarVisible, showSnackbar, closeSnackbar };
}

export default useSnackbar;

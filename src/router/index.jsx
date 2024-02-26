import { Route, Routes } from "react-router-dom";

import Auth from "../auth";
import Customers from "../pages/Customers";
import Login from "../pages/Login";
import NotFound from "../pages/NotFound";
import Bills from "../pages/Bills";

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route
        path="/"
        element={
          <Auth>
            <Customers />
          </Auth>
        }
      />

      <Route
        path="/customers"
        element={
          <Auth>
            <Customers />
          </Auth>
        }
      />

      <Route
        path="/bills"
        element={
          <Auth>
            <Bills />
          </Auth>
        }
      />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRouter;

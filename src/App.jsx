import AppRouter from "./router/index.jsx";
import Nav from "./components/Nav.jsx";
import { useLocation } from "react-router-dom";
import { Container } from "@mui/material";

const App = () => {
  const location = useLocation();
  return (
    <div>
      {location.pathname !== "/login" && <Nav />}
      <Container maxWidth="xl">
        <AppRouter />
      </Container>
    </div>
  );
};

export default App;

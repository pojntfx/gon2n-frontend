import * as React from "react";
import ReactDOM from "react-dom";
import App from "./components/App";
import { ThemeProvider } from "theme-ui";
import { Box } from "rebass";
import preset from "@rebass/preset";

ReactDOM.render(
  <ThemeProvider theme={preset}>
    <Box
      sx={{
        maxWidth: 768,
        mx: "auto",
        px: 3
      }}
    >
      <App endpoint="http://localhost:8080" />
    </Box>
  </ThemeProvider>,
  document.getElementById("root")
);

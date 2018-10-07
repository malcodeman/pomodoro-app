import React, { Component } from "react";
import { ThemeProvider } from "styled-components";

import defaultTheme from "./style/themes/default";
import Home from "./containers/Home";

class App extends Component {
  render() {
    return (
      <ThemeProvider theme={defaultTheme}>
        <Home />
      </ThemeProvider>
    );
  }
}

export default App;

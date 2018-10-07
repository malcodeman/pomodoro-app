import React, { Component } from "react";
import styled from "styled-components";

const Text = styled.span`
  color: ${props => props.theme.brand};
`;

class Home extends Component {
  render() {
    return (
      <div>
        <Text>Pomodoro</Text>
      </div>
    );
  }
}

export default Home;

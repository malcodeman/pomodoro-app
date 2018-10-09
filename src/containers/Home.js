// @flow
import React, { Component } from "react";
import styled from "styled-components";
import {
  format,
  subSeconds,
  setMinutes,
  getMinutes,
  getSeconds
} from "date-fns";

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
`;

const Main = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Text = styled.h1`
  color: ${props => props.theme.black};
  font-size: 1rem;
  margin: 2rem 0;
  font-weight: normal;
`;

const CTA = styled.button`
  color: ${props => props.theme.white};
  border: 0;
  padding: 1rem;
  background-color: ${props => props.theme.brand};
  cursor: pointer;
`;

type Props = {};

type State = {
  time: Date,
  invervalId: number
};

class Home extends Component<Props, State> {
  state = {
    time: setMinutes(0, 25),
    invervalId: 0
  };
  startCountdown = () => {
    const invervalId = window.setInterval(this.countdown, 1000);
    this.setState({ invervalId });
  };
  countdown = () => {
    const { time } = this.state;
    if (getMinutes(time) === 0 && getSeconds(time) === 0) {
      this.stopCountdown();
      return;
    }
    this.setState({ time: subSeconds(time, 1) });
  };
  stopCountdown = () => {
    window.clearInterval(this.state.invervalId);
    this.setState({ invervalId: 0, time: setMinutes(0, 25) });
  };
  pauseCountdown = () => {
    window.clearInterval(this.state.invervalId);
    this.setState({ invervalId: 0 });
  };
  render() {
    const { time } = this.state;
    return (
      <Container>
        <Main>
          <Text>{format(time, "mm:ss")}</Text>
          {this.state.invervalId ? (
            <CTA onClick={this.stopCountdown}>Stop</CTA>
          ) : (
            <CTA onClick={this.startCountdown}>Start</CTA>
          )}
        </Main>
      </Container>
    );
  }
}

export default Home;

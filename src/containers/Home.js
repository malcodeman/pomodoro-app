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
import { ThemeProvider } from "styled-components";

// Themes
import defaultTheme from "../style/themes/default";
import runningTheme from "../style/themes/running";

const Sessions = styled.span`
  position: fixed;
  left: 0;
  top: 0;
  padding: 10px 16px;
  color: ${props => props.theme.primary};
`;

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: ${props => props.theme.background};
  transition: background-color 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
`;

const Main = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 256px;
`;

const CTAButton = styled.button`
  color: #fff;
  border: 0;
  padding: 10px 16px;
  background-color: ${props => props.theme.brand};
  cursor: pointer;
`;

const GhostButton = styled.button`
  color: #fff;
  border: 0;
  padding: 10px 16px;
  background-color: transparent;
  cursor: pointer;
`;

const Time = styled.h1`
  color: ${props => props.theme.primary};
  font-size: 1rem;
  font-weight: 500;
  margin: 16px 0;
  text-align: center;
`;

type Props = {};

type State = {
  session: boolean,
  cancel: boolean,
  sessionBreak: boolean,
  sessionCounter: number,
  sessionLength: number,
  shortBreakLength: number,
  longBreakLength: number,
  time: Date,
  invervalID: number
};

class Home extends Component<Props, State> {
  state = {
    session: true,
    cancel: false,
    sessionBreak: false,
    sessionCounter: 0,
    sessionLength: 25,
    shortBreakLength: 5,
    longBreakLength: 20,
    time: setMinutes(0, 25),
    invervalID: 0
  };
  startCountdown = () => {
    const invervalID = window.setInterval(this.countdown, 1000);
    this.setState({ invervalID });
  };
  countdown = () => {
    const { time } = this.state;

    if (getMinutes(time) === 0 && getSeconds(time) === 0) {
      this.stopCountdown();
      return;
    }
    this.setState({ time: subSeconds(time, 1) });
  };
  cancelSession = async () => {
    await this.setState({ cancel: true });
    this.stopCountdown();
  };
  stopCountdown = () => {
    const {
      session,
      cancel,
      invervalID,
      sessionLength,
      sessionCounter,
      shortBreakLength,
      longBreakLength
    } = this.state;

    this.setState({ cancel: false });

    if (session && !cancel) {
      this.setState({ sessionCounter: sessionCounter + 1 });
    }

    if (session && sessionCounter < 3 && !cancel) {
      this.setState({
        session: false,
        sessionBreak: true,
        time: setMinutes(0, shortBreakLength)
      });
    } else if (session && sessionCounter === 3 && !cancel) {
      this.setState({
        session: false,
        sessionBreak: true,
        sessionCounter: 0,
        time: setMinutes(0, longBreakLength)
      });
    } else {
      this.setState({
        session: true,
        sessionBreak: false,
        time: setMinutes(0, sessionLength)
      });
    }
    window.clearInterval(invervalID);
    this.setState({ invervalID: 0 });
  };
  pauseCountdown = () => {
    const { invervalID } = this.state;

    window.clearInterval(invervalID);
    this.setState({ invervalID: 0 });
  };
  getTheme = () => {
    const { invervalID } = this.state;

    if (invervalID) {
      return runningTheme;
    }
    return defaultTheme;
  };
  render() {
    const { time, invervalID, sessionCounter } = this.state;
    return (
      <ThemeProvider theme={this.getTheme()}>
        <Container>
          <Sessions>Sessions: {sessionCounter}</Sessions>
          <Main>
            <Time>{format(time, "mm:ss")}</Time>
            {invervalID ? (
              <GhostButton onClick={this.cancelSession}>cancel</GhostButton>
            ) : (
              <CTAButton onClick={this.startCountdown}>Start</CTAButton>
            )}
          </Main>
        </Container>
      </ThemeProvider>
    );
  }
}

export default Home;

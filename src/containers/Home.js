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

// Images
import atronaut from "./style/astronaut-helmet.svg";

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

const Image = styled.img`
  height: 64px;
  width: 64px;
`;

const TextWrapper = styled.div`
  margin: 16px 0;
`;

const Heading = styled.h1`
  color: ${props => props.theme.primary};
  font-size: 1rem;
  font-weight: normal;
  margin: 0;
  line-height: 1.4;
`;

const Paragraph = styled.p`
  color: ${props => props.theme.secondary};
  font-size: 1rem;
  margin: 0;
  line-height: 1.4;
`;

const HorizontalLine = styled.div`
  height: 1px;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.2);
  margin-bottom: 16px;
`;

const CTA = styled.button`
  color: #fff;
  border: 0;
  padding: 10px 16px;
  background-color: ${props => props.theme.brand};
  cursor: pointer;
  height: 40px;
`;

const Time = styled.h1`
  color: ${props => props.theme.primary};
  font-size: 1rem;
  font-weight: 500;
  margin: 0;
  text-align: center;
`;

type Props = {};

type State = {
  running: boolean,
  time: Date,
  invervalId: number
};

class Home extends Component<Props, State> {
  state = {
    running: false,
    time: setMinutes(0, 25),
    invervalId: 0
  };
  startCountdown = () => {
    const invervalId = window.setInterval(this.countdown, 1000);
    this.setState({ invervalId, running: true });
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
    this.setState({ invervalId: 0, time: setMinutes(0, 25), running: false });
  };
  pauseCountdown = () => {
    window.clearInterval(this.state.invervalId);
    this.setState({ invervalId: 0, running: false });
  };
  getTheme = () => {
    const { running } = this.state;
    if (running) {
      return runningTheme;
    }
    return defaultTheme;
  };
  render() {
    const { time, running } = this.state;
    return (
      <ThemeProvider theme={this.getTheme()}>
        <Container running={running}>
          <Main>
            <Image src={atronaut} />
            {running ? (
              <TextWrapper>
                <Heading>Get to work!</Heading>
                <Paragraph>
                  When the timer hits 0 you will be notified.
                </Paragraph>
                <Time>{format(time, "mm:ss")}</Time>
              </TextWrapper>
            ) : (
              <TextWrapper>
                <Heading>Hi there, am atronaut!</Heading>
                <Paragraph>
                  I’ll make sure you are super productive today.
                </Paragraph>
              </TextWrapper>
            )}
            {running ? null : <HorizontalLine />}
            {running ? (
              <CTA onClick={this.stopCountdown}>Stop</CTA>
            ) : (
              <CTA onClick={this.startCountdown}>Start</CTA>
            )}
          </Main>
        </Container>
      </ThemeProvider>
    );
  }
}

export default Home;

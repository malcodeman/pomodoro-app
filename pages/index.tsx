import React from "react";
import {
  Center,
  Button,
  Text,
  Group,
  useMantineColorScheme,
  Box,
} from "@mantine/core";
import { useInterval, useLocalStorageValue } from "@mantine/hooks";
import {
  format,
  getMinutes,
  getSeconds,
  setMinutes,
  subSeconds,
  secondsToMilliseconds,
  minutesToSeconds,
} from "date-fns";
import { and, equals, inc, toString, or, sum } from "ramda";
import Head from "next/head";
import useSound from "use-sound";
import type { NextPage } from "next";

const SESSIONS = {
  DEFAULT: 25,
  SHORT_BREAK: 5,
  LONG_BREAK: 20,
};

const Home: NextPage = () => {
  const [devTools] = useLocalStorageValue({
    key: "dev-tools",
    defaultValue: toString(false),
  });
  const [sessionCounter, setSessionCounter] = React.useState(0);
  const [defaultSessionCounter, setDefaultSessionCounter] = React.useState(0);
  const [time, setTime] = React.useState(setMinutes(0, SESSIONS.DEFAULT));
  const interval = useInterval(() => {
    setTime((current) => subSeconds(current, 1));
  }, secondsToMilliseconds(1));
  const [play] = useSound("./notification.wav");
  const { toggleColorScheme } = useMantineColorScheme();

  function getNextTime(counter: number) {
    if (equals(counter, 4)) {
      return SESSIONS.LONG_BREAK;
    } else if (equals(counter % 2, 0)) {
      return SESSIONS.SHORT_BREAK;
    }
    return SESSIONS.DEFAULT;
  }

  React.useEffect(() => {
    const minutes = getMinutes(time);
    const seconds = getSeconds(time);
    if (and(equals(minutes, 0), equals(seconds, 0))) {
      const nextTime = getNextTime(sessionCounter);
      if (
        or(
          equals(nextTime, SESSIONS.SHORT_BREAK),
          equals(nextTime, SESSIONS.LONG_BREAK)
        )
      ) {
        setDefaultSessionCounter((current) => inc(current));
      }
      interval.stop();
      play();
      setTime(setMinutes(0, nextTime));
      setSessionCounter((current) => (equals(current, 4) ? -1 : inc(current)));
    }
  }, [time, interval, sessionCounter, play]);

  React.useEffect(() => {
    if (interval.active) {
      toggleColorScheme("dark");
    } else {
      toggleColorScheme("light");
    }
  }, [interval.active, toggleColorScheme]);

  function zeroOut() {
    interval.stop();
    setTime(setMinutes(0, 0));
  }

  function getPercentage(partial: number, total: number) {
    return ((100 * partial) / total).toFixed(2);
  }

  function getCurrentSession(counter: number) {
    if (equals(counter, -1)) {
      return SESSIONS.LONG_BREAK;
    }
    return getNextTime(counter - 1);
  }

  function calculateProgress(time: Date) {
    const total = minutesToSeconds(getCurrentSession(sessionCounter));
    const current = sum([getSeconds(time), minutesToSeconds(getMinutes(time))]);
    return getPercentage(total - current, total);
  }

  return (
    <div>
      <Head>
        <title>Pomodoro</title>
      </Head>
      <main>
        {interval.active ? (
          <Box
            sx={{
              position: "fixed",
              left: 0,
              top: 0,
              height: 2,
              backgroundColor: "#a9e34b",
              width: `${calculateProgress(time)}%`,
              transition: "width 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)",
            }}
          />
        ) : null}
        <Text sx={{ position: "fixed", left: 0, top: 0, margin: "16px" }}>
          Sessions: {defaultSessionCounter}
        </Text>
        {JSON.parse(devTools) ? (
          <Button
            sx={{ position: "fixed", top: 0, right: 0, margin: "16px" }}
            variant={"default"}
            disabled={!interval.active}
            onClick={zeroOut}
          >
            Zero out
          </Button>
        ) : null}
        <Center sx={{ minHeight: "100vh" }}>
          <Group direction={"column"} align={"center"}>
            <Text size={"lg"} mb={"md"}>
              {format(time, "mm:ss")}
            </Text>
            {interval.active ? (
              <Button
                color={"lime"}
                variant={"outline"}
                onClick={() => interval.stop()}
              >
                Pause
              </Button>
            ) : (
              <Button color={"lime"} onClick={() => interval.start()}>
                Start
              </Button>
            )}
          </Group>
        </Center>
      </main>
    </div>
  );
};

export default Home;

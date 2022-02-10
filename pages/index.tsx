import React from "react";
import {
  Center,
  Button,
  Text,
  Group,
  useMantineColorScheme,
} from "@mantine/core";
import { useInterval, useLocalStorageValue } from "@mantine/hooks";
import {
  format,
  getMinutes,
  getSeconds,
  setMinutes,
  subSeconds,
  secondsToMilliseconds,
} from "date-fns";
import { and, equals, inc, toString, or } from "ramda";
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
      return setMinutes(0, SESSIONS.LONG_BREAK);
    } else if (equals(counter % 2, 0)) {
      return setMinutes(0, SESSIONS.SHORT_BREAK);
    }
    return setMinutes(0, SESSIONS.DEFAULT);
  }

  React.useEffect(() => {
    const minutes = getMinutes(time);
    const seconds = getSeconds(time);
    if (and(equals(minutes, 0), equals(seconds, 0))) {
      const nextTime = getNextTime(sessionCounter);
      if (
        or(
          equals(getMinutes(nextTime), SESSIONS.SHORT_BREAK),
          equals(getMinutes(nextTime), SESSIONS.LONG_BREAK)
        )
      ) {
        setDefaultSessionCounter((current) => inc(current));
      }
      interval.stop();
      play();
      setTime(nextTime);
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

  return (
    <div>
      <Head>
        <title>Pomodoro</title>
      </Head>
      <main>
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

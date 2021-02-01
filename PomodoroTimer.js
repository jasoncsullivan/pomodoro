import React, { useState, useRef, useEffect } from "react";
import { StyleSheet, Text, View, Button } from "react-native";

import { vibrate } from "./utils";

export default function PomodoroTimer() {
  const [timeLeft, setTimeLeft] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isWorkMode, setIsWorkMode] = useState(true);

  const intervalRef = useRef();

  const decrementTimer = () =>
    setTimeLeft((prevState) => {
      if (prevState - 1 == 0) {
        vibrate();
        clearInterval(intervalRef.current);
        intervalRef.current = null;
        setIsWorkMode((prevState) => !prevState);
      }
      return prevState - 1;
    });

  useEffect(() => {
    setTimeLeft(60 * (isWorkMode ? 0.1 : 5));

    intervalRef.current = setInterval(() => {
      decrementTimer();
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, [isRunning, isWorkMode]);

  const onStartTimer = () => {
    console.log("starting timer", isWorkMode);
    setIsRunning(true);
  };

  const onStopTimer = () => {
    setIsRunning(false);
    setTimeLeft(null);
    clearInterval(intervalRef.current);
    intervalRef.current = null;
    setIsWorkMode(true);
  };

  const formatTimeLeft = (tl) => {
    return `${Math.floor(tl / 60)}:${tl % 60}`;
  };

  return (
    <View>
      {isWorkMode ? (
        <Text style={styles.timerInWorkMode}>
          Work!
          {isRunning ? formatTimeLeft(timeLeft) || "-" : "-"}
        </Text>
      ) : (
        <Text style={styles.timerNotInWorkMode}>
          Break!
          {formatTimeLeft(timeLeft)}
        </Text>
      )}

      {!isRunning && (
        <Button
          style={styles.startButton}
          title="Start"
          onPress={() => onStartTimer(true)}
        />
      )}

      {isRunning && (
        <Button style={styles.resetButton} title="Stop" onPress={onStopTimer} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  timerInWorkMode: {
    color: "green",
    fontSize: 30,
    textAlign: "center",
  },
  timerNotInWorkMode: {
    color: "red",
    fontSize: 30,
    textAlign: "center",
  },
  startButton: {
    color: "green",
    fontSize: 20,
  },
  resetButton: {
    color: "red",
    fontSize: 20,
  },
});

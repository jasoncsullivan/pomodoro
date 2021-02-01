import React, { useState, useRef } from "react";
import { StyleSheet, Text, View, Button } from "react-native";

import { vibrate } from "./utils";

export default function PomodoroTimer() {
  const [timeLeft, setTimeLeft] = useState(null);
  const [isRunning, setIsRunning] = useState(false);

  const intervalRef = useRef();

  const decrementTimer = (isWorkMode) =>
    setTimeLeft((prevState) => {
      if (prevState - 1 == 0) {
        vibrate();
        clearInterval(intervalRef.current);
        intervalRef.current = null;
        onStartTimer(!isWorkMode);
      }
      return prevState - 1;
    });

  const onStartTimer = (isWorkMode) => {
    setIsRunning(true);
    setTimeLeft(60 * (isWorkMode ? 0.1 : 5));

    intervalRef.current = setInterval(() => {
      decrementTimer(isWorkMode);
    }, 1000);
  };

  const onStopTimer = () => {
    setIsRunning(false);
    setTimeLeft(null);
    clearInterval(intervalRef.current);
    intervalRef.current = null;
  };

  const formatTimeLeft = (tl) => {
    return `${Math.floor(tl / 60)}:${tl % 60}`;
  };

  return (
    <View>
      <Text style={styles.timerInWorkMode}>
        {isRunning ? formatTimeLeft(timeLeft) || "-" : "-"}
      </Text>

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
  startButton: {
    color: "green",
    fontSize: 20,
  },
  resetButton: {
    color: "red",
    fontSize: 20,
  },
});

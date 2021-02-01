import React, { useState, useRef, useEffect } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";

import { vibrate } from "./utils";

const WORK_TIME = 25;
const BREAK_TIME = 5;

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
    if (isRunning) {
      setTimeLeft(60 * (isWorkMode ? WORK_TIME : BREAK_TIME));

      intervalRef.current = setInterval(() => {
        decrementTimer();
      }, 1000);

      return () => clearInterval(intervalRef.current);
    }
  }, [isRunning, isWorkMode]);

  const onStartTimer = () => {
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
          {isRunning ? "Work! \n\n" + formatTimeLeft(timeLeft) || "-" : ""}
        </Text>
      ) : (
        <Text style={styles.timerNotInWorkMode}>
          Break! {"\n"} {"\n"}
          {formatTimeLeft(timeLeft)}
        </Text>
      )}

      {!isRunning && (
        <TouchableOpacity
          activeOpacity={0.8}
          style={{ ...styles.startButton, ...styles.button }}
          onPress={() => onStartTimer(true)}
        >
          <Text style={styles.buttonText}>Start Work</Text>
        </TouchableOpacity>
      )}

      {isRunning && (
        <TouchableOpacity
          activeOpacity={0.8}
          style={{ ...styles.resetButton, ...styles.button }}
          onPress={onStopTimer}
        >
          <Text style={styles.buttonText}>Stop Timer</Text>
        </TouchableOpacity>
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
  button: {
    justifyContent: "center",
    alignContent: "center",
    borderWidth: 1,
    borderRadius: 20,
    height: 50,
    width: 120,
    marginTop: 30,
  },
  buttonText: {
    textAlign: "center",
    color: "blue",
    fontSize: 20,
  },
  startButton: {
    color: "green",
  },
  resetButton: {
    color: "red",
  },
});

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Svg, { Circle, G } from "react-native-svg";

const ProgressBar = ({ percentage, sx }) => {
  const size = sx === "large" ? 100 : 70;
  const emptyStrokeWidth = sx === "large" ? 4 : 2;
  const filledStrokWidth = sx === "large" ? 10 : 6;
  const radius = (size - filledStrokWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const halfCircle = size / 2;

  const strokeDashoffset = circumference - (circumference * percentage) / 100;

  return (
    <View
      style={[
        styles.container,
        {
          borderRadius: sx === "large" ? 40 : 30,
          paddingHorizontal: sx === "large" ? 16 : 6,
          paddingVertical: sx === "large" ? 20 : 11,
        },
      ]}
    >
      <Svg
        height={size}
        width={size}
        viewBox={`0 0 ${size} ${size}`}
        style={styles.svg}
      >
        <G rotation="-90" origin={`${halfCircle}, ${halfCircle}`}>
          <Circle
            cx="50%"
            cy="50%"
            r={radius}
            stroke="#5ce1e6"
            strokeWidth={emptyStrokeWidth}
            fill="none"
          />
          <Circle
            cx="50%"
            cy="50%"
            r={radius}
            stroke="orange"
            strokeWidth={filledStrokWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            fill="none"
          />
        </G>
      </Svg>
      <Text style={styles.percentageText}>{`${percentage}%`}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f6941d",
  },
  svg: {
    position: "absolute",
  },
  percentageText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
});

export default ProgressBar;

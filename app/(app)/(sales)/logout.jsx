import { StyleSheet, Text, View } from "react-native";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { logoutUser } from "../../src/redux/features/userSlice";
import { Button } from "react-native-paper";

const logout = () => {
  const dispatch = useDispatch();

  return <Button onPress={() => dispatch(logoutUser())}>Log out </Button>;
};

export default logout;

const styles = StyleSheet.create({});

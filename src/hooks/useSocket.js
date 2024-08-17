import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

const SOCKET_URL = "https://leaptechsolutions.com";

const useSocket = () => {
  const socketRef = useRef(null);

  useEffect(() => {
    // Initialize the socket connection
    socketRef.current = io(SOCKET_URL, {
      transports: ["websocket"],
      autoConnect: true,
    });

    // Handle socket connection
    socketRef.current.on("connect", () => {
      console.log("Connected to socket server", socketRef.current.id);
    });

    // Handle socket disconnection
    socketRef.current.on("disconnect", () => {
      console.log("Disconnected from socket server");
    });

    // Cleanup on component unmount
    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  // Function to send an event
  const sendEvent = (eventName, data) => {
    if (socketRef.current && socketRef.current.connected) {
      socketRef.current.emit(eventName, data);
    }
  };

  // Function to listen to an event
  const onEvent = (eventName, callback) => {
    if (socketRef.current && socketRef.current.connected) {
      socketRef.current.on(eventName, callback);
    }
  };

  return { socket: socketRef.current, sendEvent, onEvent };
};

export default useSocket;

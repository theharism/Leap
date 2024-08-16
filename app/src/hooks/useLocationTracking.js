import { useEffect } from "react";
import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";
import { useDispatch, useSelector } from "react-redux";
import { Alert } from "react-native";
import { setCurrentCoordinates } from "../redux/features/locationSlice";
import useSocket from "./useSocket";
const LOCATION_TASK_NAME = "location-task";

TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }) => {
  if (error) {
    console.error("Background location error:", error);
    return;
  }

  if (data) {
    const { locations } = data;
    const { latitude, longitude } = locations[0].coords;
    // Dispatch location updates to your Redux store
    store.dispatch(setCurrentCoordinates({ latitude, longitude }));
  }
});

const useLocationTracking = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.User);
  const { sendEvent } = useSocket();

  useEffect(() => {
    const startLocationUpdates = async () => {
      try {
        const { status } = await Location.requestBackgroundPermissionsAsync();
        const { status: status1 } =
          await Location.requestForegroundPermissionsAsync();
        if (status !== "granted" || status1 !== "granted") {
          console.log("Permission to access location was denied");
          Alert.alert("Error", "Permission to access location was denied");
          return;
        }

        // await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
        //   accuracy: Location.Accuracy.BestForNavigation,
        //   timeInterval: 20000,
        // });

        // Optional: Start a foreground location update
        const subscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.BestForNavigation,
            timeInterval: 20000,
          },
          (location) => {
            const { latitude, longitude } = location.coords;

            if (user?.role === "agent") {
              sendEvent("agentLocation", {
                latitude,
                longitude,
                agentId: user?._id,
                agentName: user?.fullName,
              });
            }
            dispatch(setCurrentCoordinates({ latitude, longitude }));
          }
        );

        return () => {
          subscription?.remove();
        };
      } catch (error) {
        console.error("Error starting location updates:", error);
      }
    };

    startLocationUpdates();
  }, [dispatch]);
};

export default useLocationTracking;

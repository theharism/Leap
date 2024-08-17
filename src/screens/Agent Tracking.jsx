import {
  Alert,
  FlatList,
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import React, { useEffect, useRef, useState } from "react";
import { theme } from "../constants/theme";
import { useDispatch, useSelector } from "react-redux";
import {
  EvilIcons,
  MaterialCommunityIcons,
  Entypo,
  MaterialIcons,
} from "@expo/vector-icons";
import Loader from "../components/Loader";
import MapView, {
  PROVIDER_GOOGLE,
  Marker,
  Circle,
  Polyline,
} from "react-native-maps";
import useSocket from "../hooks/useSocket";

const AgentTracking = () => {
  const token = useSelector((state) => state.User?.token);
  const { onEvent } = useSocket();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const mapViewRef = useRef(null);
  const [region, setRegion] = useState(null);
  const currentCoordinates = useSelector((state) => state.Location);

  const data = [
    {
      id: "1",
      name: "Patrick Callahan",
      location: "San Jose, CA",
      distance: "9 mi",
    },
    {
      id: "2",
      name: "Meg Callahan",
      location: "Crittenden Middle School",
      distance: "7 mi",
    },
    {
      id: "3",
      name: "Scott Lopatin",
      location: "Campbell, CA",
      distance: "6 mi",
    },
    {
      id: "4",
      name: "Biki Berry",
      location: "Stanford Shopping Center",
      distance: "11 mi",
    },
    {
      id: "5",
      name: "Me",
      location: "Work",
      distance: "",
    },
  ];

  onEvent("managerReceiveLocation", (data) => {
    console.log(data);
  });

  const goToCurrentLocation = async () => {
    mapViewRef.current?.animateToRegion(
      {
        latitude: currentCoordinates.latitude,
        longitude: currentCoordinates.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      },
      1000
    );
    setRegion(currentCoordinates);
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Image source={{ uri: item.profilePic }} style={styles.profileImage} />
      <View style={styles.textContainer}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.location}>{item.location}</Text>
      </View>
      {item.distance ? (
        <View style={styles.distanceContainer}>
          <Text style={styles.distanceText}>{item.distance}</Text>
        </View>
      ) : null}
    </View>
  );

  return (
    <SafeAreaView style={styles.backgroundStyle}>
      <StatusBar
        barStyle={"light-content"}
        backgroundColor={theme.colors.background}
      />

      <View
        style={{
          flexDirection: "row",
          alignItems: "flex-start",
          justifyContent: "space-between",
          marginTop: "20%",
          //   backgroundColor: "black",
        }}
      >
        <Text
          style={{
            fontSize: 26,
            // backgroundColor: "red",
            fontWeight: "300",
            textAlign: "justify",
            flexWrap: "wrap",
            color: theme.colors.secondary,
          }}
        >
          Agent Tracking
        </Text>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            // backgroundColor: "red",
            justifyContent: "space-between",
            marginTop: 10,
          }}
        >
          <EvilIcons
            name="calendar"
            size={34}
            color="white"
            style={{ marginHorizontal: 3 }}
          />
          <MaterialCommunityIcons
            name="progress-check"
            size={28}
            style={{ marginHorizontal: 3 }}
            color="white"
          />
          {/* <Entypo
              name="dots-three-vertical"
              size={24}
              color="white"
              style={{ marginHorizontal: 3 }}
            /> */}
        </View>
      </View>

      <View
        style={{
          marginTop: 30,
          maxHeight: "35%",
          justifyContent: "flex-start",
        }}
      >
        <MapView
          provider={PROVIDER_GOOGLE}
          ref={mapViewRef}
          style={{
            height: "100%",
            width: "100%",
          }}
          rotateEnabled
          zoomEnabled
          showsCompass
          loadingEnabled
          region={region}
          initialRegion={currentCoordinates}
        >
          {/* <Marker
              coordinate={{
                latitude: currentCoordinates.latitude,
                longitude: currentCoordinates.longitude,
              }}
              anchor={{ x: 0.5, y: 0.5 }}
              image={markerImage}
            /> */}

          <Marker
            coordinate={{
              latitude: currentCoordinates.latitude,
              longitude: currentCoordinates.longitude,
            }}
            flat={true}
            anchor={{ x: 0.5, y: 0.5 }}
          ></Marker>
        </MapView>

        <TouchableOpacity
          onPress={goToCurrentLocation}
          style={{
            position: "absolute",
            bottom: 20,
            right: 20,
            zAgentTracking: 9,
          }}
        >
          <MaterialIcons name="my-location" size={30} color="black" />
        </TouchableOpacity>
      </View>
      <View
        style={{
          maxHeight: "50%",
          backgroundColor: "red",
          justifyContent: "flex-start",
        }}
      >
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
        />
      </View>

      {loading && <Loader />}
    </SafeAreaView>
  );
};

export default AgentTracking;

const styles = StyleSheet.create({
  backgroundStyle: {
    backgroundColor: theme.colors.background,
    flex: 1,
    // paddingVertical: 20,
    paddingHorizontal: 20,
  },

  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    backgroundColor: "white",
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
  },
  location: {
    color: "#888",
  },
  distanceContainer: {
    backgroundColor: "#32CD32", // Light green color
    borderRadius: 15,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  distanceText: {
    color: "white",
    fontWeight: "bold",
  },
});

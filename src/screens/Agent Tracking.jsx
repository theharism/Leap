import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
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
import { getAddressFromCoordinates } from "../utils/decodeCoordinates";
import { getDistanceBetweenCoordinates } from "../utils/calculateDistance";

const AgentTracking = ({ navigation }) => {
  const user = useSelector((state) => state.User);
  const { onEvent } = useSocket();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const mapViewRef = useRef(null);
  const currentCoordinates = useSelector((state) => state.Location);
  const [region, setRegion] = useState(null);
  const [currentAgents, setCurrentAgents] = useState([]);

  onEvent("managerReceiveLocation", async (data) => {
    const location = await getAddressFromCoordinates(
      data.latitude,
      data.longitude
    );
    const distance = getDistanceBetweenCoordinates(
      data.latitude,
      data.longitude,
      currentCoordinates.latitude,
      currentCoordinates.longitude
    );
    setCurrentAgents((prevAgents) => {
      const agentIndex = prevAgents.findIndex(
        (agent) => agent.agentId === data.agentId
      );

      const updatedData = {
        ...data,
        location, // Add the address to the agent's data
        distance,
      };

      if (agentIndex !== -1) {
        // If the agent already exists, update the existing object
        const updatedAgents = [...prevAgents];
        updatedAgents[agentIndex] = updatedData;
        return updatedAgents;
      } else {
        // If the agent doesn't exist, add the new object
        return [...prevAgents, updatedData];
      }
    });
  });

  const goToAgentLocation = async (lat, lang) => {
    const newRegion = {
      latitude: lat,
      longitude: lang,
      latitudeDelta: 0.005,
      longitudeDelta: 0.005,
    };

    mapViewRef.current?.animateToRegion(newRegion, 1000);
    setRegion(newRegion);
  };

  const renderItem = ({ item }) => (
    <Pressable
      onPress={() => goToAgentLocation(item?.latitude, item?.longitude)}
      style={styles.itemContainer}
    >
      {/* <Image source={{ uri: item?.profilePic }} style={styles.profileImage} /> */}
      <View style={styles.textContainer}>
        <Text style={styles.name}>{item?.agentName}</Text>
        <Text style={styles.location}>{item?.location}</Text>
      </View>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <AntDesign
          name="message1"
          size={26}
          color="black"
          onPress={() =>
            navigation.navigate("Chat", {
              userId1: user?._id,
              userId2: item?.agentId,
              userName2: item?.agentName,
            })
          }
        />
        <View style={styles.distanceContainer}>
          <Text style={styles.distanceText}>
            {Math.round(item?.distance)} mi
          </Text>
        </View>
      </View>
    </Pressable>
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
          alignItems: "center",
          justifyContent: "space-between",
          marginHorizontal: "5%"
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
        {/* <View
          style={{
            flexDirection: "row",
            alignItems: "center",
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
        </View> */}
      </View>
      {currentCoordinates?.latitude ? (
        <View
          style={{
            marginTop: 30,
            maxHeight: "35%",
            justifyContent: "flex-start",
            marginHorizontal: "5%",
          }}
        >
          <MapView
            provider={PROVIDER_GOOGLE}
            ref={mapViewRef}
            style={{
              height: "100%",
              width: "100%",
              borderRadius:10
            }}
            rotateEnabled
            zoomEnabled
            showsCompass
            loadingEnabled
            region={region}
            initialRegion={currentCoordinates}
            showsUserLocation={true} // Show the user's location as a blue dot
          >
            {currentAgents?.map((agent) => (
              <Marker
                key={agent.agentId} // Use a unique key for each marker
                coordinate={{
                  latitude: agent.latitude,
                  longitude: agent.longitude,
                }}
                flat={true}
                anchor={{ x: 0.5, y: 0.5 }}
              />
            ))}
          </MapView>
        </View>
      ) : (
        <View style={{ flex: 1, justifyContent: "center" }}>
          <ActivityIndicator size={"large"} style={{ alignSelf: "center" }} />
        </View>
      )}

      <View
        style={{
          maxHeight: "50%",
          justifyContent: "flex-start",
          marginHorizontal: "5%",
          marginTop: 20,
        }}
      >
        {currentAgents.length > 0 ? (
          <FlatList
            data={currentAgents}
            renderItem={renderItem}
            keyExtractor={(item) => item.agentId}
          />
        ) : (
          <Text
            style={{
              fontSize: 24,
              fontWeight: "bold",
              color: "white",
              alignSelf: "center",
            }}
          >
            None of the agent is live
          </Text>
        )}
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
    paddingVertical: 20,
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
  textContainer: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
  },
  location: {
    color: "#888",
    flexWrap: "wrap",
    maxWidth: "60%",
  },
  distanceContainer: {
    backgroundColor: "#32CD32", // Light green color
    borderRadius: 15,
    paddingVertical: 4,
    paddingHorizontal: 10,
    marginLeft: 10,
  },
  distanceText: {
    color: "white",
    fontWeight: "bold",
  },
});

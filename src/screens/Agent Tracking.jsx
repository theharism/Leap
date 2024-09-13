import {
  ActivityIndicator,
  Alert,
  Button,
  FlatList,
  Image,
  Modal,
  Pressable,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { theme } from "../constants/theme";
import { useDispatch, useSelector } from "react-redux";
import {
  EvilIcons,
  MaterialCommunityIcons,
  Entypo,
  MaterialIcons,
} from "@expo/vector-icons";
import Ionicons from "@expo/vector-icons/Ionicons";
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
import { privateApi, publicURL } from "../api/axios";
import { useFocusEffect } from "@react-navigation/native";
import { debounce } from "lodash";

const AgentTracking = ({ navigation }) => {
  const user = useSelector((state) => state.User);
  const { onEvent } = useSocket();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  const mapViewRef = useRef(null);
  const currentCoordinates = useSelector((state) => state.Location);
  const [region, setRegion] = useState(null);
  const [currentAgents, setCurrentAgents] = useState([]);
  const [expandedItems, setExpandedItems] = useState({});

  const [agentEntries, setAgentEntries] = useState({});
  const [displayModal, setDisplayModal] = useState(false);

  const debouncedProcessLocation = debounce(ProcessLocation, 10000);

  const fetchAgentEntries = (agentId) => {
    setLoading(true);
    privateApi(user?.token)
      .get(`/entries/${agentId}`)
      .then((res) => {
        setAgentEntries(res.data.entries);
        setDisplayModal(true);
      })
      .catch((err) => {
        console.log(err.response.data);
        Alert.alert(err.response.data.message || "Internal Server Error");
      })
      .finally(() => {
        setDisplayModal(true);

        setLoading(false);
        setDisplayModal(true);
        setDisplayModal(true);
      });
  };

  async function ProcessLocation(data) {
    const location = await getAddressFromCoordinates(
      data.latitude,
      data.longitude
    );
    const distance = await getDistanceBetweenCoordinates(
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
  }
  // console.log(currentAgents);
  // onEvent("managerReceiveLocation", debouncedProcessLocation);

  const getAgentLocations = () => {
    setLoading(true);
    privateApi(user?.token)
      .get("/location", {
        params: {
          companyName: user?.companyName,
        },
      })
      .then((res) => res.data?.map((location) => ProcessLocation(location)))
      .catch((err) => console.error("error fetching locations", err))
      .finally(() => setLoading(false));
  };

  useFocusEffect(
    React.useCallback(() => {
      if (user?.token && currentCoordinates?.longitude !== 0) {
        getAgentLocations();
      }
    }, [user, currentCoordinates])
  );

  const onRefresh = useCallback(() => {
    getAgentLocations();
  }, []);

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

  // Function to toggle the expanded state of a specific item
  const toggleItemExpansion = (id) => {
    setExpandedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const RenderItem = ({ navigation, publicURL, item, toggleExpansion }) => {
    // const getTruncatedLocation = (location) => {
    //   return location?.split(" ").slice(0, 3).join(" ") + "...";
    // };

    const getTruncatedLocation = (location) => {
      return location?.substring(0, 10) + "...";
    };

    return (
      <Pressable
        onPress={() => {
          goToAgentLocation(item?.latitude, item?.longitude);
          toggleExpansion(item.agentId);
        }}
        style={styles.itemContainer}
      >
        <Image
          source={{ uri: `${publicURL}${item?.profilePic}` }}
          style={styles.profileImage}
        />
        <View style={styles.textContainer}>
          <Text style={styles.name}>{item?.agentName}</Text>
          <Text style={styles.location}>
            {!!expandedItems[item.agentId]
              ? item?.location
              : getTruncatedLocation(item?.location)}
          </Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <AntDesign
            name="message1"
            size={26}
            color="black"
            style={{ marginRight: 5 }}
            onPress={() =>
              navigation.navigate("Chat", {
                userId1: user?._id,
                userId2: item?.agentId,
                userName2: item?.agentName,
              })
            }
          />
          <Ionicons
            name="checkmark-done"
            size={24}
            color="black"
            onPress={() => fetchAgentEntries(item?.agentId)}
          />
          <View style={styles.distanceContainer}>
            <Text style={styles.distanceText}>
              {Math.round(item?.distance)} mi
            </Text>
          </View>
        </View>
      </Pressable>
    );
  };

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
          marginHorizontal: "5%",
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
          {/* <EvilIcons
            onPress={() => navigation.navigate("My Agents")}
            name="calendar"
            size={34}
            color="white"
            style={{ marginHorizontal: 3 }}
          /> */}
          <MaterialCommunityIcons
            onPress={() => navigation.navigate("My Agents")}
            style={{ marginHorizontal: 3 }}
            name="calendar-month"
            size={27}
            color="white"
          />
          <AntDesign
            name="message1"
            size={23}
            color="white"
            style={{ marginHorizontal: 3 }}
            onPress={() => navigation.navigate("My Agents")}
          />
          {/* <MaterialCommunityIcons
            name="progress-check"
            size={28}
            style={{ marginHorizontal: 3 }}
            color="white"
          /> */}
          {/* <Entypo
              name="dots-three-vertical"
              size={24}
              color="white"
              style={{ marginHorizontal: 3 }}
            /> */}
        </View>
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
              >
                <Image
                  source={{ uri: `${publicURL}${agent?.profilePic}` }}
                  style={{ width: 40, height: 40, borderRadius: 20 }}
                />
              </Marker>
            ))}
          </MapView>
        </View>
      ) : (
        <View
          style={{
            marginTop: 30,
            maxHeight: "35%",
            justifyContent: "flex-start",
          }}
        >
          <ActivityIndicator size={"large"} style={{ alignSelf: "center" }} />
        </View>
      )}

      <View
        style={{
          maxHeight: "50%",
          justifyContent: "flex-start",
          marginHorizontal: "5%",
        }}
      >
        {currentAgents.length > 0 ? (
          <FlatList
            data={currentAgents}
            renderItem={({ item }) => (
              <RenderItem
                item={item}
                publicURL={publicURL}
                navigation={navigation}
                toggleExpansion={toggleItemExpansion}
              />
            )}
            keyExtractor={(item) => item.agentId}
            refreshControl={
              <RefreshControl refreshing={loading} onRefresh={onRefresh} />
            }
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

      <Modal animationType="slide" transparent={true} visible={displayModal}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>
              Sales Targets: {agentEntries?.SalesTargets?.salesTargets || 0}
            </Text>
            <Text style={styles.modalText}>
              Average Case Size:{" "}
              {agentEntries?.SalesTargets?.averageCaseSize || 0}
            </Text>
            <Text style={styles.modalText}>
              Number of Weeks: {agentEntries?.SalesTargets?.numberOfWeeks || 0}
            </Text>
            <Text style={styles.modalText}>
              Prospecting Approach:{" "}
              {agentEntries?.SuccessFormula?.prospectingApproach || 0}
            </Text>
            <Text style={styles.modalText}>
              Appointments Kept:{" "}
              {agentEntries?.SuccessFormula?.appointmentsKept || 0}
            </Text>
            <Text style={styles.modalText}>
              Sales Submitted:{" "}
              {agentEntries?.SuccessFormula?.salesSubmitted || 0}
            </Text>

            <Button
              title="Close"
              onPress={() => {
                setDisplayModal(false);
                setAgentEntries({});
              }}
            />
          </View>
        </View>
      </Modal>

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
  profileImage: {
    width: 40, // Adjust width as needed
    height: 40, // Adjust height as needed
    borderRadius: 20, // Make it circular, adjust for desired shape
    alignSelf: "flex-start", // Center the image
    backgroundColor: "#e0e0e0", // Placeholder color while loading
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
    marginLeft: 10,
    marginRight: 10,
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
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Optional background dimming
  },
  modalView: {
    width: 300,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
});

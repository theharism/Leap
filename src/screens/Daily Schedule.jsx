import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Modal,
  TextInput,
  StyleSheet,
  Alert,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from "react-native";
import {
  EvilIcons,
  MaterialCommunityIcons,
  Entypo,
  MaterialIcons,
} from "@expo/vector-icons";
import {
  CalendarProvider,
  ExpandableCalendar,
  TimelineList,
  CalendarUtils,
} from "react-native-calendars";
import groupBy from "lodash/groupBy";
import find from "lodash/find";
import filter from "lodash/filter";
import { theme } from "../constants/theme";
import { Button, SegmentedButtons } from "react-native-paper";
import DateTimePicker from "@react-native-community/datetimepicker";

const INITIAL_TIME = { hour: 9, minutes: 0 };

const TimelineCalendarScreen = () => {
  const [events, setEvents] = useState([]);
  const [currentDate, setCurrentDate] = useState(
    CalendarUtils.getCalendarDateString(new Date())
  );
  const [eventsByDate, setEventsByDate] = useState(
    groupBy(events, (e) => CalendarUtils.getCalendarDateString(e.start))
  );
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isEventModalVisible, setEventModalVisible] = useState(false);
  const [selectStartTime, setSelectStartTime] = useState(false);
  const [selectEndTime, setSelectEndTime] = useState(false);
  const [isAddEventModalVisible, setAddEventModalVisible] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState("");
  const [newEventDescription, setNewEventDescription] = useState("");
  const [newEventStatus, setNewEventStatus] = useState("Pending");
  const [newEventStartTime, setNewEventStartTime] = useState(new Date());
  const [newEventEndTime, setNewEventEndTime] = useState(new Date());

  const markedDates = {
    [currentDate]: { marked: true },
  };

  const handleDateChanged = (date) => {
    setCurrentDate(date);
  };

  const handleEventPress = (event) => {
    setSelectedEvent(event);
    setEventModalVisible(true);
  };

  const editEvent = (event) => {
    setEventModalVisible(false);
    setSelectedEvent(event);
    setNewEventTitle(event.title);
    setNewEventDescription(event.description);
    setNewEventStartTime(new Date(event.start));
    setNewEventEndTime(new Date(event.end));
    setNewEventStatus(event.status);

    setAddEventModalVisible(true);
  };

  const deleteEvent = (event) => {
    const updatedEvents = filter(events, (e) => e.id !== event.id);
    setEvents(updatedEvents);
    setEventsByDate(
      groupBy(updatedEvents, (e) =>
        CalendarUtils.getCalendarDateString(e.start)
      )
    );
    setEventModalVisible(false);
  };

  const handleAddEvent = (timeString, timeObject) => {
    setNewEventStartTime(
      new Date(`${timeObject.date}T${timeObject.hour}:${timeObject.minutes}:00`)
    );
    setNewEventEndTime(
      new Date(
        `${timeObject.date}T${timeObject.hour + 1}:${timeObject.minutes}:00`
      )
    );
    setAddEventModalVisible(true);
  };

  const saveNewEvent = () => {
    Keyboard.dismiss();

    if (selectedEvent) {
      const updatedEvents = events.map((event) =>
        event.id === selectedEvent.id
          ? {
              ...selectedEvent,
              title: newEventTitle,
              description: newEventDescription,
              start: newEventStartTime,
              end: newEventEndTime,
              status: newEventStatus,
              color:
                newEventStatus === "Completed"
                  ? "#4CAF50"
                  : newEventStatus === "Started"
                  ? "#4A90E2"
                  : "#FFA500",
            }
          : event
      );
      setEvents(updatedEvents);
      setEventsByDate(
        groupBy(updatedEvents, (e) =>
          CalendarUtils.getCalendarDateString(e.start)
        )
      );
    } else {
      if (
        !newEventTitle ||
        !newEventDescription ||
        !newEventStartTime ||
        !newEventEndTime
      ) {
        return;
      }

      const newEvent = {
        id: `event-${events.length + 1}`,
        start: newEventStartTime.toISOString(),
        end: newEventEndTime.toISOString(),
        title: newEventTitle,
        description: newEventDescription,
        status: newEventStatus,
        color: "#FFA500",
      };
      setEvents([...events, newEvent]);
      setEventsByDate(
        groupBy([...events, newEvent], (e) =>
          CalendarUtils.getCalendarDateString(e.start)
        )
      );
    }
    setAddEventModalVisible(false);
    setSelectedEvent(null);
    setNewEventTitle("");
    setNewEventDescription("");
  };

  // const handleStatusChange = (status) => {
  //   if (selectedEvent) {
  //     console.log(events);
  //     setNewEventStatus(status);
  //     const updatedEvent = { ...selectedEvent, status };
  //     const updatedEvents = events.map((event) =>
  //       event.id === selectedEvent.id ? updatedEvent : event
  //     );
  //     console.log(updatedEvents);
  //     setEvents(updatedEvents);
  //     setEventsByDate(
  //       groupBy(updatedEvents, (e) =>
  //         CalendarUtils.getCalendarDateString(e.start)
  //       )
  //     );
  //   }
  // };

  const timelineProps = {
    format24h: true,
    onEventPress: handleEventPress,
    onBackgroundLongPress: handleAddEvent,
    scrollToFirst: true,
    initialTime: INITIAL_TIME,
    overlapEventsSpacing: 3,
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
          alignItems: "flex-start",
          justifyContent: "space-between",

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
          Daily Schedule
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
          flex: 1,
          justifyContent: "flex-start",
        }}
      >
        <CalendarProvider date={currentDate} onDateChanged={handleDateChanged}>
          <ExpandableCalendar firstDay={1} markedDates={markedDates} />
          <TimelineList
            events={eventsByDate}
            scrollToFirst
            showNowIndicator
            scrollToNow
            timelineProps={{
              ...timelineProps,
              renderEvent: (event, eventStyle) => (
                <View
                  style={[
                    eventStyle,
                    {
                      backgroundColor: event.color,
                      padding: 5, // Optional: add some padding
                    },
                  ]}
                >
                  <Text style={{ color: "white", fontWeight: "bold" }}>
                    {event.title}
                  </Text>
                </View>
              ),
            }}
          />

          <Modal
            visible={isEventModalVisible}
            transparent={true}
            animationType="slide"
          >
            <KeyboardAvoidingView
              style={{ flex: 1 }}
              behavior={"padding"}
              enabled
            >
              <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                <View style={styles.modalContainer}>
                  <View style={styles.modalContent}>
                    <Text style={{ textAlign: "center", fontSize: 20 }}>
                      Event Details
                    </Text>
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: "bold",
                        marginTop: 10,
                      }}
                    >
                      {selectedEvent?.title}
                    </Text>
                    <Text
                      style={{
                        fontSize: 12,
                        marginVertical: 5,
                      }}
                    >
                      {selectedEvent?.description}
                    </Text>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginVertical: 10,
                      }}
                    >
                      <Text>
                        {new Date(selectedEvent?.start).toLocaleTimeString()} -{" "}
                        {new Date(selectedEvent?.end).toLocaleTimeString()}
                      </Text>

                      <Text style={{ fontWeight: "bold" }}>
                        {selectedEvent?.status}
                      </Text>
                    </View>

                    {/* <SegmentedButtons
                      buttons={[
                        {
                          value: "walk",
                          label: "Completed",
                        },
                        {
                          value: "train",
                          label: "Pending",
                        },
                        { value: "drive", label: "Started" },
                      ]}
                    /> */}
                    {/* <Button onPress={() => handleStatusChange("completed")}>
                      Mark as Completed
                    </Button>
                    <Button onPress={() => handleStatusChange("pending")}>
                      Mark as Pending
                    </Button>
                    <Button onPress={() => handleStatusChange("started")}>
                      Mark as Started
                    </Button>
                    <Button onPress={() => handleStatusChange("not started")}>
                      Mark as Not Started
                    </Button>
                    <Button onPress={() => setEventModalVisible(false)}>
                      Close
                    </Button> */}
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginTop: 10,
                      }}
                    >
                      <Button
                        buttonColor="red"
                        labelStyle={{ color: "white" }}
                        onPress={() => deleteEvent(selectedEvent)}
                      >
                        Delete
                      </Button>
                      <View
                        style={{ flexDirection: "row", alignItems: "center" }}
                      >
                        <Button
                          mode="outlined"
                          style={{ marginRight: 5 }}
                          onPress={() => setEventModalVisible(false)}
                        >
                          Cancel
                        </Button>
                        <Button
                          mode="contained"
                          onPress={() => editEvent(selectedEvent)}
                        >
                          Edit
                        </Button>
                      </View>
                    </View>
                  </View>
                </View>
              </ScrollView>
            </KeyboardAvoidingView>
          </Modal>

          <Modal
            visible={isAddEventModalVisible}
            transparent={true}
            animationType="slide"
          >
            <KeyboardAvoidingView
              style={{ flex: 1 }}
              behavior={"padding"}
              enabled
            >
              <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                <View style={styles.modalContainer}>
                  <View style={styles.modalContent}>
                    <TextInput
                      placeholder="Event Title"
                      multiline
                      numberOfLines={2}
                      maxLength={100}
                      value={newEventTitle}
                      style={{
                        marginVertical: 5,
                        paddingVertical: 10,
                        paddingHorizontal: 5,
                        borderColor: "gray",
                        borderWidth: 1,
                        borderRadius: 5,
                        textAlignVertical: "top", // Ensure text starts from top-left corner
                      }}
                      onChangeText={setNewEventTitle}
                    />
                    <TextInput
                      placeholder="Event Description"
                      value={newEventDescription}
                      multiline
                      numberOfLines={5}
                      maxLength={300}
                      style={{
                        marginVertical: 5,
                        paddingVertical: 10,
                        paddingHorizontal: 5,
                        borderColor: "gray",
                        borderWidth: 1,
                        borderRadius: 5,
                        textAlignVertical: "top", // Ensure text starts from top-left corner
                      }}
                      onChangeText={setNewEventDescription}
                    />

                    {selectedEvent && (
                      <SegmentedButtons
                        value={newEventStatus}
                        onValueChange={setNewEventStatus}
                        buttons={[
                          {
                            value: "Completed",
                            label: "Completed",
                          },

                          { value: "Started", label: "Started" },
                          {
                            value: "Pending",
                            label: "Pending",
                          },
                        ]}
                      />
                    )}

                    <View>
                      <Button
                        mode="contained"
                        onPress={() => setSelectStartTime(true)}
                        style={{ marginVertical: 4 }}
                      >
                        Start Time
                      </Button>

                      <Button
                        style={{ marginVertical: 4 }}
                        mode="contained"
                        onPress={() => setSelectEndTime(true)}
                      >
                        End Time
                      </Button>
                    </View>

                    {selectStartTime && (
                      <DateTimePicker
                        onCon
                        value={newEventStartTime}
                        mode="time"
                        display="spinner"
                        onChange={(event, date) => {
                          setSelectStartTime(false);
                          setNewEventStartTime(date || newEventStartTime);
                        }}
                      />
                    )}
                    {selectEndTime && (
                      <DateTimePicker
                        value={newEventEndTime}
                        mode="time"
                        display="spinner"
                        onChange={(event, date) => {
                          setSelectEndTime(false);
                          setNewEventEndTime(date || newEventEndTime);
                        }}
                      />
                    )}
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        marginTop: 15,
                      }}
                    >
                      <Button
                        mode="contained"
                        onPress={saveNewEvent}
                        buttonColor="green"
                      >
                        Save Event
                      </Button>
                      <Button
                        mode="outlined"
                        onPress={() => {
                          setSelectedEvent(null);
                          setNewEventTitle("");
                          setNewEventDescription("");
                          setAddEventModalVisible(false);
                        }}
                      >
                        Cancel
                      </Button>
                    </View>
                  </View>
                </View>
              </ScrollView>
            </KeyboardAvoidingView>
          </Modal>

          {/* <Modal
            visible={isAddEventModalVisible}
            transparent={true}
            animationType="slide"
          >
            <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flex: 1 }}>
              <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                  <TextInput
                    placeholder="Event Title"
                    multiline
                    numberOfLines={2}
                    maxLength={100}
                    value={newEventTitle}
                    style={{
                      marginVertical: 5,
                      paddingVertical: 10,
                      paddingHorizontal: 5,
                      borderColor: "gray",
                      borderWidth: 1,
                      borderRadius: 5,
                    }}
                    onChangeText={setNewEventTitle}
                  />
                  <TextInput
                    placeholder="Event Description"
                    value={newEventDescription}
                    multiline
                    numberOfLines={15}
                    maxLength={300}
                    style={{
                      marginVertical: 5,
                      paddingVertical: 10,
                      paddingHorizontal: 5,
                      borderColor: "gray",
                      borderWidth: 1,
                      borderRadius: 5,
                    }}
                    onChangeText={setNewEventDescription}
                  />
                  <Button title="Save Event" onPress={saveNewEvent} />
                  <Button
                    title="Cancel"
                    onPress={() => setAddEventModalVisible(false)}
                  />
                </View>
              </View>
            </ScrollView>
          </Modal> */}
        </CalendarProvider>
      </View>
    </SafeAreaView>
  );
};

export default TimelineCalendarScreen;

const styles = StyleSheet.create({
  backgroundStyle: {
    backgroundColor: theme.colors.background,
    flex: 1,
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  item: {
    flex: 1,
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    marginTop: 25,
    paddingBottom: 20,
    backgroundColor: "lightblue",
  },
  itemText: {
    color: "black",
    fontSize: 14,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "90%",
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    elevation: 10,
  },
});

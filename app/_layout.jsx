import { Slot } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { PaperProvider } from "react-native-paper";
import { Provider } from "react-redux";
import { store } from "./src/redux/store";

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <PaperProvider>
          <Slot />
        </PaperProvider>
      </Provider>
    </GestureHandlerRootView>
  );
}

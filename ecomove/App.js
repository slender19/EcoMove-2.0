import React from "react";
import AppNavigator from "./src/navigation/AppNavigator";
import { HistorialProvider } from "./src/components/HistorialContext";

export default function App() {
  return (
    <HistorialProvider>
      <AppNavigator />
    </HistorialProvider>
  );
}

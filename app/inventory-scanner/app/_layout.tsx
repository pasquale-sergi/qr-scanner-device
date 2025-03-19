import { Stack } from "expo-router";
import React from "react";
import './globals.css';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="(tabs)"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="stock_alert"
        options={{ 
          headerShown: false, // Hide the default header since we have a custom one
          presentation: "card", // This gives a card-like animation
          animation: "slide_from_right" // Slide animation from right
        }}
      />
    </Stack>
  );
}

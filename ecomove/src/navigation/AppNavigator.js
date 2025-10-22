import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import LoginScreen from "../screen/LoginScreen";
import RegisterScreen from "../screen/RegisterScreen";
import HomeScreen from "../screen/users/HomeScreen";
import Solicitar from "../screen/users/Solicitar";
import Devolucion from "../screen/users/Devolucion";
import Historial from "../screen/users/Historial";
import AdminHomeScreen from "../screen/admin/AdminHomeScreen";
import StationScreen from "../screen/admin/StationScreen";
import VehicleScreen from "../screen/admin/VehicleScreen";



const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        {/* LOGIN & REGISTRO */}
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Solicitar"
          component={Solicitar}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Historial"
          component={Historial}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Devolucion"
          component={Devolucion}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{ title: "Registro" }}
        />

        {/* DASHBOARD USUARIO */}
        <Stack.Screen
          name="HomeScreen"
          component={HomeScreen}
          options={{ title: "Ecomove 🚲" }}
        />

        {/* DASHBOARD ADMIN */}
        <Stack.Screen
          name="AdminHome"
          component={AdminHomeScreen}
          options={{ title: "Panel de Administrador" }}
        />

        {/* GESTIÓN DE ESTACIONES */}
        <Stack.Screen
          name="StationScreen"
          component={StationScreen}
          options={{ title: "Gestionar Estaciones" }}
        />

        {/* GESTIÓN DE VEHICULOS */}
        <Stack.Screen
          name="VehicleScreen"
          component={VehicleScreen}
          options={{ title: "Gestionar Vehículos" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

import { Image, StyleSheet, Text, View, Dimensions, Pressable } from "react-native";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { LineChart } from "react-native-chart-kit";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const index = () => {
  const [completedTasks, setCompletedTasks] = useState(0);
  const [pendingTasks, setPendingTasks] = useState(0);
  const router = useRouter();

  const fetchTaskData = async () => {
    try {
      const response = await fetch("https://todolist-api-reactnative.vercel.app/todos/count");
  
      if (!response.ok) {
        throw new Error("Failed to fetch task data");
      }
  
      const responseData = await response.json();
      const { totalCompletedTodos, totalPendingTodos } = responseData;
  
      setCompletedTasks(totalCompletedTodos);
      setPendingTasks(totalPendingTodos);
    } catch (error) {
      console.log("error", error);
    }
  };
  
  const handleLogout = async () => {
    try {
      // Clear authentication token from AsyncStorage
      await AsyncStorage.removeItem("authToken");
      await AsyncStorage.removeItem("userId");
      // Navigate to the login screen
      router.replace("/(authenticate)/login");
    } catch (error) {
      console.error("Error occurred during logout:", error);
    }
  };

  useEffect(() => {
    fetchTaskData();
  }, []);
  // console.log("comp", completedTasks);
  // console.log("pending", pendingTasks);
  return (
    <View style={{ padding: 10, flex: 1, backgroundColor: "white" }}>
     <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 10 }}>
  <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
    {/* <Image
      style={{ width: 60, height: 60, borderRadius: 30 }}
      source={{
        uri: "https://lh3.googleusercontent.com/ogw/ANLem4Zmk7fohWyH7kB6YArqFy0WMfXnFtuX3PX3LSBf=s64-c-mo",
      }}
    /> */}
    <View style={{ marginLeft: 10 }}>
      <Text style={{ fontSize: 16, fontWeight: "600" }}>
        Plan Your Day Now 😊
      </Text>
   
    </View>
  </View>

  <Pressable onPress={handleLogout} style={{ padding: 10 }}>
    <Text style={{ color: "red", fontWeight: "bold" }}>Logout</Text>
  </Pressable>
</View>


      <View style={{ marginVertical: 12 }}>
        <Text>Tasks Overview</Text>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 6,
            marginVertical: 8,
          }}
        >
          <View
            style={{
              backgroundColor: "#89CFF0",
              padding: 10,
              borderRadius: 8,
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text
              style={{ textAlign: "center", fontSize: 16, fontWeight: "bold" }}
            >
              {completedTasks}
            </Text>
            <Text style={{ marginTop: 4 }}>completed tasks</Text>
          </View>

          <View
            style={{
              backgroundColor: "#89CFF0",
              padding: 10,
              borderRadius: 8,
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text
              style={{ textAlign: "center", fontSize: 16, fontWeight: "bold" }}
            >
              {pendingTasks}
            </Text>
            <Text style={{ marginTop: 4 }}>pending tasks</Text>
          </View>
        </View>
      </View>

      <LineChart
        data={{
          labels: ["Pending Tasks", "Completed Tasks"],
          datasets: [
            {
              data: [pendingTasks, completedTasks],
            },
          ],
        }}
        width={Dimensions.get("window").width - 20} // from react-native
        height={320}
        // yAxisLabel="$"
        // yAxisSuffix="k"
        yAxisInterval={2} // optional, defaults to 1
        chartConfig={{
          backgroundColor: "#e26a00",
          backgroundGradientFrom: "#fb8c00",
          backgroundGradientTo: "#ffa726",
          decimalPlaces: 2, // optional, defaults to 2dp
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          style: {
            borderRadius: 16,
          },
          propsForDots: {
            r: "6",
            strokeWidth: "2",
            stroke: "#ffa726",
          },
        }}
        bezier
        style={{
          borderRadius: 16,
        }}
      />


     
    </View>
  );
};

export default index;

const styles = StyleSheet.create({});

import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  ViewBase,
} from "react-native";
import React, { useState, useEffect } from "react";
import { AntDesign, Feather } from "@expo/vector-icons";
import { BottomModal } from "react-native-modals";
import { ModalTitle, ModalContent } from "react-native-modals";
import { SlideAnimation } from "react-native-modals";
import { Entypo, FontAwesome } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { MaterialIcons } from "@expo/vector-icons";

import moment from "moment";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const index = () => {
  const router = useRouter();
  const [todos, setTodos] = useState([]);
  const today = moment().format("MMM Do");
  const [isModalVisible, setModalVisible] = useState(false);
  const [category, setCategory] = useState("All");
  const [todo, setTodo] = useState("");
  const [pendingTodos, setPendingTodos] = useState([]);
  const [completedTodos, setCompletedTodos] = useState([]);
  const [marked, setMarked] = useState(false);
  const suggestions = [
    {
      id: "0",
      todo: "Drink Water, keep healthy",
    },
    {
      id: "1",
      todo: "Go Excercising",
    },
    {
      id: "2",
      todo: "Go to bed early",
    },
    {
      id: "3",
      todo: "Take pill reminder",
    },
    {
      id: "4",
      todo: "Go Shopping",
    },
    {
      id: "5",
      todo: "finish assignments",
    },
  ];
  // const addTodo = async () => {
  //   try {
  //     const todoData = {
  //       title: todo,
  //       category: category,
  //     };

  //     axios
  //       .post("https://todolist-api-reactnative.vercel.app/todos/660ac2edcc0adcec3f041b67", todoData)
  //       .then((response) => {
  //         console.log(response);
  //       })
  //       .catch((error) => {
  //         console.log("error", error);
  //       });

  //     await getUserTodos();
  //     setModalVisible(false);
  //     setTodo("");
  //   } catch (error) {
  //     console.log("error", error);
  //   }
  // };

  const addTodo = async () => {
    try {
      const todoData = {
        title: todo,
        category: category,
      };
      const id = await AsyncStorage.getItem("userId");
      const response = await fetch(`https://todolist-api-reactnative.vercel.app/todos/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(todoData),
      });

      if (!response.ok) {
        throw new Error("Failed to add todo");
      }

      // Assuming getUserTodos is a function that fetches user todos
      await getUserTodos();

      setModalVisible(false);
      setTodo("");
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    getUserTodos();
  }, [marked, isModalVisible]);

  const getUserTodos = async () => {
    try {
      const id = await AsyncStorage.getItem("userId");
      const response = await fetch(
        `https://todolist-api-reactnative.vercel.app/users/${id}/todos`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch user todos");
      }

      const responseData = await response.json();
      console.log(responseData.todos);
      setTodos(responseData.todos);

      const fetchedTodos = responseData.todos || [];
      const pending = fetchedTodos.filter(
        (todo) => todo.status !== "completed"
      );
      const completed = fetchedTodos.filter(
        (todo) => todo.status === "completed"
      );

      setPendingTodos(pending);
      setCompletedTodos(completed);
    } catch (error) {
      console.log("error", error);
    }
  };

  const markTodoAsCompleted = async (todoId) => {
    try {
      setMarked(true);

      const response = await fetch(
        `https://todolist-api-reactnative.vercel.app/todos/${todoId}/complete`,
        {
          method: "PATCH",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to mark todo as completed");
      }

      const responseData = await response.json();
      console.log(responseData);
    } catch (error) {
      console.log("error", error);
    }
  };

  const deleteTodo = async (todoId) => {
    try {
      const response = await fetch(
        `https://todolist-api-reactnative.vercel.app/todos/${todoId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete todo");
      }

      // Assuming getUserTodos is a function that fetches user todos
      await getUserTodos();
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <>
      <View
        style={{
          marginHorizontal: 10,
          marginVertical: 10,
          flexDirection: "row",
          alignItems: "center",
          gap: 12,
        }}
      >
        <Pressable onPress={() => setModalVisible(!isModalVisible)}>
          <AntDesign name="pluscircle" size={30} color="#007FFF" />
        </Pressable>
      </View>

      <ScrollView style={{ flex: 1, backgroundColor: "white" }}>
        <View style={{ padding: 10 }}>
          {todos?.length > 0 ? (
            <View>
              {pendingTodos?.length > 0 && <Text>Tasks to Do! {today}</Text>}

              {pendingTodos?.map((item, index) => (
                <Pressable
                  style={{
                    backgroundColor: "#E0E0E0",
                    padding: 10,
                    borderRadius: 7,
                    marginVertical: 10,
                  }}
                  key={index}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 10,
                    }}
                  >
                    <Entypo
                      onPress={() => markTodoAsCompleted(item?._id)}
                      name="circle"
                      size={18}
                      color="black"
                    />
                    <Text style={{ flex: 1 }}>{item?.title}</Text>
                    <Pressable onPress={() => deleteTodo(item._id)}>
                      <AntDesign name="delete" size={24} color="red" />
                    </Pressable>
                  </View>
                </Pressable>
              ))}

              {completedTodos?.length > 0 && (
                <View>
                  <View
                    style={{
                      justifyContent: "center",
                      alignItems: "center",
                      margin: 10,
                    }}
                  >
                    <Image
                      style={{ width: 100, height: 100 }}
                      source={{
                        uri: "https://cdn-icons-png.flaticon.com/128/6784/6784655.png",
                      }}
                    />
                  </View>

                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 5,
                      marginVertical: 10,
                    }}
                  >
                    <Text>Completed Tasks</Text>
                    <MaterialIcons
                      name="arrow-drop-down"
                      size={24}
                      color="black"
                    />
                  </View>

                  {completedTodos?.map((item, index) => (
                    <Pressable
                      style={{
                        backgroundColor: "#E0E0E0",
                        padding: 10,
                        borderRadius: 7,
                        marginVertical: 10,
                      }}
                      key={index}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          gap: 10,
                        }}
                      >
                        <FontAwesome name="circle" size={18} color="gray" />
                        <Text
                          style={{
                            flex: 1,
                            textDecorationLine: "line-through",
                            color: "gray",
                          }}
                        >
                          {item?.title}
                        </Text>
                        <Pressable onPress={() => deleteTodo(item._id)}>
                          <AntDesign name="delete" size={24} color="red" />
                        </Pressable>
                      </View>
                    </Pressable>
                  ))}
                </View>
              )}
            </View>
          ) : (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                marginTop: 130,
                marginLeft: "auto",
                marginRight: "auto",
              }}
            >
              <Image
                style={{ width: 200, height: 200, resizeMode: "contain" }}
                source={{
                  uri: "https://cdn-icons-png.flaticon.com/128/2387/2387679.png",
                }}
              />
              <Text
                style={{
                  fontSize: 16,
                  marginTop: 15,
                  fontWeight: "600",
                  textAlign: "center",
                }}
              >
                No Tasks for today! add a task
              </Text>
              <Pressable
                onPress={() => setModalVisible(!isModalVisible)}
                style={{ marginTop: 15 }}
              >
                <AntDesign name="pluscircle" size={30} color="#007FFF" />
              </Pressable>
            </View>
          )}
        </View>
      </ScrollView>

      <BottomModal
        onBackdropPress={() => setModalVisible(!isModalVisible)}
        onHardwareBackPress={() => setModalVisible(!isModalVisible)}
        swipeDirection={["up", "down"]}
        swipeThreshold={200}
        modalTitle={<ModalTitle title="Add a todo" />}
        modalAnimation={
          new SlideAnimation({
            slideFrom: "bottom",
          })
        }
        visible={isModalVisible}
        onTouchOutside={() => setModalVisible(!isModalVisible)}
      >
        <ModalContent style={{ width: "100%", height: 280 }}>
          <View
            style={{
              marginVertical: 10,
              flexDirection: "row",
              alignItems: "center",
              gap: 10,
            }}
          >
            <TextInput
              value={todo}
              onChangeText={(text) => setTodo(text)}
              placeholder="Input a new task here"
              style={{
                padding: 10,
                borderColor: "#E0E0E0",
                borderWidth: 1,
                borderRadius: 5,
                flex: 1,
              }}
            />
            <Ionicons onPress={addTodo} name="send" size={24} color="#007FFF" />
          </View>

          <Text>Some sugggestions</Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 10,
              flexWrap: "wrap",
              marginVertical: 10,
            }}
          >
            {suggestions?.map((item, index) => (
              <Pressable
                onPress={() => setTodo(item?.todo)}
                style={{
                  backgroundColor: "#F0F8FF",
                  paddingHorizontal: 10,
                  paddingVertical: 4,
                  borderRadius: 25,
                }}
                key={index}
              >
                <Text style={{ textAlign: "center" }}>{item?.todo}</Text>
              </Pressable>
            ))}
          </View>
        </ModalContent>
      </BottomModal>
    </>
  );
};

export default index;

const styles = StyleSheet.create({});

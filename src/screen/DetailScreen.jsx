import {
  ActivityIndicator,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { colors } from "../config/colors";
import { SPACING } from "../config/space";
import axios from "axios";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useIsFocused, useNavigation } from "@react-navigation/native";
const screenHeight = Dimensions.get("screen").height;

export default function DetailScreen({ route }) {

  const isFocused = useIsFocused()
  const [isloadin, setIsLoading] = useState(true);
  const [isRemoving, setIsRemoving] = useState(false);
  const [post, setPost] = useState({});

  //Con este id buscamos el post que apretemos , recordemos que en el params es por donde listamos un solo id , un solo post
  const id = route.params;

  const navigation = useNavigation()

  //hacemos la funcion para poder obtener ese post individual

  const getPost = async () => {
    try {
      setIsLoading(true);
      const { data } = await axios.get(`/post/${id}`);
      setPost(data.data);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log("Erorr en la funcion getPost", error.message);
    }
  };

  useEffect(() => {
   isFocused , getPost();
  }, [isFocused]);

  const deletePost=async()=>{
    try {
      setIsRemoving(true)
      const {data} =await axios.delete(`/post/${post._id}`)
      
      setIsRemoving(false)
      navigation.navigate("HomeScreen")
      
      
    } catch (error) {
      setIsRemoving(false)
      console.log("Error en la funcion deletePost",error.message);
    }
  }

  if (isloadin || isRemoving) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator color="red" size={80} />
      </View>
    );
  }

  return (
    <ScrollView>
      <View style={styles.imageContainer}>
        <View style={styles.imageBorder}>
          <Image source={{ uri: post.imgUrl }} style={styles.image} />
        </View>
      </View>
      <View style={{ marginTop: 20 }}>
        <Text style={styles.title}>{post.title}</Text>
        <Text style={styles.subtitle}>{post.description}</Text>
      </View>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.buttonRadius} onPress={()=>navigation.navigate("PostActionScreen",post)}>
          <LinearGradient
            style={styles.gradient}
            colors={[colors["dark-gray"], colors.dark]}
          >
            <Ionicons
              name="create-outline"
              color={colors.light}
              size={SPACING * 2}
            ></Ionicons>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity style={styles.buttonRadius} onPress={()=>deletePost()}>
          <LinearGradient
            style={styles.gradient}
            colors={[colors["dark-gray"], colors.dark]}
          >
            <Ionicons
              name="trash-outline"
              color={colors.light}
              size={SPACING * 2}
            ></Ionicons>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* boton de volver */}

      <TouchableOpacity style={styles.backButton} onPress={()=>navigation.goBack()}>
        <Ionicons name="arrow-back-outline" color={"white"} size={40}/>
      </TouchableOpacity>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  imageContainer: {
    width: "100%",
    height: screenHeight * 0.7,
    borderBottomEndRadius: 25,
    borderBottomStartRadius: 25,
  },
  imageBorder: {
    flex: 1,
    overflow: "hidden",
    borderBottomEndRadius: 25,
    borderBottomStartRadius: 25,
  },
  image: {
    flex: 1,
  },
  title: {
    color: colors.light,
    fontSize: SPACING * 2,
    fontWeight: "bold",
  },
  subtitle: {
    color: colors.light,
  },
  backButton: {
    position: "absolute",
    top: 30,
    left: 5,
  },
  buttonsContainer: {
    marginVertical: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignposts: "center",
  },
  buttonRadius: {
    overflow: "hidden",
    borderRadius: SPACING / 2,
  },

  gradient: {
    paddingHorizontal: SPACING,
    paddingVertical: SPACING / 3,
  },
});

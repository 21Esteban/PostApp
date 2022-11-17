import {
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { SPACING } from "../config/space";
import { colors } from "../config/colors";
import axios from "axios";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Navigation } from "../navigation/Navigation";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";

import Ionicons from "@expo/vector-icons/Ionicons";
import Post from "../components/Post";

//seccion de logica

export default function PostScreen() {

  //esta variable la usamos para que el sistema sepa que estamos en la homeScreen o no

  const isFocused = useIsFocused()

  //Para recargar la pagina solo con subir el menu hacia arriba

  const [isRefreshing,setIsRefreshing] = useState(false)

  //hacemos el navigation para poder movernos entre paginas

  const navigation = useNavigation();

  //vamos a sacar el tamaño de nuestra pantalla

  const { top } = useSafeAreaInsets();

  //Vamos a guardar los post del backend en un estado

  const [post, setPost] = useState([]);

  //Hacemos el metodo para obtener los post en la pantalla de inicio

  const getPosts = async () => {
    try {
      const { data } = await axios.get("/post ");
      console.log(data);
      setPost(data.data);
    } catch (error) {
      console.log("Error en la funcion getPost", error.message);
    }
  };

  useEffect(() => {
  isFocused && getPosts();
  }, [isFocused]);

  //Funcion para refrescar 

const onRefresh = useCallback(async()=>{
  setIsRefreshing(true)
   await getPosts() 
   setIsRefreshing(false)
},[])

  //seccion de diseño

  return (
    <>
      <View style={{ ...styles.container, top: top + 20 }}>
        <Text style={styles.title}>Quiz</Text>
        <Text style={styles.subtitle}>posts</Text>

        <TouchableOpacity
          style={{ ...styles.button, top: top }}
          onPress={() => navigation.navigate("PostActionScreen")}
        >
          <LinearGradient
            style={styles.gradient}
            colors={[colors["dark-gray"], colors.dark]}
          >
            <Ionicons
              name="add-circle-outline"
              color={colors.light}
              size={30}
            ></Ionicons>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Que nos aparezcan todos los post con el componente que hicimos llamado post */}

      <FlatList
        data={post}
        renderItem={({ item }) => <Post post={item} />}
        keyExtractor={(item) => item._id.toString()}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={isRefreshing}
        onRefresh={onRefresh}
        colors={[colors.light]}
        progressBackgroundColor={colors["dark-gray"]}/>
      }
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 60,
  },
  title: {
    color: colors.white,
    fontSize: SPACING * 5,
    fontWeight: "700",
  },
  subtitle: {
    color: colors.light,
    marginTop: SPACING / 2,
  },
  button: {
    overflow: "hidden",
    borderRadius: 5,
    position: "absolute",
    right: 0,
  },
  gradient: {
    paddingHorizontal: SPACING,
    paddingVertical: SPACING / 3,
  },
});

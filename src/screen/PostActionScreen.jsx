import {
  ActivityIndicator,
  Button,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { colors } from "../config/colors";
import { SPACING } from "../config/space";
import * as ImagePicker from "expo-image-picker";
import * as yup from "yup";
import { Formik } from "formik";
import FormContainer from "../components/Form/FormContainer";
import FormInput from "../components/Form/FormInput";
import FormSubmitButton from "../components/Form/FormSubmitButton";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";

//Esquema de validacion para validar nuestras imagenes

const ValidationSchema = yup.object({
  title: yup
    .string()
    .trim()
    .min(3, "Titulo invalido")
    .required("El titulo es obligatorio"),
  description: yup.string().trim().min(3, "Descripcion invalida"),
});

export default function PostActionScreen({ route }) {
  const post = route.params;
  const [image, setImage] = useState(post?.imgUrl || null);
  const [isloadin, setIsLoading] = useState(false);

  const navigation = useNavigation();

  const postInfo = {
    title: post?.title || "",
    description: post?.description || "",
  };

  //funcion para escoger una imagen de nuestro dispositivo movil

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      // aspect: [4, 3],  //aspecto de nuestar imagen
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const savePost = async (formData) => {
    try {
      setIsLoading(true)
      await axios.post("/post", formData, {
        headers: {
          Accept: "application/json",
          "Content-Type": "multipart/form-data",
        },
      });
      setIsLoading(false)
      
    } catch (error) {
      setIsLoading(false)
      console.log("Error en savePost", error.message);
    }
  };

  //Actualizar

  const updatePost = async (formData) => {
    try {
      setIsLoading(true)

      await axios.put(`/post/${post._id}`, formData, {
        headers: {
          Accept: "application/json",
          "Content-Type": "multipart/form-data",
        },
      });
      setIsLoading(false)

    } catch (error) {
      setIsLoading(false)

      console.log("Error en UpdatePost", error.message);
    }
  };

  const actions = async (values, formikActions) => {
    const { title, description } = values;

    const formData = new FormData();
    if (post) {
      if (post.imgUrl !== image) {
        formData.append("img", {
          name: "generico.jpg",
          uri: image,
          type: "image/jpg",
        });
      }
    } else {
      if (image) {
        formData.append("img", {
          name: "generico.jpg",
          uri: image,
          type: "image/jpg",
        });
      }
    }

    formData.append("title", title);
    formData.append("description", description);


    post ? await updatePost(formData) : await savePost(formData);

    formikActions.resetForm();
    formikActions.setSubmitting(false);
    navigation.goBack();
  };

  if (isloadin) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator color="red" size={80} />
      </View>
    );
  }


  return (
    <>
      <View style={styles.container}>
        <FormContainer>
          <Formik
            initialValues={postInfo}
            validationSchema={ValidationSchema}
            onSubmit={actions}
          >
            {({
              values,
              errors,
              touched,
              isSubmitting,
              handleChange,
              handleBlur,
              handleSubmit,
            }) => {
              const { title, description } = values;
              return (
                <>
                  <FormInput
                    value={title}
                    error={touched.title && errors.title}
                    onChangeText={handleChange("title")}
                    onBlur={handleBlur("titulo")}
                    label="Titulo"
                    placeholder="Titulo"
                  />

                  <FormInput
                    value={description}
                    error={touched.description && errors.description}
                    onChangeText={handleChange("description")}
                    onBlur={handleBlur("description")}
                    label="Description"
                    placeholder="Description"
                  />

                  {/* Imagen */}
                  <View>
                    <TouchableOpacity
                      style={styles.uploadBtnContainer}
                      onPress={() => pickImage()}
                    >
                      {image ? (
                        <Image
                          source={{ uri: image }}
                          style={{ width: "100%", height: "100%" }}
                        />
                      ) : (
                        <Text style={styles.uploadBtn}>Seleccionar Imagen</Text>
                      )}
                    </TouchableOpacity>
                  </View>

                  <Button
                    submitting={isSubmitting}
                    onPress={handleSubmit}
                    title={post ? "actualizar" : "Guardar"}
                  />
                </>
              );
            }}
          </Formik>
        </FormContainer>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: SPACING * 2,
  },

  uploadBtnContainer: {
    height: 125,
    width: 125,
    borderRadius: 60,
    borderColor: colors.light,
    justifyContent: "center",
    alignItems: "center",
    borderStyle: "dashed",
    borderWidth: 1,
    overflow: "hidden",
    marginVertical: 10,
    // marginLeft: 100,
  },
  uploadBtn: {
    textAlign: "center",
    fontSize: 16,
    opacity: 0.3,
    fontWeight: "bold",
    color: colors.light,
  },
  backButton: {
    position: "absolute",
    top: 30,
    left: 5,
  },
});

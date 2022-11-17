import { Dimensions, KeyboardAvoidingView, StyleSheet, Text, View } from 'react-native'


export default function FormContainer({children}) {
  return (
    <KeyboardAvoidingView enabled behavior={Platform.OS==="ios"?"padding":"null"} style={styles.container}>
      {children}
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({

    container: {
        width: Dimensions.get("window").width,
        paddingHorizontal: 20,
        },
})
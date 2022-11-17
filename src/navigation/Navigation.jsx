//paquete de navegacion

import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { colors } from "../config/colors"
import { SPACING } from "../config/space"
import DetailScreen from "../screen/DetailScreen"
import PostActionScreen from "../screen/PostActionScreen"
import PostScreen from "../screen/PostScreen"

const Stack = createNativeStackNavigator()

export const Navigation=()=>{
    return(
        <Stack.Navigator
        screenOptions={{headerShown:false, contentStyle:{paddingHorizontal:SPACING*2,
        flex:1,
        backgroundColor:colors.black}}}>
            <Stack.Screen name="HomeScreen" component={PostScreen}/>
            <Stack.Screen name="DetailScreen" component={DetailScreen}/>
            <Stack.Screen name="PostActionScreen" component={PostActionScreen}/>
        </Stack.Navigator>
    )
}

//Aqui le estamos dando por asi decirlo las rutas para poder movernos mas adelante sobre las pantallas o screens, luego de eso vamos y renderizamos <NavigationContainer> en el app.js 
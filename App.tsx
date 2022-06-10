import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { createContext, useState } from 'react'
import HomeScreen from './src/screens/HomeScreen';
import MainScreen from './src/screens/MainScreen';

type GlobalType={
  emailUser:string,
  setEmailUser:any
}

export const GlobalContext=React.createContext<GlobalType>({
  emailUser:"",
  setEmailUser:function(){}
})
const Stack = createNativeStackNavigator();



const App = () => {
  const [emailUser, setEmailUser] = useState('')

  const data={
    emailUser,
    setEmailUser
  }
  
  return (
<GlobalContext.Provider value={data}>
    <NavigationContainer>
       <Stack.Navigator>
        <Stack.Screen
          name="HomeScreen"
          component={HomeScreen}
          options={{ title: 'Welcome' }}
        />
        <Stack.Screen
          name="MainScreen"
          component={MainScreen}
          options={{ title: 'App Screen', headerShown:false}}
          
        />
        
      </Stack.Navigator>

  </NavigationContainer>
  </GlobalContext.Provider>
  )
}

export default App

















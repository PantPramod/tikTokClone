import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, {  useEffect, useState } from 'react'
import HomeScreen from './src/screens/HomeScreen';
import MainScreen from './src/screens/MainScreen';

type GlobalType={
  emailUser:string,
  saveEmailUser:any
}

export const GlobalContext=React.createContext<GlobalType>({
  emailUser:"",
  saveEmailUser:function(){}
})
const Stack = createNativeStackNavigator();



const App = () => {
  const [emailUser, setEmailUser] = useState('')

  const saveEmailUser=(email:string)=>{
       setEmailUser(email)
      //  storeData(email)

  }

  const storeData = async (value:string) => {
    try {
      await AsyncStorage.setItem('@email', value)
    } catch (e) {
      // saving error
    }
  }

  

  const data={
    emailUser,
    saveEmailUser
  }
  
  
  return (
<GlobalContext.Provider value={data}>
    <NavigationContainer>
      
       <Stack.Navigator >
        
        <Stack.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{ title: 'Welcome',
        headerStyle: {
          backgroundColor: 'blue',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
        
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

















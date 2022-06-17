import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react'
import HomeScreen from './src/screens/HomeScreen';
import MainScreen from './src/screens/MainScreen';
import SplashScreen from 'react-native-splash-screen'
import UserProfile from './src/components/UserProfile';
import AnimationTest from './src/components/AnimationTest';


type GlobalType = {
  emailUser: string,
  saveEmailUser: any,
  dp: string,
  saveDp: any

}

export const GlobalContext = React.createContext<GlobalType>({
  emailUser: "",
  saveEmailUser: function () { },
  dp: "",
  saveDp: () => { }

})
const Stack = createNativeStackNavigator();



const App = () => {


  const [emailUser, setEmailUser] = useState<any>(null)
  const [dp, setDp] = useState('');

  const saveEmailUser = (email: string) => {
    setEmailUser(email)

  }

  useEffect(() => {
    SplashScreen.hide();
  }, [])



  const saveDp = (value: string) => {
    setDp(value);
  }

  const data = {
    emailUser,
    saveEmailUser,
    dp,
    saveDp,

  }

  useEffect(() => {
    const getEmail = async () => {
      try {
        const email = await AsyncStorage.getItem('email')
        const dp = await AsyncStorage.getItem('dp')
        if (email !== null) {
          setEmailUser(email);
        }
        if (dp !== null) {
          setDp(dp)
        }
      } catch (e) {
        // error reading value
      }
    }
    getEmail();
  }, [])

  
  return (
    <GlobalContext.Provider value={data}>
      <NavigationContainer>

        <Stack.Navigator >

          {!emailUser &&
            <Stack.Screen
              name="HomeScreen"
              component={HomeScreen}
              options={{
                title: 'Welcome',
                headerStyle: {
                  backgroundColor: 'blue',
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                  fontWeight: 'bold',
                },
              }}
            />
          }
          <Stack.Screen
            name="MainScreen"
            component={MainScreen}
            options={{ title: 'App Screen', headerShown: false }}
          />

          <Stack.Screen
            name="UserProfile"
            component={UserProfile}
            options={{ title: 'User Profile', headerShown: false }}
          />
        </Stack.Navigator>

      </NavigationContainer>
    </GlobalContext.Provider>
  )
}

export default App

















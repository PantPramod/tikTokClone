import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react'
import HomeScreen from './src/screens/HomeScreen';
import MainScreen from './src/screens/MainScreen';
import SplashScreen from 'react-native-splash-screen'
import UserProfile from './src/components/UserProfile';
import TikTokScroller from './src/components/TikTokScroller';

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
  const [emailUser, setEmailUser] = useState('')
  const [dp, setDp] = useState('');

  const saveEmailUser = (email: string) => {
    setEmailUser(email)
    //  storeData(email)

  }

  useEffect(() => {
    SplashScreen.hide();
  }, [])

  const storeData = async (value: string) => {
    try {
      await AsyncStorage.setItem('@email', value)
    } catch (e) {
      // saving error
    }
  }

  const saveDp = (value: string) => {
    setDp(value);
  }

  const data = {
    emailUser,
    saveEmailUser,
    dp,
    saveDp
  }


  return (
    <GlobalContext.Provider value={data}>
      <NavigationContainer>

        <Stack.Navigator >

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
          <Stack.Screen
            name="MainScreen"
            component={MainScreen}
            options={{ title: 'App Screen', headerShown: false }}
          />

          <Stack.Screen
            name="UserProfile"
            component={UserProfile}
            options={{ title: 'User Profile', headerShown: true }}
          />

          <Stack.Screen
            name="TikTokScroller"
            component={TikTokScroller}
            options={{ title: 'TikTokScroller', headerShown: false }}
          />
        </Stack.Navigator>

      </NavigationContainer>
    </GlobalContext.Provider>
  )
}

export default App

















import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react'
import HomeScreen from './src/screens/HomeScreen';
import MainScreen from './src/screens/MainScreen';
import SplashScreen from 'react-native-splash-screen'
import UserProfile from './src/components/UserProfile';
import { Alert, Button, Dimensions, FlatList, StatusBar, Text, TextInput, View } from 'react-native';
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

//for practice

type ListType={
  list:string[]
}
const [list, setList] = useState<ListType["list"]>(["newItem", "hgjgj", "hhfdd", "hjghhg"])
const [item, setItem] = useState("");


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
  // <View style={{flex:1 , alignItems:"center"}}>


  //           <View style={{  padding:10, width:"80%", height:90, overflow:"hidden"}}>
  //           <TextInput 
  //           placeholder='Enter Item name' 
  //           style={{borderWidth:1, borderRadius:4}}
  //           onSubmitEditing={()=>setList((prevList)=>[...prevList,item])}
  //           onChangeText={(i)=>setItem(i)}
  //           value={item}
  //           />
  //           <Button title="Enter" onPress={()=>setList((prevList)=>[...prevList,item])}/>
  //           </View>

 
  //       <FlatList
  //       data={list}
  //       renderItem={ ({ item }) => (
  //        <View style={{flex:1, height:Dimensions.get('window').height-24, width:Dimensions.get('window').width, borderWidth:1}}>
  //        <Text>{item}</Text>
  //        </View>
  //       )}
  //       keyExtractor={item => item}
  //       pagingEnabled={true}
  //       onScroll={(e)=>{
        
  //         let newPageNum: any = e.nativeEvent.contentOffset.y / ((Dimensions.get('window').height-100-24)  );
  //         console.warn(parseInt( newPageNum))
        
  //       }}
  //       onScrollEndDrag={()=>{
  //         console.log('jhjhjhjhjhjhjhj')
  //       }

  //       }
        
  //     />
  
  // </View>
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

















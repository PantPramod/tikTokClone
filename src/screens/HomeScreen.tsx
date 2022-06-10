import React, { useState, useEffect, useContext } from 'react';
import { Image, TouchableOpacity, Text, ScrollView, View, TextInput, Button, StyleSheet, Alert } from 'react-native';
import auth, { firebase } from '@react-native-firebase/auth';
import { GlobalContext } from '../../App';

const HomeScreen = (props:any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState('login');
  const {emailUser, setEmailUser}= useContext(GlobalContext)


  const ClickHandler = () => {
 
   if(!email || !password){
     Alert.alert("Entar valid email and password");
   }
else{
  if(mode==="login"){
    
     auth()
    .signInWithEmailAndPassword(email, password)
    .then((data)=>{
      console.log("data------->",data)
       setEmailUser(email)
      // Alert.alert('SignIn Successfully');
      props.navigation.navigate('MainScreen')
    })
    .catch((err)=>{
      // Alert.alert("Error")
      console.log("err code---->",err.code)
    })
  }else{
    auth()
      .createUserWithEmailAndPassword(email, password)
      .then((data) => {
        setEmailUser(email);
        const update = {
          displayName: email,
        }
        auth().currentUser?.updateProfile(update)
        Alert.alert('new user created')
        console.log("data--->", data)
        props.navigation.navigate('MainScreen')

      })
      .catch(error => {
      // Alert.alert("Error")
      console.log(error)
      });
    }
  }
  }


  return (
    <View style={style.container}>


      {mode === 'login' ?
        <Text style={style.header}>Login Form</Text> :
        <Text style={style.header}>Registeration Form</Text>
      }

      <TextInput
        placeholder="Enter Your Email"
        onChangeText={newText => setEmail(newText)}
        defaultValue={email}
        style={style.input}
      />
      <TextInput
        placeholder="Enter Your password"
        style={style.input}
        defaultValue={password}
        onChangeText={newText => setPassword(newText)}
        secureTextEntry={true}
      />

      <Button
        color="skyblue"
        title={mode==="login"?'login':'Register'}
        onPress={ClickHandler} />
      {mode === "login" &&
        <TouchableOpacity
          onPress={() =>{ setMode("register"); setEmail(''); setPassword('')}}
        >
          <Text style={style.info}>Click Here To Register</Text>
        </TouchableOpacity>
      }
      {mode === "register" &&
        <TouchableOpacity
          onPress={() => {setMode("login"); setEmail(''); setPassword('')}}
        >
          <Text style={style.info}>Already Registered Click Here To Login</Text>
        </TouchableOpacity>
      }

    </View>
  )
}

const style = StyleSheet.create({
  Wrapper: {
    backgroundColor: "white"
  },
  header: {
    fontSize: 20,
    textAlign: 'center',
    fontWeight: 'bold',
    padding: 10,
    marginBottom: 30
  },
  input: {
    fontSize: 20,
    borderColor: "black",
    borderWidth: 1,
    borderRadius: 6,
    width: "100%",
    marginLeft: "auto",
    marginRight: "auto",
    padding: 10,
    marginBottom: 30,

  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "white",
    height: "100%"

  },

  info: {
    color: "skyblue",
    marginTop: 10,
    textAlign: 'center'
  }
})


export default HomeScreen;  
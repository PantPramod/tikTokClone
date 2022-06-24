import React, { useState, useEffect, useContext, useRef } from 'react';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { GlobalContext } from '../../App';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Text,
  LogBox,
  View,
  StyleSheet,
  Alert,
  ImageBackground,
  Dimensions,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import Input from '../components/Input';
import Button from '../components/Button';


const windowHeight = Dimensions.get('screen').height

LogBox.ignoreLogs([
  "exported from 'deprecated-react-native-prop-types'.",
])

const HomeScreen = (props: any) => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState('login');
  const { saveEmailUser, saveDp } = useContext(GlobalContext)

  const ClickHandler = async () => {
    if (!email || !password) {
      Alert.alert("Entar valid email and password");
    }
    else {
      if (mode === "login") {

        await auth()
          .signInWithEmailAndPassword(email, password)
          .then(async (data) => {
            console.log("data===>", data.user);
            saveEmailUser(email);
            saveDp(data.user.photoURL);

            await AsyncStorage.setItem('email', email)
            await AsyncStorage.setItem('dp', data.user.photoURL ? data.user.photoURL : '')
            await AsyncStorage.setItem('uid', data.user.uid)
            await props.navigation.navigate('MainScreen')
          })
          .catch((err) => {
            console.log("err code---->", err.code)
          })
      } else {
        await auth()
          .createUserWithEmailAndPassword(email, password)
          .then(async (data) => {
            saveEmailUser(email);
         
            await firestore()
              .collection('Users')
              .doc(data.user.uid)
              .set({
                email: email,
                password: password,
               })
              .then(() => {
                console.log('User added to firestore db');
              });
            await AsyncStorage.setItem('uid', data.user.uid)   
            await AsyncStorage.setItem('email', email)
            await AsyncStorage.setItem('dp', data.user.photoURL ? data.user.photoURL : '')
            await props.navigation.navigate('MainScreen')

          })
          .catch(error => {
            console.log("error==>", error)
          });
      }
    }
  }

  const changeModeToRegister = () => {
    setMode("register");
    setEmail('');
    setPassword('');
  }
  const changeModeToLogin = () => {
    setMode("login");
    setEmail('');
    setPassword('');
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={style.container}>
      <ImageBackground
        style={style.container}
        source={{ uri: "https://firebasestorage.googleapis.com/v0/b/tiktokclone-4cf36.appspot.com/o/images%2F358800.jpg?alt=media&token=e9e3f40e-39ba-4263-8498-374c06d147ed" }}>
        {mode === 'login' ?
          <Text style={style.header}>Login Form</Text> :
          <Text style={style.header}>Registeration Form</Text>
        }

        <Input
          placeholder='Enter Your Email'
          setValue={setEmail}
          value={email}
          style={style.input}

        />
        <Input
          placeholder="Enter Your password"
          style={style.input}
          value={password}
          setValue={setPassword}
          secureTextEntry
          onSubmitEditing={() => ClickHandler()}
        />


        <Button clickHandler={ClickHandler} style={style.btn}>
          {mode === "login" ?
            <Text style={style.btnText}>Login</Text> :
            <Text style={style.btnText}>Register</Text>}
        </Button>

        {mode === "login" &&
          <Button clickHandler={changeModeToRegister}>
            <Text style={style.info}>Click Here To Register</Text>
          </Button>
        }

        {mode === "register" &&
          <Button clickHandler={changeModeToLogin}>
            <Text style={style.info}>Already Registered </Text>
          </Button>
        }
      </ImageBackground>
    </KeyboardAvoidingView>
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
    marginBottom: 30,
    color: "blue"
  },
  input: {
    fontSize: 20,
    borderColor: "#2c2a2aa6",
    borderWidth: 2,
    borderRadius: 10,
    width: "90%",
    marginLeft: "auto",
    marginRight: "auto",
    padding: 10,
    marginBottom: 30,

  },
  container: {
    flex: 1,
    backgroundColor: "white",
    height: "100%",
    bottom: windowHeight,
    left: 0,
    right: 0,
    top: 0,
    position: "absolute",
    resizeMode: "cover",

  },

  info: {
    color: "blue",
    marginTop: 20,
    textAlign: 'center',
    fontSize: 18
  },
  btn: {
    backgroundColor: "blue",
    borderRadius: 10,
    padding: 10,
    width: "90%",
    marginLeft: "auto",
    marginRight: "auto"
  },
  btnText: {
    fontSize: 20,
    color: "white",
    textAlign: "center"
  }

})


export default HomeScreen;  
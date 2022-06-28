import React, { useState, useContext } from 'react';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { GlobalContext } from '../../App';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Text,
  LogBox,
  StyleSheet,
  Alert,
  ImageBackground,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  View,
  TextInput,
  TouchableOpacity
} from 'react-native';
import Input from '../components/Input';
import Button from '../components/Button';
import { useForm, Controller } from 'react-hook-form';

type dataType = {
  email: string,
  password: string
}

const windowHeight = Dimensions.get('screen').height

LogBox.ignoreLogs([
  "exported from 'deprecated-react-native-prop-types'.",
])

const HomeScreen = (props: any) => {

  const [mode, setMode] = useState('login');
  const { saveEmailUser, saveDp } = useContext(GlobalContext)
  const { register, setValue, handleSubmit, control, reset,setError, formState: { errors } } = useForm({
    defaultValues: {
      email: '',
      password: ''
    }
  });
  const onSubmit = (data: dataType) => {
    console.log(data);
    ClickHandler(data.email, data.password);
  };

 
  console.log('errors', errors);

  const ClickHandler = async (email: string, password: string) => {
 
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
          await reset({
            email: '',
            password: ''
          })
          await props.navigation.navigate('MainScreen')
        })
        .catch((err) => {
          console.log("err code---->", err.code)
          setError('email', { type: 'server', message: 'Wrong Email' });
          setError('password', { type: 'server', message: 'Wrong Password' });
          
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
          await reset({
            email: '',
            password: ''
          })
          await props.navigation.navigate('MainScreen')

        })
        .catch(error => {
          console.log("error==>", error)
          setError('email', { type: 'server', message: 'Authentication failed' });
          setError('password', { type: 'server', message: 'Authentication failed' });
 
    
        });
    }
  }

  const changeModeToRegister = () => {
    setMode("register");
 
  }
  const changeModeToLogin = () => {
    setMode("login");
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



        {errors.email?.type==="required" && <Text style={{ color: "red", paddingLeft:20, paddingBottom:10}}>Email is required.</Text>}
        {errors.email?.type==="server" && <Text style={{ color: "red", paddingLeft:20, paddingBottom:10}}>{errors.email.message}</Text>}
    
        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              placeholder='Enter Your Email'
              setValue={value => onChange(value)}
              value={value}
              style={style.input}
            />
          )}
          name="email"
          rules={{ required: true }}
        />
        
        {errors.password?.type==="required" && <Text style={{ color: "red" , paddingLeft:20, paddingBottom:10}}>Password is required.</Text>}
        {errors.password?.type==="server" && <Text style={{ color: "red", paddingLeft:20, paddingBottom:10}}>{errors.password.message}</Text>}
    
        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              placeholder="Enter Your password"
              style={style.input}
              value={value}
              setValue={value => onChange(value)}
              secureTextEntry
              onSubmitEditing={handleSubmit(onSubmit)}
            />
          )}
          name="password"
          rules={{ required: true }}
        />
       





        <Button clickHandler={handleSubmit(onSubmit)} style={style.btn}>
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
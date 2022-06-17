import { useIsFocused } from '@react-navigation/native';
import React, { useContext, useEffect, useRef, useState } from 'react'
import { ActivityIndicator, Button, Dimensions, KeyboardAvoidingView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { Camera, useCameraDevices } from 'react-native-vision-camera';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import { GlobalContext } from '../../App';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import VideoPlayer from 'react-native-video-player';
import SoundPlayer from 'react-native-sound-player'
import Ionicons from 'react-native-vector-icons/Ionicons';
import Sound from 'react-native-sound';
import { createThumbnail } from "react-native-create-thumbnail";
import AsyncStorage from '@react-native-async-storage/async-storage';


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;


const VideoScreen = () => {
  const [isrecording, setIsRecording] = useState(false)
  const [isBack, setIsBack] = useState(true)
  const [showRecordedVideo, setShowRecordedVideo] = useState(false);
  const [videoUrl, setVideoUrl] = useState<any>({})
  const [loading, setLoading] = useState(false)
  const [title, setTitle] = useState('');
  const [emailUser, setEmailUser] = useState('');
  const [dp, setDp] = useState('')

  const camera = useRef<Camera>(null)
  
  const devices = useCameraDevices()
  
  const device = isBack ? devices.back : devices.front;
  
  const isAppForeground = useIsFocused()
  
  // const {  dp } = useContext(GlobalContext)


  useEffect(() => {
    const permission = async () => {
      await Camera.requestCameraPermission()
      await Camera.requestMicrophonePermission()
    }
    permission();
    const getEmail = async () => {
      try {
        const email = await AsyncStorage.getItem('email')
        const dp = await AsyncStorage.getItem('dp')
        if(email !== null) {
               setEmailUser(email);
        }
        if(dp!==null){
          setDp(dp);
        }
      } catch(e) {
        // error reading value
      }
    }
    getEmail();
  }, [])

  const StartRecording = () => {
    setIsRecording(true)
    camera?.current?.startRecording({
      onRecordingFinished: (video) => {
        setVideoUrl(video)
        setShowRecordedVideo(true)
      },
      onRecordingError: (error) => console.error("error----->", error),
    })
  }

  const stopRecording = () => {
    setIsRecording(false)
    camera?.current?.stopRecording();
  }

  const saveVideoToDataBase = async () => {
    const num = new Date().toISOString();
    const reference = storage().ref(`/videos/${num}`);
    const pathToFile = `${videoUrl.path}`;
    await reference.putFile(pathToFile);
    setLoading(true)
    const url = await storage().ref(`/videos/${num}`).getDownloadURL();
    const thumbnailofVideo =await createThumbnail({
      url: url,
      timeStamp: 10000,
    })

    const imageReference = storage().ref(`/images/${num}`);
    const imagePathToFile = `${thumbnailofVideo.path}`;
    await imageReference.putFile(imagePathToFile);
    const urlImage = await storage().ref(`/images/${num}`).getDownloadURL();
    console.log("thumbnailofVideo=====>", urlImage)
    
    await firestore()
      .collection('UserData')
      .add({
        title: title,
        email: emailUser,
        url: url,
        likes: [],
        comments: [],
        dp:dp,
        thumbnail:urlImage        
      })
      .then(() => {
        console.log('User video Url added!');
        setLoading(false)
      });

    console.log("Url====>", url)
      
  }

  


  if (device == null) return <View ><Text>Loading</Text></View>

  return (
    <>
      {!showRecordedVideo &&

        <>
          <Camera
            style={StyleSheet.absoluteFill}
            device={device}
            isActive={isAppForeground}
            video={true}
            audio={true}
            ref={camera}
            zoom={1}
          />
          {!isrecording &&
            <View style={styles.cameraMode}>
              <TouchableOpacity onPress={() => setIsBack(!isBack)}>
                <FontAwesome5Icon name={"camera"} color={"rgba(255, 255, 255,1)"} style={{ textAlign: "center", fontSize: 25 }} />
              </TouchableOpacity>
            </View>
          }

          <View style={styles.button}>
            {!isrecording ? <TouchableOpacity onPress={StartRecording} style={{ width: "100%" }}>
              <Text style={{ textAlign: "center", color: "white", padding: 10 }}>Start</Text>
            </TouchableOpacity> :
              <TouchableOpacity onPress={stopRecording} style={{ width: "100%" }}>
                <Text style={{ textAlign: "center", color: "red", padding: 10 }}>Stop</Text>
              </TouchableOpacity>}
          </View>
        </>
      }
      {
        showRecordedVideo &&
        <KeyboardAvoidingView style={{ backgroundColor: "black", flex: 1,  }}>
          {!loading && <>
         
          <TouchableOpacity
              disabled={loading ? true : false}
              onPress={() => setShowRecordedVideo(false)}
              style={{  }}

            >
              <Ionicons name="close" style={{ fontSize: 40, color: "white", textAlign:"right",  }} />
            </TouchableOpacity>
            <View style={{flexDirection:"row", alignItems:"center",padding:10, paddingBottom:20}}>
            <TextInput placeholder='Enter Title for Video'
              style={{
                backgroundColor: "white",
                width: "80%",
                marginLeft: "auto",
                marginRight: "auto",
                borderRadius: 10,
                
              }}
              value={title}
              onChangeText={(text) => setTitle(text)}
            />
              <TouchableOpacity
              disabled={loading ? true : false}
              onPress={() => saveVideoToDataBase()}
              style={{  }}
            >
              <FontAwesome5Icon name="save" style={{ fontSize: 40, color: "white" }} />
            </TouchableOpacity>
            </View>
          
            <VideoPlayer
              video={{ uri: videoUrl.path }}
              // videoWidth={windowWidth}
              // videoHeight={windowHeight - 220}
              thumbnail={{ uri: 'https://source.unsplash.com/100x100/?nature,water1' }}
              pauseOnPress={true}
              autoplay={true}
              style={{ width: windowWidth, height: 400 }}
            />

          </>
          }
          
          {loading && <ActivityIndicator size="large" color="white" />}
        </KeyboardAvoidingView>
      }
    </>
  )
}

export default VideoScreen

var styles = StyleSheet.create({
  button: {
    backgroundColor: "transparent",
    position: "absolute",
    bottom: 10,
    left: "50%",
    width: 70,
    height: 70,
    display: "flex",
    alignItems: 'center',
    justifyContent: "center",
    borderWidth: 4,
    borderColor: "white",
    transform: [{ translateX: -35 }], borderRadius: 50
  }
  ,
  cameraMode: {
    position: "absolute",
    right: 20,
    top: 20
  },

});


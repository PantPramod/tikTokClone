import { useIsFocused } from '@react-navigation/native';
import React, { useContext, useEffect, useRef, useState } from 'react'
import { ActivityIndicator, Button, Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { Camera, useCameraDevices } from 'react-native-vision-camera';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import { GlobalContext } from '../../App';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import VideoPlayer from 'react-native-video-player';
import SoundPlayer from 'react-native-sound-player'
import Ionicons from 'react-native-vector-icons/Ionicons';
import Sound from 'react-native-sound';


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;


const VideoScreen = () => {
  const [isrecording, setIsRecording] = useState(false)
  const [isBack, setIsBack] = useState(true)
  const [showRecordedVideo, setShowRecordedVideo] = useState(false);
  const [videoUrl, setVideoUrl] = useState<any>({})
  const [loading, setLoading] = useState(false)

  const camera = useRef<Camera>(null)
  const devices = useCameraDevices()
  const device = isBack ? devices.back : devices.front;
  const isAppForeground = useIsFocused()
  const { emailUser } = useContext(GlobalContext)


  useEffect(() => {
    const permission = async () => {
      await Camera.requestCameraPermission()
      await Camera.requestMicrophonePermission()
    }
    permission();

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

    firestore()
      .collection('UserData')
      .add({
        email: emailUser,
        url: url,
        likes: 0,
        comments:[]
        // date: new Date().toDateString()
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
        <View style={{ backgroundColor: "black", flex: 1, justifyContent: "center" }}>
          {!loading && <VideoPlayer
            video={{ uri: videoUrl.path }}
            videoWidth={windowWidth}
            videoHeight={windowHeight - 220}
            thumbnail={{ uri: 'https://source.unsplash.com/100x100/?nature,water1' }}
            pauseOnPress={true}
            autoplay={true}

          />}
          <View style={{ flexDirection: "row", alignItems: 'center', justifyContent: "space-evenly", width: "100%", position: "absolute", top: 10 }}>
            <TouchableOpacity
              disabled={loading ? true : false}
              onPress={() => setShowRecordedVideo(false)}
              style={{ right: 10, top: 10, position: "absolute" }}

            >
              <FontAwesome5Icon name="window-close" style={{ fontSize: 40, color: "white" }} />
            </TouchableOpacity>
            <TouchableOpacity
              disabled={loading ? true : false}
              onPress={() => saveVideoToDataBase()}
              style={{ left: 10, top: 10, position: "absolute" }}
            >
              <FontAwesome5Icon name="save" style={{ fontSize: 40, color: "white" }} />
            </TouchableOpacity>
          </View>


          {loading && <ActivityIndicator size="large" color="white" />}
        </View>
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


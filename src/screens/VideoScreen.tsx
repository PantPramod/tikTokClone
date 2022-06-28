import { useIsFocused } from '@react-navigation/native';
import React, { useContext, useEffect, useRef, useState } from 'react'
import { ActivityIndicator, Dimensions, KeyboardAvoidingView, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { Camera, useCameraDevices } from 'react-native-vision-camera';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import { GlobalContext } from '../../App';
import VideoPlayer from 'react-native-video-player';
import { createThumbnail } from "react-native-create-thumbnail";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from '../components/Icon';
import Input from '../components/Input';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

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
        if (email !== null) {
          setEmailUser(email);
        }
        if (dp !== null) {
          setDp(dp);
        }
      } catch (e) {

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
    setLoading(true)
    const num = new Date().toISOString();
    const reference = storage().ref(`/videos/${num}`);
    const pathToFile = `${videoUrl.path}`;
    await reference.putFile(pathToFile);
    const url = await storage().ref(`/videos/${num}`).getDownloadURL();
    const thumbnailofVideo = await createThumbnail({
      url: url,
      timeStamp: 10000,
    })

    const imageReference = storage().ref(`/images/${num}`);
    const imagePathToFile = `${thumbnailofVideo.path}`;
    await imageReference.putFile(imagePathToFile);
    const urlImage = await storage().ref(`/images/${num}`).getDownloadURL();

    await firestore()
      .collection('UserData')
      .add({
        title: title,
        email: emailUser,
        url: url,
        likes: [],
        comments: [],
        dp: dp,
        thumbnail: urlImage
      })
      .then(() => {
        console.log('User video Url added!');
        setLoading(false)
      });

  }




  if (device == null) return <View ><Text>Loading...</Text></View>

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

                <MaterialCommunityIcons
                  color={"white"}
                  style={styles.frontback}
                  name='camera-flip-outline'
                />

              </TouchableOpacity>
            </View>
          }

          <View style={styles.button}>
            {!isrecording ?
              <TouchableOpacity
                onPress={StartRecording}
                style={{ width: "100%" }}>
                <Text style={styles.start}>Start</Text>
              </TouchableOpacity>
              : <TouchableOpacity
                onPress={stopRecording}
                style={{ width: "100%" }}
              >
                <Text style={styles.stop}>Stop</Text>
              </TouchableOpacity>}
          </View>
        </>
      }
      {
        showRecordedVideo &&
        <Modal>
          <View style={styles.bg}>
            {!loading && <>

              <TouchableOpacity
                disabled={loading ? true : false}
                onPress={() => setShowRecordedVideo(false)}
              >
                <Icon
                  source='Ionicons'
                  name="close"
                  style={styles.close}
                />
              </TouchableOpacity>

              <View style={styles.box}>
                <Input
                  placeholder='Enter Title for Video'
                  style={styles.textInput}
                  value={title}
                  setValue={setTitle}
                  onSubmitEditing={() => { saveVideoToDataBase() }}
                />
                <TouchableOpacity
                  disabled={loading ? true : false}
                  onPress={() => saveVideoToDataBase()}
                >
                  <Icon
                    name='save'
                    source='FontAwesome5Icon'
                    style={{ fontSize: 40, color: "white" }}
                  />
                </TouchableOpacity>
              </View>

              <VideoPlayer
                video={{ uri: videoUrl.path }}
                thumbnail={{ uri: 'https://source.unsplash.com/100x100/?nature,water1' }}
                pauseOnPress={true}
                autoplay={true}
                style={styles.vdo}
              />
            </>
            }

            {loading &&
              <View style={{ height: windowHeight, justifyContent: "center" }}>
                <ActivityIndicator
                  size="large"
                  color="white"
                /></View>}
          </View>
        </Modal>
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
  frontback: {
    textAlign: "center",
    fontSize: 30
  },
  start: {
    textAlign: "center",
    color: "white",
    padding: 10
  },
  stop: {
    textAlign: "center",
    color: "red",
    padding: 10
  },
  close: {
    fontSize: 40,
    color: "white",
    textAlign: "right",
  },
  textInput: {
    backgroundColor: "white",
    width: "80%",
    marginLeft: "auto",
    marginRight: "auto",
    borderRadius: 10,

  },
  box: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    paddingBottom: 20
  },
  vdo: {
    width: windowWidth,
    height: 400
  },
  bg: {
    backgroundColor: "black",
    flex: 1
  }
});


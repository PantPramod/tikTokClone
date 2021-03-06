import React, { useContext, useEffect, useState } from 'react'
import { Image, TouchableOpacity, View, ScrollView, StyleSheet, Dimensions, ImageBackground, Alert, Modal, ActivityIndicator } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { GlobalContext } from '../../App';
import firestore from '@react-native-firebase/firestore';
import VideoPlayer from 'react-native-video-player';
import { launchImageLibrary } from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from '../components/Icon';
import TextComponent from '../components/TextComponent';
import EditScreen from './EditScreen';
import SelectImage from '../components/SelectImage';

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

const Profile = ({ navigation }: any) => {
  const [data, setData] = useState<any>([])
  const [image, setImage] = useState<any>(null)
  const [uploadProgress, setUploadProgress] = useState(0);
  const [emailUser, setEmailUser] = useState('');
  const [dp, setDp] = useState('')
  const [showEditProfile, setShowEditProfile] = useState(false);

  const { saveDp } = useContext(GlobalContext);
  const { saveEmailUser } = useContext<any>(GlobalContext)

  useEffect(() => {
    const getEmail = async () => {
      try {
        const email = await AsyncStorage.getItem('email')
        const dp = await AsyncStorage.getItem('dp')
        if (email !== null) {
          setEmailUser(email);
          console.log("email===>", email)
        }
        if (dp !== null) {
          setDp(dp)
          console.log("dp===>", dp)
        }
      } catch (e) {
        // error reading value
      }
    }
    getEmail();
  }, [])




  useEffect(() => {
    const getData = async () => {
      const userData = await firestore().collection('UserData').get();
      const filteredData = userData.docs.filter((item: any) => item._data.email === emailUser)
      setData(filteredData)
    }
    getData();
  })

  const selectImage = async () => {
    let options: any = {
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };

    launchImageLibrary(options, (res: any) => {
      console.log('Response = ', res);
      if (res.didCancel) {
        console.log('User cancelled image picker');
      } else if (res.error) {
        console.log('ImagePicker Error: ', res.error);
      } else if (res.customButton) {
        console.log('User tapped custom button: ', res.customButton);
        Alert.alert(res.customButton);
      } else {
        const source = { uri: res.uri };
        console.log('response====>', res.assets[0]);
        setImage(res.assets[0]);
      }
    });
  }

  const saveToFireBaseStorage = async (i: any) => {
    const num = new Date().toISOString();
    const reference = storage().ref(`/images/${num}`);
    const pathToFile = `${i}`;
    const task = reference.putFile(pathToFile);

    task.on('state_changed', taskSnapshot => {
      console.log(`${taskSnapshot.bytesTransferred} transferred out of ${taskSnapshot.totalBytes}`);
      setUploadProgress((taskSnapshot.bytesTransferred / taskSnapshot.totalBytes) * 100)
    });

    task.then(async () => {
      console.log('Image uploaded to the bucket!');
      const url = await storage().ref(`/images/${num}`).getDownloadURL();
      if (url) {
        const update = {
          photoURL: url,
        };
        await auth().currentUser?.updateProfile(update)

        setImage(null);
        setUploadProgress(0);
      }
      console.log("url====>", url)
      saveDp(url);
      try {
        await AsyncStorage.setItem('dp', url)
        setDp(url);
      } catch (e) {
        // saving error
      }
    });
  }

  const logoutHandler = async () => {

    const res = await AsyncStorage.clear();

    await saveEmailUser('')
    setEmailUser('');
    setDp('');
    await navigation.replace('HomeScreen')

  }
  return (<>
    <ScrollView style={style.container}>

      {image &&
        <SelectImage
          close={() => setImage(null)}
          image={image.uri}
          saveImage={() => saveToFireBaseStorage(image.uri)}
          uploadProgress={uploadProgress}
        />}

      <TextComponent
        size='mediumLarge'
        color='black'
        style={{ textAlign: "center", marginTop: 30 }}
      >
        Profile
      </TextComponent>
      <TouchableOpacity
        style={style.logout}
        onPress={logoutHandler}
      >
        <TextComponent style={{ fontSize: 16 }}>Logout</TextComponent>
      </TouchableOpacity>
      <View style={style.header}>

        <View style={style.avatar}>
          <ImageBackground
            source={{ uri: dp ? dp : "https://source.unsplash.com/100x100/?nature,mountain1" }}
            style={[style.avatar, { overflow: "hidden" }]}
          >
            {!dp && <FontAwesome5
              name={"user"}
              color={"rgb(255, 255, 255 )"}
              style={style.ico}
            />}
          </ImageBackground>
          <TouchableOpacity
            style={{
              backgroundColor: "#000000d3",
              borderColor: "white",
              borderWidth: 1,
              borderRadius: 7,
              marginTop: -30,
              marginLeft: 70
            }}
            onPress={() => selectImage()}
          >

            <Icon
              source='Ionicons'
              name="add"
              style={{ fontSize: 25 }}
              color="white"
            />

          </TouchableOpacity>
        </View>


      </View>
      <TextComponent style={style.name}>{emailUser}</TextComponent>

      <View style={style.info}>
        <View style={style.follow}>
          <TextComponent style={style.white}>4</TextComponent>
          <TextComponent style={style.white}>Followers</TextComponent>
        </View>
        <View style={style.follow}>
          <TextComponent style={style.white}>10</TextComponent>
          <TextComponent style={style.white}>Following</TextComponent>
        </View>
        <View style={style.follow}>
          <TextComponent style={style.white}>10</TextComponent>
          <TextComponent style=
            {style.white}>Likes</TextComponent>
        </View>
      </View>
      <View>
        <TouchableOpacity
          style={style.editProfile}
          onPress={() => { setShowEditProfile(true) }}>
          <TextComponent style={style.editProfileText}>Edit Profile</TextComponent>
        </TouchableOpacity>
      </View>
      {data.length === 0 &&
        <View style={{ marginTop: 20 }}>
          <ActivityIndicator
            size="large"
            color="#0000ff"
          />
        </View>}
      <View style={style.all}>
        {
          data &&
          data.map((item: any, index: number) =>
            <View
              style={{
                width: (screenWidth / 3) - 10,
                height: 210,
                display: "flex",
                alignItems: 'center',
                justifyContent: 'center'
              }}
              key={item._data.url}
            >
              <VideoPlayer
                key={item._data.url}
                video={{ uri: item._data.url }}
                thumbnail={{ uri: item._data.thumbnail }}
                resizeMode="cover"
                pauseOnPress={true}
                customStyles={{ controls: false, seekBar: false }}
                style={{ width: (screenWidth / 3) - 10, height: 200 }}
              />
            </View>
          )}
      </View>


    </ScrollView>
    {
      showEditProfile &&
      <EditScreen
        close={() => setShowEditProfile(false)}
        dp={dp}
        email={emailUser}
      />
    }
  </>

  )
}

export default Profile




const style = StyleSheet.create({
  container: {
    flex: 1
  },
  header: {
    display: "flex",
    alignItems: "center",
    padding: 10
  },

  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderColor: "white",
    // overflow: "hidden",
    alignItems: "center",
    justifyContent: "center"
  },
  ico: {
    fontSize: 50,
  },

  name: {
    color: "black",
    fontSize: 20,
    textAlign: "center"

  },
  white: {
    color: "black",
    textAlign: "center"
  },
  info: {
    marginTop: 10,
    marginLeft: "auto",
    marginRight: "auto",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    width: "90%",
    textAlign: "center"
  },

  follow: {
    padding: 20,
    paddingBottom: 0,
    paddingTop: 0,
  },
  img: {
    height: screenHeight,
    width: screenWidth,
  },
  editProfile: {
    borderWidth: 1,
    borderColor: "black",
    padding: 10,
    paddingLeft: 20,
    paddingRight: 20,
    marginTop: 10,
    marginBottom: 10,
    marginLeft: "auto",
    marginRight: "auto",
    borderRadius: 7,
  },
  editProfileText: {
    color: "black",
    textAlign: "center"
  },
  logout: {
    position: "absolute",
    right: 10,
    top: 10,
    borderRadius: 6,
    borderWidth: 1,
    padding: 10,
    paddingTop: 5,
    paddingBottom: 5
  },
  all: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-evenly"
  }
})
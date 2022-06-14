import React, { useContext, useEffect, useState } from 'react'
import { Image, TouchableOpacity, Text, View, ScrollView, TextInput, Button, StyleSheet, Dimensions, ImageBackground, InteractionManager, FlatList } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { GlobalContext } from '../../App';
import firestore from '@react-native-firebase/firestore';
import VideoPlayer from 'react-native-video-player';

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

const Profile = () => {
  const [data, setData] = useState<any>([])
  const { emailUser } = useContext(GlobalContext);


  useEffect(() => {
    const getData = async () => {
      const userData = await firestore().collection('UserData').get();
      const filteredData = userData.docs.filter((item: any) => item._data.email === emailUser)
      setData(filteredData)
    }
    getData();
  })




  return (<>
    <View style={style.container}>

      <Text style={{ fontSize: 20, color: "black", textAlign: "center", marginTop: 30 }}>Profile</Text>
      <View style={style.header}>
        <View style={style.avatar}>
          <ImageBackground
            source={{ uri: "https://source.unsplash.com/100x100/?nature,mountain1" }}
            style={style.avatar}
          >
            <FontAwesome5
              name={"user"}
              color={"rgb(255, 255, 255 )"}
              style={style.ico}
            />
          </ImageBackground>
        </View>

      </View>
      <Text style={style.name}>{emailUser}</Text>

      <View style={style.info}>
        <View style={style.follow}>
          <Text style={style.white}>4</Text>
          <Text style={style.white}>Followers</Text>
        </View>
        <View style={style.follow}>
          <Text style={style.white}>10</Text>
          <Text style={style.white}>Following</Text>
        </View>
        <View style={style.follow}>
          <Text style={style.white}>10</Text>
          <Text style={style.white}>Likes</Text>
        </View>
      </View>
      <View>
        <TouchableOpacity
          style={style.editProfile}
          onPress={() => { }}>
          <Text style={style.editProfileText}>Edit Profile</Text>
        </TouchableOpacity>
      </View>

      {
        data &&
        <FlatList
          data={data}
          numColumns={3}

          renderItem={({ item, index }) => (
            <View style={{ width: screenWidth / 3, height: 210, display: "flex", alignItems: 'center', justifyContent: 'center' }}>
              <VideoPlayer
                key={item._data.url}
                video={{ uri: item._data.url }}
                thumbnail={{ uri: `https://source.unsplash.com/100x100/?nature,water${index}` }}
                resizeMode="cover"
                pauseOnPress={true}
                customStyles={{ controls: false, seekBar: false }}
                style={{ width: (screenWidth / 3) - 10, height: 200 }}
              />
            </View>
          )}
          keyExtractor={item => item._data.url}
        />}

    </View>

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
    overflow: "hidden",
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
  }
})
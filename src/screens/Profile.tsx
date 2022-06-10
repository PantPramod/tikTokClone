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
      // console.log("userdata",userData.docs[0].ref.id)
      const filteredData = userData.docs.filter((item: any) => item._data.email === emailUser)
      setData(filteredData)
    }
    getData();
  },[])

  return (<>
    <View style={style.container}>
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
        <View style={style.nameandinfo}>
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
        </View>
      </View>
      <Text style={{ color: "white", textAlign: "center", padding: 10, borderTopWidth: 1, borderColor: "white" }}>My Videos</Text>
      <View style={{ }}>
        {
          data &&
          <FlatList
            data={data}
            style={{paddingBottom:100, marginBottom:100}}
            renderItem={({ item, index }) => (
              <VideoPlayer
                key={item._data.url}
                video={{ uri: item._data.url }}
                thumbnail={{ uri: `https://source.unsplash.com/100x100/?nature,water${index}` }}
                resizeMode="cover"
                pauseOnPress={true}
                customStyles={{ controls: false, seekBar: false }}
                style={{ marginLeft: "auto", marginRight: "auto", width: screenWidth - 30, height: screenHeight - 250, borderRadius: 10, overflow: "hidden", marginBottom: 50, }}
              />)}
            keyExtractor={item => item._data.url}
          />}
      </View>
    </View>

  </>

  )
}

export default Profile




const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000e2"
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    alignSelf: "flex-start"
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
  nameandinfo: {
    paddingLeft: 10,
    flex: 1,

  },
  name: {
    color: "white",
    fontSize: 20,

  },
  white: {
    color: "white"
  },
  info: {

    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    width: "100%"
  },

  follow: {

  },
  img: {
    height: screenHeight,
    width: screenWidth,
  },
})
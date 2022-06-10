import React, { useContext, useEffect, useRef, useState } from 'react'
import { Alert, Button, FlatList, Image, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TextInput, Touchable, TouchableOpacity, View } from 'react-native'
import { Dimensions } from 'react-native';
import VideoPlayer from 'react-native-video-player';
import firestore from '@react-native-firebase/firestore';
import GestureRecognizer from 'react-native-swipe-gestures'
import Video from 'react-native-video';
import Swiper from 'react-native-swiper'
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import { GlobalContext } from '../../App';
import Ionicons from 'react-native-vector-icons/Ionicons';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;


const SwipeableList = () => {
  const vdoRef = useRef(null)
  const [data, setData] = useState<any>([])
  const { emailUser } = useContext(GlobalContext)
  const [commentText, setCommentText] = useState('');
  const [showComments, setShowComments] = useState(false);
  const [flag, setFlag] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [ispaused, setIsPaused] = useState(false);
  useEffect(() => {
    const getData = async () => {
      const userData = await firestore().collection('UserData').get();
      setData([...userData.docs.reverse()]);
    }
    getData();
  }, [flag])

  const increaseLkes = (i: string, previousLikes: number) => {
    firestore()
      .collection('UserData')
      .doc(i)
      .update({
        'likes': previousLikes + 1,
      })
      .then(() => {
        console.log('User updated!');
        setFlag((prev) => !prev);
      });
  }

  const addComment = (i: string, prevComments: { user: string, text: string }[]) => {
    firestore()
      .collection('UserData')
      .doc(i)
      .update({
        'comments': [...prevComments, { user: emailUser, text: commentText }],
      })
      .then(() => {
        console.log('User updated!');
        setFlag((prev) => !prev);
        setCommentText('');
      });
  }

  console.log("current Index===>",currentIndex);
  return (<>
    <ScrollView 
    pagingEnabled={true} 
    onScroll={(e:any)=>{
     
      let newPageNum:any = e.nativeEvent.contentOffset.y/(windowHeight-75);

      console.log("page numbeer====>",parseInt( newPageNum))
      setCurrentIndex((prev)=>parseInt( newPageNum));
    }}
  onScrollEndDrag={()=>{
    setIsPaused(false)
  }}
    >

      {data &&
        data.map((item: any, i: number) =>
          <View style={{ width: windowWidth,height:windowHeight-50, overflow: "hidden" }} key={item.id}>
            <View style={{ position: "absolute", top: 0, right: 0, left: 0, bottom: 0 }}>
              <View style={styles.avatar}>
                <Text style={{ fontSize: 25, color: "white", textTransform: "uppercase" }}>{emailUser[0]}</Text>
              </View>

              <View style={styles.alignment}>
                <TouchableOpacity onPress={() => increaseLkes(item.ref.id, item._data.likes)}>
                  <FontAwesome5Icon
                    name={"heart"}
                    color="white"
                    style={{ fontSize: 40 }}
                  />
                </TouchableOpacity>
                <Text style={styles.center}>{item._data.likes}</Text>
              </View>


              <View style={styles.alignment}>
                <TouchableOpacity onPress={() =>setShowComments(true)}>
                  <FontAwesome5Icon
                    name={"comment-dots"}
                    color="white"
                    style={{ fontSize: 40 }}
                  />
                </TouchableOpacity>
                <Text style={styles.center}>{item._data.comments.length}</Text>
              </View>


              <View style={styles.alignment}>
                <FontAwesome5Icon name={"share"} color="white" style={{ fontSize: 40 }} />
                <Text style={styles.center}>{35}</Text>
              </View>

              <View style={{ position: "absolute", bottom: 40, left: 10, zIndex: 999 }}>
                <Text style={{ color: "white", fontSize: 18, fontWeight: "bold" }}>@{item._data.email.substring(0,item._data.email.indexOf("@")) }</Text>
              </View>
              <View style={{ position: "absolute", bottom: 10, left: 10, zIndex: 999 }}>
                <Text style={{ color: "white", fontSize: 15 }}>#Title of the Video</Text>
              </View>
            </View>
           <TouchableOpacity 
           onPress={()=>setIsPaused(!ispaused)}
           activeOpacity={0.9}>
             <Video
                paused={i===currentIndex?false||ispaused:true}
                // paused={true}
                repeat={false}
                source={{ uri: item._data.url }}
                poster={ `https://source.unsplash.com/${windowWidth}x${windowHeight}/?nature,water${i}` }
                resizeMode="cover"
                style={{  width: windowWidth, height: windowHeight,  overflow: "hidden" }}
                playInBackground={false}
                playWhenInactive={false}
              /> 
         </TouchableOpacity>
            {showComments &&
              <View style={{ position: "absolute", zIndex: 9999, top: 0, right: 0, left: 0, backgroundColor: "rgba(0, 0, 0, 0.815)" }}>
                <TouchableOpacity onPress={() =>setShowComments(false)} style={{ padding: 10 }}>
                  <Ionicons name="close" style={{ fontSize: 30, textAlign: "right", color:"white" }} />
                </TouchableOpacity>
                <View style={{ flexDirection: "row", alignItems: "center", padding: 0, marginTop: 10, marginBottom: 10, borderRadius: 10, backgroundColor: "white", borderWidth: 2, width: "90%", marginLeft: "auto", marginRight: "auto" }}>
                  <TextInput onChangeText={(text) => setCommentText(text)} style={{ flex: 1, padding: 10, fontSize: 20 }} />

                  <TouchableOpacity onPress={() => addComment(item.ref.id, item._data.comments)} style={{ padding: 10 }}>
                    <Ionicons name="send" style={{ fontSize: 30 }} />
                  </TouchableOpacity>
                </View>
                {item._data.comments.map((cmt: { user: string, text: string }, indx: number) =>
                  <View key={indx} style={{ flexDirection: "row", alignItems: "center", padding: 10, width: "90%", borderBottomWidth: 1, marginLeft: "auto", marginRight: "auto" }}>
                    <Text style={{ fontSize: 20, color: "white" }}>{cmt.user.substring(0, cmt.user.indexOf("@"))}:{" "}</Text>
                    <Text style={{ fontSize: 20, color: "white" }}>{cmt.text}</Text>
                  </View>
                )}
              </View>
            }
          </View>
        )}
    </ScrollView>

  </>
  )
}

export default SwipeableList

const styles = StyleSheet.create({
  wrapper: {},
  slide1: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#9DD6EB'
  },

  text: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold'
  },
  avatar: {
    marginTop: windowHeight / 3,
    marginBottom: 20,
    marginRight: 10,
    marginLeft: "auto",
    width: 50,
    height: 50,
    borderRadius: 70,
    zIndex: 999,
    backgroundColor: "rgba(58, 27, 172, 0.377)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  }
  ,
  alignment: {
    zIndex: 999,
    marginTop: 10,
    marginBottom: 10,
    marginRight: 10,
    marginLeft: "auto",
  },
  center: {
    color: "white",
    textAlign: "center"
  }

})
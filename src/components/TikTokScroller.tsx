import React, { useEffect, useRef, useState } from 'react'
import { Dimensions, Image, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import Video from 'react-native-video';
import firestore from '@react-native-firebase/firestore';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Avatar from './Avatar';
import { NavigationAction, NavigationProp, useNavigation } from '@react-navigation/native';
import Icon from './Icon';
import Button from './Button';
import TextComponent from './TextComponent';

let statusBarHeight = 0
if (StatusBar.currentHeight) {
    statusBarHeight = StatusBar.currentHeight
}

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;


const TikTokScroller = ({data, currentPage, clickHandler}: any) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const scrollViewRef = useRef<ScrollView>(null);
    
    const navigation= useNavigation<any>();

    const scrollHandler = (e: any) => {
        setCurrentIndex(parseInt( ((e.nativeEvent.contentOffset.y/(windowHeight-statusBarHeight)).toString())))
    }
    
  
    return (
        <ScrollView
            pagingEnabled={true}
            onScroll={(e)=>scrollHandler(e)}
            ref={scrollViewRef}
          >
            {data &&
                data.map((item: any, i: number) =>
                <View style={styles.mapWrapper} key={item._data.url}>
                   
                   <View style={styles.utills}>
                   <TouchableOpacity onPress={()=>{clickHandler()}} style={{zIndex:999, top:10, left:10}}>
                            <Ionicons name="arrow-back" color={"white"} style={{fontSize:25}}/>
                      </TouchableOpacity>
                <Avatar
                  dp={item._data.dp}
                  email={item._data.email}
                  style={styles.avatar}
                  clickHandler={() => { }}
                />

                <View style={{ width: 50, height: 50, zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", marginLeft: "auto", marginRight: 10, marginTop: -45, }}>

                  <TouchableOpacity style={{ borderRadius: 50, backgroundColor: "#ea4359" }}>
                    <Icon
                      source='Ionicons'
                      name="add"
                      style={{ fontSize: 20, zIndex: 999 }}
                      color="white"
                    />
                  </TouchableOpacity>

                </View>
                <View style={styles.alignment}>
                  <Button clickHandler={() => { 
                    // increaseLkes(item.ref.id, item._data.likes) 
                    }}>
                    <Icon
                      source='Ionicons'
                      name={
                        // item._data.likes.indexOf(emailUser) === -1 ?
                          // "md-heart-outline" :
                          "heart"
                      }
                      color={
                        // item._data.likes.indexOf(emailUser) === -1 ?
                          // "white" :
                          "#dd4557"
                      }
                      style={{ fontSize: 40 }}
                    />
                  </Button>
                  <TextComponent style={styles.center}>{item._data.likes.length}</TextComponent>
                </View>

                <View style={styles.alignment}>
                  <Button clickHandler={() =>{ 
                    // setShowComments(true)}
                    }}>
                    <Icon
                      name="comment-dots"
                      source='FontAwesome5Icon'
                      color='white'
                      style={{ fontSize: 40 }}
                    />
                  </Button>
                  <TextComponent style={styles.center}>{item._data.comments.length}</TextComponent>
                </View>

                <View style={styles.alignment}>
                  <Button clickHandler={() =>{ 
                    // onShare(item._data.url)}
                  }}
                    >
                    <Icon
                      source='FontAwesome5Icon'
                      name="share"
                      color='white'
                      style={{ fontSize: 40 }}
                    />
                  </Button>
                  <TextComponent style={styles.center}>Share</TextComponent>
                </View>

                <View style={styles.username}>
                  <TextComponent
                    style={styles.usernameText}>
                    {`@${item._data.email.substring(0, item._data.email.indexOf("@"))}`}
                  </TextComponent>
                </View>

                <View style={styles.title}>
                  <TextComponent style={styles.titleText}>{`#${item._data.title}`}</TextComponent>
                </View>

              </View> 
                    {i===currentIndex && 
                    <Video
                        onBuffer={(e) => console.log("buffering....", e)}
                        onError={(e) => console.log("Error......", e)}
                        repeat={true}
                        source={{ uri: item._data.url }}
                        poster={item._data.thumbnail}
                        resizeMode="cover"
                        posterResizeMode='cover'
                        style={{ width: windowWidth, height: windowHeight, overflow: "hidden" }}
                        playInBackground={false}
                        playWhenInactive={false}
                        selectedVideoTrack={{
                            type: "resolution",
                            value: 480
                        }}
                    />
                    }
                    </View>
                    )
            }
        </ScrollView>
    )
}

export default TikTokScroller


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
    },
    username: {
      position: "absolute",
      bottom: 40,
      left: 10,
      zIndex: 999
    },
    usernameText: {
      position: "absolute",
      bottom: 10,
      zIndex: 999,
      color: "white"
    },
    title: {
      position: "absolute",
      bottom: 10,
      left: 10,
      zIndex: 999
    },
    titleText: {
      color: "white",
      fontSize: 15
    },
    mapWrapper: {
      width: windowWidth,
      height: windowHeight  - statusBarHeight,
      overflow: "hidden"
    },
    utills: {
      position: "absolute",
      top: 0,
      right: 0,
      left: 0,
      bottom: 0
    },
    modalWrapper: {
      position: "absolute",
      zIndex: 9999,
      bottom: 0,
      right: 0,
      left: 0,
      top: 0,
      backgroundColor: 'transparent'
    },
    modal: {
      position: "absolute",
      zIndex: 9999,
      bottom: 0,
      right: 0,
      left: 0,
      backgroundColor: "#F5F5F4"
    },
    closeWrapper: {
      paddingTop: 5,
      paddingBottom: 5,
      paddingRight: 10
    },
    close: {
      fontSize: 30,
      textAlign: "right",
      color: "#161722"
    },
    commentWrapper: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      padding: 10,
      width: "100%",
      marginLeft: "auto",
      marginRight: "auto",
      overflow: "hidden"
    },
    avatar1: {
      backgroundColor: "blue",
      width: 30,
      height: 30,
      borderRadius: 50,
      alignItems: "center",
      justifyContent: "center",
      marginRight: 10
    },
    avatarText: {
      color: "white",
      textTransform: 'uppercase'
    },
    commentBox: {
      flexDirection: "row",
      alignItems: "center",
      padding: 0,
      marginBottom: 10,
      borderRadius: 10,
      backgroundColor: "white",
      width: "90%",
      marginLeft: "auto",
      marginRight: "auto"
    },
    commentText: {
      flex: 1,
      fontSize: 20
    }
  
  })
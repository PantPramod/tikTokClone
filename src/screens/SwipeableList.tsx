import firestore from '@react-native-firebase/firestore';
import Video from 'react-native-video';
import { GlobalContext } from '../../App';
import React, { useContext, useEffect, useRef, useState } from 'react';
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Dimensions,
  KeyboardAvoidingView,
  Modal,
  Share,
  Alert,
  Image
} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from '../components/Icon';


let statusBarHeight = 0
if (StatusBar.currentHeight) {
  statusBarHeight = StatusBar.currentHeight
}

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;


const SwipeableList = ({ navigation }: any) => {

  const [data, setData] = useState<any>([])
  const [commentText, setCommentText] = useState('');
  const [showComments, setShowComments] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [ispaused, setIsPaused] = useState(false);
  const [flag, setFlag] = useState(false);
  const [emailUser, setEmailUser] = useState('');
  const vdoRef = useRef(null)


  // const { emailUser} = useContext(GlobalContext)



  useEffect(() => {
    const getEmail = async () => {
      try {
        const email = await AsyncStorage.getItem('email')
        const dp = await AsyncStorage.getItem('dp')
        if (email !== null) {

          setEmailUser(email);
          // value previously stored
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
      setData([...userData.docs.reverse()]);
    }
    getData();
  }, [flag])

  const increaseLkes = (i: string, previousLikes: string[]) => {
    if (previousLikes.indexOf(emailUser) === -1) {
      firestore()
        .collection('UserData')
        .doc(i)
        .update({
          'likes': [...previousLikes, emailUser]
        })
        .then(() => {
          console.log('User updated!');
          setFlag((prev) => !prev);
        });
    } else {

      const indexOfEmail = previousLikes.indexOf(emailUser);
      previousLikes.splice(indexOfEmail, 1)
      firestore()
        .collection('UserData')
        .doc(i)
        .update({
          'likes': [...previousLikes]
        })
        .then(() => {
          console.log('User updated!');
          setFlag((prev) => !prev);
        });
    }
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

  const scrollHandler = (e: any) => {
    let newPageNum: any = e.nativeEvent.contentOffset.y / (windowHeight - 50 - statusBarHeight);
    setCurrentIndex((prev) => parseInt(newPageNum));
  }

  const scrollEndHandler = () => {
    setIsPaused(false)
    setShowComments(false);

  }

  const onShare = async (url: string) => {
    try {
      const result = await Share.share({
        message: url,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error: any) {
      Alert.alert(error.message);
    }
  };

  return (<>
    <KeyboardAvoidingView>
      <ScrollView
        style={{ backgroundColor: "black" }}
        pagingEnabled={true}
        onScroll={scrollHandler}
        onScrollEndDrag={scrollEndHandler}
      >
        {data &&
          data.map((item: any, i: number) =>
            <View style={styles.mapWrapper} key={item._data.url}>
              <View style={styles.utills}>

                <TouchableOpacity
                  style={styles.avatar}
                  onPress={() => { navigation.navigate('UserProfile', { userEmail: item._data.email, userImage: item._data.dp }) }}>

                  {item._data.dp &&
                    <Image source={{ uri: item._data.dp }}
                      style={{ zIndex: 999, width: 50, height: 50, borderRadius: 50 }}
                    />}
                  {!item._data.dp &&
                    <Text style={[styles.avatarText, { fontSize: 25 }]}>{item._data.email[0]}</Text>
                  }
                </TouchableOpacity>

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
                  <TouchableOpacity onPress={() => { increaseLkes(item.ref.id, item._data.likes) }}>
                    <Icon
                      source='Ionicons'
                      name={
                        item._data.likes.indexOf(emailUser) === -1 ?
                          "md-heart-outline" :
                          "heart"
                      }
                      color={
                        item._data.likes.indexOf(emailUser) === -1 ?
                          "white" :
                          "#dd4557"
                      }
                      style={{ fontSize: 40 }}
                    />
                  </TouchableOpacity>
                  <Text style={styles.center}>{item._data.likes.length}</Text>
                </View>

                <View style={styles.alignment}>
                  <TouchableOpacity onPress={() => setShowComments(true)}>
                    <Icon
                      name="comment-dots"
                      source='FontAwesome5Icon'
                      color='white'
                      style={{ fontSize: 40 }}
                    />
                  </TouchableOpacity>
                  <Text style={styles.center}>{item._data.comments.length}</Text>
                </View>

                <View style={styles.alignment}>
                  <TouchableOpacity onPress={() => onShare(item._data.url)}>
                    <Icon
                      source='FontAwesome5Icon'
                      name="share"
                      color='white'
                      style={{ fontSize: 40 }}
                    />
                  </TouchableOpacity>
                  <Text style={styles.center}>Share</Text>
                </View>

                <View style={styles.username}>
                  <Text style={styles.usernameText}>@{item._data.email.substring(0, item._data.email.indexOf("@"))}</Text>
                </View>

                <View style={styles.title}>
                  <Text style={styles.titleText}>#{item._data.title}</Text>
                </View>

              </View>
              {i === currentIndex &&
                <TouchableOpacity
                  onPress={() => setIsPaused((prev) => !prev)}
                  activeOpacity={0.9}>
                  <Video
                    paused={i === currentIndex ? false || ispaused : true}
                    ref={vdoRef}
                    onBuffer={(e) => console.log("buffering....", e)}
                    onError={(e) => console.log("Error......", e)}
                    repeat={true}
                    source={{ uri: item._data.url }}
                    poster={item._data.thumbnail}
                    resizeMode="cover"
                    posterResizeMode='cover'
                    style={{ width: windowWidth, height: windowHeight - 50, overflow: "hidden" }}
                    playInBackground={false}
                    playWhenInactive={false}
                    selectedVideoTrack={{
                      type: "resolution",
                      value: 480
                    }}
                  />
                </TouchableOpacity>
              }


              {showComments && i === currentIndex &&
                <Modal
                  animationType="slide"
                  transparent={true}
                  visible={showComments}
                >
                  <View style={styles.modalWrapper}>
                    <View style={styles.modal}>

                      <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <Text style={{ textAlign: "center", flex: 1 }}>{item._data.comments.length} Comments</Text>

                        <TouchableOpacity
                          onPress={() => setShowComments(false)}
                          style={styles.closeWrapper}>
                          <Icon
                            source='Ionicons'
                            name='close'
                            style={styles.close}
                          />
                        </TouchableOpacity>

                      </View>
                      <ScrollView style={{ maxHeight: windowHeight / 1.8, overflow: "hidden", }}>
                        {item._data.comments.reverse().map((cmt: { user: string, text: string }, indx: number) =>
                          <View key={indx} style={styles.commentWrapper}>
                            <View style={styles.avatar1}>
                              <Text style={styles.avatarText}>{cmt.user[0]}</Text>
                            </View>
                            <View style={{ display: "flex", flex: 1, width: "100%" }}>
                              <Text style={{ fontSize: 18, color: "#161722", width: '100%' }}>{cmt.text}</Text>
                            </View>
                          </View>
                        )}
                      </ScrollView>

                      <View style={styles.commentBox}>
                        <TextInput
                          onChangeText={(text) => setCommentText(text)}
                          style={styles.commentText}
                          value={commentText}
                        />
                        <TouchableOpacity
                          onPress={() => addComment(item.ref.id, item._data.comments)}
                          style={{ padding: 10 }}
                        >
                          <Icon
                            source='Ionicons'
                            name="send"
                            style={{ fontSize: 30 }}
                          />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </Modal>
              }
            </View>

          )}
      </ScrollView>

    </KeyboardAvoidingView>
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
    height: windowHeight - 50 - statusBarHeight,
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
import React, { useEffect, useState } from 'react'
import { Dimensions, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import Fontisto from 'react-native-vector-icons/Fontisto';
import firestore from '@react-native-firebase/firestore';
import TikTokScroller from './TikTokScroller';
import Icon from './Icon';

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

const UserProfile = ({ route, navigation }: any) => {
  const [data, setData] = useState<any>([])
  const [showVideos, setShowVideos] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  
  useEffect(() => {
    const getData = async () => {
      const userData = await firestore().collection('UserData').get();
      const filteredData = userData.docs.filter((item: any) => item._data.email === route.params.userEmail)
      setData(filteredData)
    }
    getData();
  },[])

  const rotateArray=(a:[], n:number)=>{
    let el= a.splice(n,1);
    console.log(el);  
    return [...el ,...a]
    
  }

  return (<>{!showVideos &&
    <>
    <View style={{borderBottomWidth:1, borderColor:"#d8d4d4", padding:10, backgroundColor:"white"}}>
        <TouchableOpacity onPress={()=>{navigation.navigate('MainScreen')}}>
        <Icon 
        source='Ionicons'
        name="arrow-back"
        style={{fontSize:25}}
        />
        </TouchableOpacity>
      </View>
    <ScrollView style={styles.Container}>
      
      <View style={styles.Info}>
        <View style={styles.Left}>
          <Image source={{ uri: route.params.userImage }}
            style={styles.Img}
          />
        </View>
        <View style={styles.Right}>

          <Text style={styles.font18}>{route.params.userEmail.substring(0, route.params.userEmail.indexOf("@"))}</Text>
          <Text >{route.params.userEmail}</Text>
          <Text >{data && data.length} Videos</Text>

          <TouchableOpacity style={styles.FavBtn}>
            <Fontisto name="favorite" style={styles.FavIcon} />
            <Text>Add To Favourite</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={{ display: "flex", flexDirection: "row", flexWrap: "wrap", justifyContent: "space-evenly" }}>
        {
          data &&
          data.map((item: any, index: number) =>

            <TouchableOpacity
              style={{
                width: (screenWidth / 3) - 10,
                height: 155,
                display: "flex",
                alignItems: 'center',
                justifyContent: 'center'
              }}
              key={item._data.url}
              onPress={() => { setCurrentPage(index); setShowVideos(true) }}
            >
              <Image
                key={item._data.url}
                source={{ uri: item._data.thumbnail }}
                resizeMode="cover"
                style={{ width: (screenWidth / 3) - 10, height: 150 }}
              />
            </TouchableOpacity>
          )}
      </View>

    </ScrollView>
    </>
  }
    {showVideos &&
      <TikTokScroller data={rotateArray(data, currentPage) } currentPage={currentPage} clickHandler={()=>setShowVideos(false)}/>
    }
  </>
  )
}

export default UserProfile


const styles = StyleSheet.create({
  Container: {
    padding: 10
  },
  Info: {
    flexDirection: "row",

  },
  Left: {
    padding: 10
  },
  Img: {
    width: 160,
    height: 160
  },
  Right: {

    padding: 10,
    justifyContent: "space-evenly"
  },
  font18: {
    fontSize: 18,
    fontWeight: "bold"
  },
  FavBtn: {
    borderWidth: 1,
    padding: 10,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: "center",
    borderColor: "#948c8cb7"
  },
  FavIcon: {
    fontSize: 20,
    marginRight: 5
  }
})
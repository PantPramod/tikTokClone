import React, { useEffect, useRef } from 'react'
import { Animated, Dimensions, Image, StyleSheet, TouchableOpacity, View } from 'react-native'
import Icon from './Icon';
const windowWidth= Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

type propTypes={
   imagesrc:string,
   close:()=>void
}

const SearchImage = ({imagesrc, close}:propTypes) => {
    const fadeAnim =  useRef(new Animated.Value(0.4)).current;

  useEffect(()=>{
    Animated.timing(fadeAnim,
        {
          toValue: 1,
          duration: 500,
          useNativeDriver:true
        }).start()
  },[imagesrc])

    return (

         <Animated.View style={[style.modalWrapper,{transform:[{scale:fadeAnim}]}]}>
          <View style={style.modal}>
            <TouchableOpacity
              onPress={() => close()}
              style={{ position: "absolute", zIndex: 999, right: 10, top: 10 }}
            >
              <Icon 
              name="window-close"
              source='FontAwesome5Icon'
              style={{ fontSize: 40, color: "white", textAlign: "right" }}
              />
            </TouchableOpacity>
            <Image
              style={{ width: windowWidth, height: windowHeight }}
              source={{ uri: imagesrc }}
              resizeMode="contain"
            />
          </View>

        </Animated.View>
    
  )
}

export default SearchImage


const style=StyleSheet.create({
    modalWrapper: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "#0f0a0add",
        overflow: 'hidden'
      },
      modal: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: 'hidden'
      },
})
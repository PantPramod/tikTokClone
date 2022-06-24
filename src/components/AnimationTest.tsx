import React, { useRef, useEffect, useState } from 'react';
import { Animated, Button, Pressable, Text, View,  } from 'react-native';

const FadeInView = () => {
  const fadeAnim = useRef(new Animated.Value(1)).current;  // Initial value for opacity: 0
  const scale = useRef(new Animated.Value(1)).current;  

  const startAnimation=()=>{
    Animated.sequence([
      Animated.timing(fadeAnim,
        {
          toValue: 0.1,
          duration: 150,
          useNativeDriver:true
        }),
        
        Animated.timing(fadeAnim,
          {
            toValue: 1,
            duration: 150,
            useNativeDriver:true
          })
    ]).start()
  
    Animated.sequence([
      Animated.timing(scale,
        {
          toValue: 0.9,
          duration: 150,
          useNativeDriver:true
        }),
        
        Animated.timing(scale,
          {
            toValue: 1,
            duration: 150,
            useNativeDriver:true
          })
    ]).start()

  }  
    

  

  return (<>
    <Animated.View                 
      style={[{
        width:100,
        marginLeft:"auto",
        marginRight:"auto",
        backgroundColor:"red",
        opacity: fadeAnim,
        paddingTop: 40,
        paddingBottom:40
        
                 
      },{ transform: [{ scale: scale }]}]}
      
    >
      <Pressable onPress={startAnimation} >
      <Text>Hello World</Text>
      </Pressable>
       
    </Animated.View>
    
    </>
  );
}

// You can then use your `FadeInView` in place of a `View` in your components:


export default FadeInView;
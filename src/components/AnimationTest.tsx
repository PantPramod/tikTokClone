import React, { useRef, useEffect, useState } from 'react';
import { Animated, Button, Text, View,  } from 'react-native';

const FadeInView = () => {
  const fadeAnim = useRef(new Animated.Value(0)).current  // Initial value for opacity: 0
  
  const [value, setValue]= useState(0)
  const startAnimation=()=>{
    setValue(100)
    Animated.timing(fadeAnim,{toValue: value,duration: 5000,useNativeDriver:true}).start();
  }  
    

  

  return (<>
    <Animated.View                 
      style={{
        width:100,
        marginLeft:"auto",
        marginRight:"auto",
        backgroundColor:"red",
         opacity: fadeAnim,
        transform: [{translateY:fadeAnim}]
                 
      }}
    >
       <Text>Hello World</Text>
    </Animated.View>
    <Button onPress={startAnimation} title="click me"/>
    </>
  );
}

// You can then use your `FadeInView` in place of a `View` in your components:


export default FadeInView;
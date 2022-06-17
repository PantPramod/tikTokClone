import React, { CSSProperties, ReactNode } from 'react'
import { StyleProp, TouchableOpacity, ViewStyle } from 'react-native'

type propTypes = {
children:ReactNode,
clickHandler:()=>void,
style?:StyleProp<ViewStyle>
}
const Button = ({children, clickHandler, style}:propTypes) => {
  return (
    <TouchableOpacity 
    onPress={clickHandler}
    style={style}
    >
           {children} 
    </TouchableOpacity>
  )
}

export default Button;

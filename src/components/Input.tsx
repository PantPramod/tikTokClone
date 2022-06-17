import React, { Dispatch, SetStateAction } from 'react'
import { StyleProp, TextInput, TextStyle } from 'react-native'

type propType={
    setValue: Dispatch<SetStateAction<string>>,
    value:string,
    placeholder:string,
    style?: StyleProp<TextStyle>,
    secureTextEntry?:boolean
}
const Input = ({setValue, value, placeholder, style, secureTextEntry}:propType) => {
  return (
    <TextInput
     placeholder={placeholder}
     onChangeText={newText => setValue(newText)}
     value={value}
     style={style}
     secureTextEntry={secureTextEntry}
  />
  )
}

export default Input

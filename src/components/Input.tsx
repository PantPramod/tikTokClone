import React, { Dispatch, SetStateAction } from 'react'
import { StyleProp, TextInput, TextStyle } from 'react-native'

type propType={
    setValue: Dispatch<SetStateAction<string>>,
    value:string,
    placeholder:string,
    style?: StyleProp<TextStyle>,
    secureTextEntry?:boolean,
    onSubmitEditing?:()=>void
}
const Input = ({setValue, value, placeholder, style, secureTextEntry, onSubmitEditing}:propType) => {
  return (
    <TextInput
     placeholder={placeholder}
     onChangeText={newText => setValue(newText)}
     value={value}
     style={style}
     secureTextEntry={secureTextEntry}
     onSubmitEditing={onSubmitEditing}
  />
  )
}

export default Input

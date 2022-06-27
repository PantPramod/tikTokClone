import React from 'react'
import { Image, Modal, TouchableOpacity, View } from 'react-native'
import Icon from './Icon'
import TextComponent from './TextComponent'
type propTypes={
    close:()=>void,
    image:string,
    saveImage:()=>void,
    uploadProgress:number 
}
const SelectImage = ({close,image, saveImage, uploadProgress}:propTypes) => {
  return (
    <Modal>
        <TouchableOpacity onPress={() => close()}>

          <Icon
            name='close'
            style={{ fontSize: 30, textAlign: "right" }}
            source="Ionicons"
          />
        </TouchableOpacity>


        <Image
          source={{ uri: image }}
          style={{ width: 300, height: 300, marginLeft: "auto", marginRight: "auto" }}
        />
        <TouchableOpacity
          onPress={() => saveImage()}
          style={{ backgroundColor: "blue", width: 200, marginTop: 30, padding: 10, borderRadius: 6, marginLeft: "auto", marginRight: "auto" }}>
          <TextComponent style={{ textAlign: "center", color: "white", fontSize: 20 }}>Upload</TextComponent>
        </TouchableOpacity>
        {uploadProgress > 0 && <View style={{ borderWidth: 1, width: "80%", height: 20, borderRadius: 5, marginLeft: 'auto', marginRight: "auto", marginTop: 10, }}>
          <View style={{ backgroundColor: "green", width: `${uploadProgress}%`, height: 20 }}>

          </View>
        </View>}
      </Modal>
  )
}

export default SelectImage

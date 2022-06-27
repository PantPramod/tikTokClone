import React, { useEffect, useRef } from 'react'
import { Animated, Image, Modal, StyleSheet, TouchableOpacity, View } from 'react-native'
import Icon from './Icon'
import TextComponent from './TextComponent'
type propTypes = {
  close: () => void,
  image: string,
  saveImage: () => void,
  uploadProgress: number
}
const SelectImage = ({ close, image, saveImage, uploadProgress }: propTypes) => {
  const translate = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(translate,
      {
        toValue: uploadProgress * 2,
        duration: 150,
        useNativeDriver: true
      }).start()

  }, [uploadProgress])


  return (
    <Modal>
      <TouchableOpacity onPress={() => close()}>
        <Icon
          name='close'
          style={styles.ico}
          source="Ionicons"
        />
      </TouchableOpacity>
      <Image
        source={{ uri: image }}
        style={styles.img}
      />
      <TouchableOpacity
        onPress={() => saveImage()}
        style={styles.uploadWrapper}>
        <TextComponent style={styles.uploadBtn}>Upload</TextComponent>
      </TouchableOpacity>
      {uploadProgress > 0 &&
        <View style={styles.progressBar}>
          <Animated.View
            style={[styles.progress, { transform: [{ translateX: translate }] }]}
          >
          </Animated.View>
        </View>}
    </Modal>
  )
}

export default SelectImage


const styles = StyleSheet.create({
  ico: {
    fontSize: 30,
    textAlign: "right"
  },
  img: {
    width: 300,
    height: 300,
    marginLeft: "auto",
    marginRight: "auto"
  },
  uploadWrapper: {
    backgroundColor: "blue",
    width: 200,
    marginTop: 30,
    padding: 10,
    borderRadius: 6,
    marginLeft: "auto",
    marginRight: "auto"
  },
  uploadBtn: {
    textAlign: "center",
    color: "white",
    fontSize: 20
  },
  progressBar: {
    borderWidth: 1,
    width: "80%",
    height: 20,
    backgroundColor: "green",
    borderRadius: 5,
    marginLeft: 'auto',
    marginRight: "auto",
    marginTop: 10,
    overflow: 'hidden'
  },
  progress: {
    backgroundColor: "white",
    width: "100%",
    height: 18,
  }
})
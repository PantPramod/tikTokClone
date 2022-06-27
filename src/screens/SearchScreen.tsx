import React, { useRef, useState } from 'react'
import { SafeAreaView, FlatList, Image, TouchableOpacity, View, StyleSheet, Dimensions, Switch, Alert, StatusBar, Animated, Modal } from 'react-native';
import Icon from '../components/Icon';
import Input from '../components/Input';
import SearchImage from '../components/SearchImage';
// @ts-ignore
import { DATA } from '../data/data';

const SearchScreen = () => {
  const [showModal, setShowModal] = useState(false);
  const [imagesrc, setImageSrc] = useState('');
  const [searchItem, setSearchItem] = useState('');


  const search = () => {
    setImageSrc(`https://source.unsplash.com/700x1000/?${searchItem}`)
    setShowModal(true);
  }

  const close = () => {
    setShowModal(false);
    setImageSrc('');
  }
  return (<>
    <SafeAreaView style={style.container}>

      <View style={style.searchBox}>
        <Input
          value={searchItem}
          placeholder="Enter Image to Search"
          setValue={setSearchItem}
          style={style.searchInput}
          onSubmitEditing={() => { search() }}
        />
        <TouchableOpacity
          onPress={search}
          style={{ padding: 10 }}
        >
          <Icon
            source='FontAwesome5Icon'
            name="search"
            style={{ fontSize: 30 }}
          />
        </TouchableOpacity>

      </View>

      <FlatList
        // @ts-ignore
        data={DATA}
        horizontal={false}
        numColumns={3}
        renderItem={({ item }) => (<View style={{ width: "33.33%", height: 100 }}>
          <TouchableOpacity onPress={() => { setShowModal(true); setImageSrc(item.src + item.id) }}>
            <Image
              style={{ width: "100%", height: 100 }}
              source={{ uri: (item.src + item.id) }}
            />
          </TouchableOpacity>
        </View>)}
        keyExtractor={item => item.id}
      />
      {showModal &&
        <SearchImage
          close={close}
          imagesrc={imagesrc}
        />
      }

    </SafeAreaView>

  </>)
}

export default SearchScreen


const style = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    borderColor: "black",

  },
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
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    padding: 0,
    marginTop: 10,
    marginBottom: 10,
    borderRadius: 10,
    borderWidth: 2,
    width: "90%",
    marginLeft: "auto",
    marginRight: "auto"
  },
  searchInput: {
    flex: 1,
    padding: 10,
    fontSize: 20
  }
})
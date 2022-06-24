import React, { useState } from 'react'
import { SafeAreaView, FlatList, Image, TouchableOpacity,  View, StyleSheet,  Dimensions} from 'react-native';
import Icon from '../components/Icon';
import Input from '../components/Input';
// @ts-ignore
import { DATA } from '../data/data';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;




const SearchScreen = () => {
  const [showModal, setShowModal] = useState(false);
  const [imagesrc, setImageSrc] = useState('');
  const [searchItem, setSearchItem] = useState('')

  const search = () => {
    setImageSrc(`https://source.unsplash.com/700x1000/?${searchItem}`)
    setShowModal(true);

  }
  return (<>
    <SafeAreaView style={style.container}>
      <View style={style.searchBox}>
        
        <Input 
         value={searchItem} 
         placeholder="Enter Image to Search"
         setValue={setSearchItem} 
         style={style.searchInput}
         onSubmitEditing={()=>{search()}}
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

        <View style={style.modalWrapper}>
          <View style={style.modal}>
            <TouchableOpacity
              onPress={() => { setShowModal(false); setImageSrc('') }}
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

        </View>
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
    borderWidth: 1
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
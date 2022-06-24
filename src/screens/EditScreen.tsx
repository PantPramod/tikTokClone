import React, { useEffect, useState } from 'react'
import { ImageBackground, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, TouchableOpacityBase, View } from 'react-native'
import Button from '../components/Button'
import firestore from '@react-native-firebase/firestore';

import Icon from '../components/Icon'
import AsyncStorage from '@react-native-async-storage/async-storage';
type propType = {
    close: () => void,
    dp: string,
    email: string
}
const EditScreen = ({ close, dp, email }: propType) => {
    const [uid, setUid] = useState('')
    const [name, setName] = useState('');
    const [bio, setBio] = useState('');
    const [insta, setInsta] = useState('');
    const [youtube, setYoutube] = useState('');

    useEffect(() => {

        const getUid = async () => {

            try {
                const uId = await AsyncStorage.getItem('uid')
                if (uId !== null) {
                    await firestore()
                        .collection('Users')
                        .doc(uId)
                        .onSnapshot(documentSnapshot => {
                            console.log('User data: ', documentSnapshot.data());
                            setName(documentSnapshot?.data()?.name)
                            setBio(documentSnapshot?.data()?.bio)
                            setInsta(documentSnapshot?.data()?.insta)
                            setYoutube(documentSnapshot?.data()?.youtube)
                        });
                    setUid(uId)
                }
            } catch (e) {
                console.log("error====>", e)
            }
        }
        getUid()
    }, [])

    const saveData = (i: any) => {
        firestore()
            .collection('Users')
            .doc(uid)
            .update(i)
            .then(() => {
                console.log('User updated!');
            });
    }

    return (
        <Modal>
            <ScrollView style={styles.wrapper}>
                <View style={styles.topBar}>
                    <TouchableOpacity onPress={() => close()}>
                        <Icon
                            source='FontAwesome5'
                            name='angle-left'
                            style={{ fontSize: 30, color: "#857f7f" }}
                        />
                    </TouchableOpacity>
                </View>
                <View style={styles.avatar}>
                    <ImageBackground
                        source={{ uri: dp ? dp : "https://source.unsplash.com/100x100/?nature,water" }}
                        style={styles.imgStyle}
                    >
                        <Icon
                            source='Ionicons'
                            name='md-camera-outline'
                            color='rgb(243, 235, 235)'
                            style={{ zIndex: 9, fontSize: 40, textAlign: "center" }} />
                    </ImageBackground>
                </View>
                <Text style={styles.change}>Change Photo</Text>
                <View>
                    <View style={[styles.info, { alignItems: "center" }]}>
                        <Text style={styles.infoProp}>Name</Text>
                        <TextInput
                            value={name}
                            onChangeText={(text) => setName(text)}
                            onSubmitEditing={() => saveData({ name: name })}
                        />
                    </View>
                    <View style={styles.info}>
                        <Text style={styles.infoProp}>Email</Text>
                        <TextInput value={email} />
                    </View>
                    <View style={styles.info}>
                        <Text style={styles.infoProp}>Bio</Text>
                        <TextInput
                            value={bio}
                            onChangeText={(text) => setBio(text)}
                            onSubmitEditing={() => saveData({ bio: bio })}
                        />
                    </View>
                    <View style={styles.info}>
                        <Text style={styles.infoProp}>Instagram</Text>

                        <TextInput
                            value={insta}
                            onChangeText={(text) => setInsta(text)}
                            onSubmitEditing={() => saveData({ insta: insta })}
                        />
                    </View>
                    <View style={styles.info}>
                        <Text style={styles.infoProp}>Youtube</Text>
                        <TextInput
                            value={youtube}
                            onChangeText={(text) => setYoutube(text)}
                            onSubmitEditing={() => saveData({ youtube: youtube })}
                        />
                    </View>


                </View>



            </ScrollView>
        </Modal>
    )
}

export default EditScreen


const styles = StyleSheet.create({
    wrapper: {

    },
    topBar: {
        borderBottomWidth: 2,
        padding: 10,
        borderBottomColor: "#eee2e2",
        backgroundColor: "white"
    },
    avatar: {
        marginTop: 15,
        width: 80,
        height: 80,
        borderRadius: 50,
        marginLeft: "auto",
        marginRight: "auto",
        overflow: "hidden"
    },
    imgStyle: {
        width: 80,
        height: 80,
        alignItems: "center",
        justifyContent: "center"
    },
    change: {
        textAlign: "center",
        marginTop: 10,
        fontSize: 16
    },
    info: {
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 5,
        borderBottomWidth: 1,
        borderBottomColor: "#d8cfcfb5",
        alignItems: "center",
        paddingLeft: 20,
        paddingRight: 20
    },
    infoProp: {
        fontSize: 16,
        color: "black"

    },
    infoValue: {
        fontSize: 16
    }

})
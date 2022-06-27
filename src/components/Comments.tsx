import React, { Dispatch, SetStateAction } from 'react'
import { Dimensions, Modal, ScrollView, StyleSheet, View } from 'react-native'
import Button from './Button'
import Icon from './Icon'
import Input from './Input'
import TextComponent from './TextComponent'
type propTypes={
    showComments:boolean,
    close:()=>void,
    item:any,
    commentText:string,
    setCommentText:Dispatch<SetStateAction<string>>,
    addComment:()=>void
}
const Comments = ({ showComments, close, item, commentText, setCommentText, addComment }: propTypes) => {
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={showComments}
        >
            <View style={styles.modalWrapper}>
                <View style={styles.modal}>

                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <TextComponent style={{ textAlign: "center", flex: 1 }}>{`${item._data.comments.length} Comments`}</TextComponent>

                        <Button
                            clickHandler={() => close()}
                            style={styles.closeWrapper}>
                            <Icon
                                source='Ionicons'
                                name='close'
                                style={styles.close}
                            />
                        </Button>

                    </View>
                    <ScrollView style={{ maxHeight: Dimensions.get('window').height / 1.8, overflow: "hidden", }}>
                        {item._data.comments.reverse().map((cmt: { user: string, text: string }, indx: number) =>
                            <View key={indx} style={styles.commentWrapper}>
                                <View style={styles.avatar1}>
                                    <TextComponent style={styles.avatarText}>{cmt.user[0]}</TextComponent>
                                </View>
                                <View style={{ display: "flex", flex: 1, width: "100%" }}>
                                    <TextComponent style={{ fontSize: 18, color: "#161722", width: '100%' }}>{cmt.text}</TextComponent>
                                </View>
                            </View>
                        )}
                    </ScrollView>

                    <View style={styles.commentBox}>

                        <Input
                            placeholder='Enter Your Comment'
                            style={styles.commentText}
                            value={commentText}
                            setValue={setCommentText}
                            onSubmitEditing={() => addComment()}
                        />
                        <Button
                            clickHandler={() => addComment()}
                            style={{ padding: 10 }}
                        >
                            <Icon
                                source='Ionicons'
                                name="send"
                                style={{ fontSize: 30 }}
                            />
                        </Button>
                    </View>
                </View>
            </View>
        </Modal>
    )
}

export default Comments


const styles = StyleSheet.create({
    modalWrapper: {
        position: "absolute",
        zIndex: 9999,
        bottom: 0,
        right: 0,
        left: 0,
        top: 0,
        backgroundColor: 'transparent'
    },
    modal: {
        position: "absolute",
        zIndex: 9999,
        bottom: 0,
        right: 0,
        left: 0,
        backgroundColor: "#F5F5F4"
    },
    closeWrapper: {
        paddingTop: 5,
        paddingBottom: 5,
        paddingRight: 10
    },
    close: {
        fontSize: 30,
        textAlign: "right",
        color: "#161722"
    },
    commentWrapper: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        padding: 10,
        width: "100%",
        marginLeft: "auto",
        marginRight: "auto",
        overflow: "hidden"
    },
    avatar1: {
        backgroundColor: "blue",
        width: 30,
        height: 30,
        borderRadius: 50,
        alignItems: "center",
        justifyContent: "center",
        marginRight: 10
    },
    avatarText: {
        color: "white",
        textTransform: 'uppercase'

    },
    commentBox: {
        flexDirection: "row",
        alignItems: "center",
        padding: 0,
        marginBottom: 10,
        borderRadius: 10,
        backgroundColor: "white",
        width: "90%",
        marginLeft: "auto",
        marginRight: "auto"
    },
    commentText: {
        flex: 1,
        fontSize: 20
    }

})
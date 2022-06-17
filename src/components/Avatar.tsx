import React, { CSSProperties } from 'react'
import { Image, StyleProp, StyleSheet, Text, TouchableOpacity, ViewStyle } from 'react-native'

type propTypes = {
    style?: StyleProp<ViewStyle>,
    clickHandler: () => void,
    dp: string|undefined,
    email: string
}

const Avatar = ({ style, clickHandler, dp, email }: propTypes) => {
    return (
        <TouchableOpacity
            style={style}
            onPress={clickHandler}>

            {dp && 
                <Image source={{ uri: dp }}
                    style={{ zIndex: 999, width: 50, height: 50, borderRadius: 50 }}
                />}
            {!dp &&
                <Text style={[styles.avatarText, { fontSize: 25 }]}>{email[0]}</Text>
            }
        </TouchableOpacity>
    )
}

export default Avatar

const styles = StyleSheet.create({
    avatarText: {
        color: "white",
        textTransform: 'uppercase'

    },
})
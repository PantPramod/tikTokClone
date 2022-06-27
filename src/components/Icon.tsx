import React, { CSSProperties } from 'react'
import { StyleProp, TextStyle } from 'react-native';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5'
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

type propTypes = {
    source: "Ionicons" | "FontAwesome5Icon" | "FontAwesome5",
    name: string,
    style?: StyleProp<TextStyle>,
    color?: string,
}

const Icon = ({ source, name, style, color }: propTypes) => {
    let initColor = "black";
    if (color) initColor = color;
    if (source === "FontAwesome5Icon")
        return (
            <FontAwesome5Icon name={name} color={initColor} style={style} />
        )
    if (source === "Ionicons")
        return (<Ionicons name={name} color={initColor} style={style} />)

    if (source === "FontAwesome5")
        return (<FontAwesome5 name={name} color={initColor} style={style} />)

    else return <></>
}

export default Icon

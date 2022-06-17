import React, { CSSProperties, ReactNode } from 'react'
import { Text, TextStyle } from 'react-native'

type propTypes = {
    color?: "black" | "white" | "gray",
    size?: "verySmall" | "small" | "smallMedium" | "medium" | "mediumLarge" | "large" | "extraLarge",
    children:string,
    style:TextStyle
}

function fontSize(i: propTypes["size"]) {
    switch (i) {
        case "verySmall": return 12;
        case "small": return 14;
        case "smallMedium": return 16;
        case "medium": return 18;
        case "mediumLarge": return 20;
        case "large": return 22;
        case "extraLarge": return 24;
 }
}
const TextComponent = ({ color, size, children, style }: propTypes) => {


    return (
        <Text style={[ { color: color, fontSize:fontSize(size) }, style]}>{children}</Text>
    )
}

export default TextComponent

import React, { useState } from 'react';

import { Image, TouchableOpacity, Text, ScrollView, View, TextInput, Button, StyleSheet } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';


export default function MyTabBar({ state, descriptors, navigation }: any) {

  const [activeItem, setActiveItem] = useState('Home');

  return (
    <View style={{ flexDirection: 'row', height: 50 }}>
      {state.routes.map((route: any, index: any) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
              ? options.title
              : route.name;

        const isFocused = state.index === index;

        const onPress = () => {

          setActiveItem(route.name);
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        return (
          <TouchableOpacity
            key={label}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            activeOpacity={0.8}
            style={{ flex: 1, backgroundColor: "rgba(0, 0, 0, 0.5)", alignItems: "center", justifyContent: "center" }}
          >

            {
              label == "Home" &&
              <FontAwesome5
                name={"home"}
                color={activeItem === 'Home' ? "rgba(255, 255, 255,1)" : "rgba(255, 255, 255 , 0.5)"}
                style={{ textAlign: "center", fontSize: 20 }}
              />
            }
            {
              label == "Add" &&
              <FontAwesome5
                name={"plus"}
                color={activeItem === 'Add' ? "rgba(255, 255, 255,1)" : "rgba(255, 255, 255 , 0.5)"}
                style={{
                  textAlign: "center",
                  fontSize: 20
                }}
              />
            }
            {
              label == "Search" &&
              <FontAwesome5
                name={"search"}
                color={activeItem === 'Search' ? "rgba(255, 255, 255,1)" : "rgba(255, 255, 255 , 0.5)"}
                style={{ textAlign: "center", fontSize: 20 }}
              />
            }
            {
              label == "Profile" &&
              <FontAwesome5
                name={"user"}
                color={activeItem === 'Profile' ? "rgba(255, 255, 255,1)" : "rgba(255, 255, 255 , 0.5)"}
                style={{ textAlign: "center", fontSize: 20 }}
              />
            }

          </TouchableOpacity>
        );
      })}
    </View>
  );
}


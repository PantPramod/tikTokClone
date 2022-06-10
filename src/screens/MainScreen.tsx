
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react'
import MyTabBar from '../components/MyTabBar';
import Profile from './Profile';
import SearchScreen from './SearchScreen';
import SwipeableList from './SwipeableList';
import VideoScreen from './VideoScreen';


const Tab = createBottomTabNavigator();

const MainScreen = () => {
  return (
    <Tab.Navigator tabBar={(props) => <MyTabBar {...props} />}>
      <Tab.Screen name="Home" component={SwipeableList} key={1} options={{headerShown:false}}/>
      <Tab.Screen name="Add" component={VideoScreen} key={2} options={{headerShown:false}}/>
      <Tab.Screen name="Search" component={SearchScreen} key={3} options={{headerShown:false}}/>
      <Tab.Screen name="Profile" component={Profile} key={4} options={{headerShown:false}}/>
    </Tab.Navigator>

  )
}

export default MainScreen

import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon';
import TabBarIcon_Entypo from '../components/TabBarIcon_Entypo';
import HomeScreen from '../screens/HomeScreen';
import NewsScreen from '../screens/NewsScreen';
import ScheduleScreen from '../screens/ScheduleScreen';
import VenuesScreen from '../screens/VenuesScreen';

const HomeStack = createStackNavigator({
  Home: HomeScreen,
});

HomeStack.navigationOptions = {
  tabBarLabel: 'Home',
  tabBarOptions: { 
    activeTintColor: '#1D6292'
  },
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? 'ios-home' : 'md-home'}
    />
  ),
};

const NewsStack = createStackNavigator({
  News: NewsScreen,
});

NewsStack.navigationOptions = {
  tabBarLabel: 'News',
  tabBarOptions: { 
    activeTintColor: '#1D6292'
  },
  tabBarIcon: ({ focused }) => (
    <TabBarIcon_Entypo
      focused={focused}
      name='news'
    />
  ),
};

const ScheduleStack = createStackNavigator({
  Schedule: ScheduleScreen,
});

ScheduleStack.navigationOptions = {
  tabBarLabel: 'Schedule',
  tabBarOptions: { 
    activeTintColor: '#1D6292'
  },
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? 'ios-calendar' : 'md-calendar'}
    />
  ),
};

const VenuesStack = createStackNavigator({
  Venues: VenuesScreen,
});

VenuesStack.navigationOptions = {
  tabBarLabel: 'Venues',
  tabBarOptions: { 
    activeTintColor: '#1D6292'
  },
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? 'ios-pin' : 'md-pin'}
    />
  ),
};

export default createBottomTabNavigator({
  HomeStack,
  NewsStack,
  ScheduleStack,
  VenuesStack
});

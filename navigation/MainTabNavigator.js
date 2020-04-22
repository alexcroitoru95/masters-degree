import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';

import { TabBarIcon } from '../components';
import MapScreen from '../screens/MapScreen';
import RecommendationsScreen from '../screens/RecommendationsScreen';
import StatsScreen from '../screens/StatsScreen';

const config = Platform.select({
    web: { headerMode: 'screen' },
    default: {},
});

const MapStack = createStackNavigator(
    {
        Map: MapScreen,
    },
    config
);

MapStack.navigationOptions = {
    tabBarLabel: 'Hartă',
    tabBarIcon: ({ focused }) => (
        <TabBarIcon
            focused={focused}
            name={focused ? 'enviromento' : 'enviroment'}
        />
    ),
};

MapStack.path = '';

const StatsStack = createStackNavigator(
    {
        Stats: StatsScreen,
    },
    config
);

StatsStack.navigationOptions = {
    tabBarLabel: 'Statistici',
    tabBarIcon: ({ focused }) => (
        <TabBarIcon
            focused={focused}
            name={focused ? 'questioncircleo' : 'questioncircle'}
        />
    ),
};

StatsStack.path = '';

const RecommendationsStack = createStackNavigator(
    {
        Recommendation: RecommendationsScreen,
    },
    config
);

RecommendationsStack.navigationOptions = {
    tabBarLabel: 'Recomandări',
    tabBarIcon: ({ focused }) => (
        <TabBarIcon
            focused={focused}
            name={focused ? 'questioncircleo' : 'questioncircle'}
        />
    ),
};

RecommendationsStack.path = '';

const tabNavigator = createBottomTabNavigator({
    MapStack,
    StatsStack,
    RecommendationsStack,
});

tabNavigator.path = '';

export default tabNavigator;

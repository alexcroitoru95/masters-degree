import React, { useState, useEffect, PureComponent } from 'react';
import Constants from 'expo-constants';
import {
    Platform,
    Alert,
    Image,
    SafeAreaView,
    FlatList,
    Text,
    StyleSheet,
    View,
} from 'react-native';

import { Loader } from '../components';

export default function StatsScreen() {
    return <View style={styles.container}></View>;
}

StatsScreen.navigationOptions = {
    header: null,
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
});

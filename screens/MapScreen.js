import React, { useState, useEffect } from 'react';
import Constants from 'expo-constants';
import { Platform, Alert, Text, StyleSheet, View } from 'react-native';

import { Loader, InteractiveMap } from '../components';
import {
    MAI_GOV_ROMANIA_GET_LATEST_NEWS,
    MAI_GOV_ROMANIA_GET_LATEST_DATA,
    WRAP_API_KEY,
    LATEST_NEWS_LINK,
    LATEST_DATA,
} from '../constants';
import { parseStringData, getLocationAsync } from '../helpers';

String.prototype.capitalize = function () {
    return this.charAt(0).toUpperCase() + this.slice(1);
};

// TO BE DELETED
const formattedData = parseStringData(LATEST_DATA);

export default function MapScreen(props) {
    const [respondedToUserAgreement, setRespondedToUserAgreement] = useState(
        false
    );
    const [userAgreement, setUserAgreement] = useState(false);
    const [deviceData, setDeviceData] = useState({
        location: null,
        errorMessage: null,
    });
    const [loader, setLoader] = useState(false);
    const [latestNewsLink, setLatestNewsLink] = useState(LATEST_NEWS_LINK);
    const [latestData, setLatestData] = useState(formattedData);

    // TO BE UNCOMMENTED OUT
    // useEffect(() => {
    //     getLatestNews().then((response) => {
    //         if (response.data.output && response.data.output.length) {
    //             const formattedLink = response.data.output.split('/')[3];
    //             setLatestNewsLink(formattedLink);
    //         }
    //     });
    // }, []);

    console.log(latestData);

    useEffect(() => {
        const { isLoaded } = props.screenProps;

        if (!userAgreement && isLoaded) {
            Alert.alert(
                'User Agreement',
                `This application requires your mobile phone location.\nIf you agree we will use your mobile location to get data from different providers and display the weather conditions as well as the level of pollution based on this device's location.\nThank you!`,
                [
                    {
                        text: 'I Accept',
                        onPress: () => {
                            setUserAgreement(true);
                            setRespondedToUserAgreement(true);
                        },
                        style: 'cancel',
                    },
                    {
                        text: 'I Decline',
                        onPress: () => {
                            setUserAgreement(false);
                            setRespondedToUserAgreement(true);
                        },
                        style: 'destructive',
                    },
                ]
            );
        } else if (userAgreement && isLoaded) {
            if (!deviceData.location) {
                if (Platform.OS === 'android' && !Constants.isDevice) {
                    setDeviceData({
                        location: null,
                        errorMessage:
                            'Oops, this will not work on Sketch in an Android emulator. Try it on your device!',
                    });
                } else {
                    getLocationAsync(userAgreement).then((data) => {
                        setDeviceData(data);
                        setLoader(true);
                    });
                }
            } else {
                setLoader(false);
            }

            // TO BE UNCOMMENTED OUT
            // else if (latestNewsLink.length) {
            //     getLatestData(latestNewsLink).then((response) => {
            //         if (response.data.output && response.data.output.length) {
            //             const formattedData = parseStringData(
            //                 response.data.output
            //             );
            //             setLatestData(formattedData);
            //             setLoader(false);
            //         }
            //     });
            // }
        }
    }, [props.screenProps.isLoaded, userAgreement, latestNewsLink, deviceData]);

    return (
        <View style={styles.container}>
            {respondedToUserAgreement &&
                userAgreement &&
                latestData.length > 0 &&
                deviceData.location &&
                !deviceData.errorMessage && (
                    <InteractiveMap
                        data={latestData}
                        location={deviceData.location}
                    />
                )}
            {loader && (
                <View style={styles.loaderContainer}>
                    <Loader size="large" tintColor="#fff" />
                </View>
            )}
            {deviceData.errorMessage && (
                <View style={styles.errorContainer}>
                    <Text style={styles.bigText}>
                        Denied access to this device's location.
                    </Text>
                </View>
            )}
            {respondedToUserAgreement && !userAgreement && (
                <View style={styles.errorContainer}>
                    <Text style={styles.bigText}>Declined user agreement.</Text>
                </View>
            )}
        </View>
    );
}

async function getLatestNews() {
    let responseData = null;

    try {
        let response = await fetch(
            `${MAI_GOV_ROMANIA_GET_LATEST_NEWS}?wrapAPIKey=${WRAP_API_KEY}`
        );
        responseData = await response.json();
    } catch (error) {
        Alert.alert('Error', error, [
            {
                text: 'Ok',
                onPress: () => undefined,
                style: 'cancel',
            },
        ]);
    }

    return responseData;
}

async function getLatestData(latestNewsLink) {
    let responseData = null;

    try {
        let response = await fetch(
            `${MAI_GOV_ROMANIA_GET_LATEST_DATA}?wrapAPIKey=${WRAP_API_KEY}&latestNewsLink=${latestNewsLink}`
        );
        responseData = await response.json();
    } catch (error) {
        Alert.alert('Error', error, [
            {
                text: 'Ok',
                onPress: () => undefined,
                style: 'cancel',
            },
        ]);
    }

    return responseData;
}

MapScreen.navigationOptions = {
    header: null,
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    errorContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    contentContainer: {
        flex: 1,
        ...Platform.select({
            ios: {
                paddingTop: 30,
            },
            android: {
                paddingTop: 10,
            },
        }),
    },
    locationContainer: {
        alignItems: 'center',
        marginTop: 50,
    },
    weatherContainer: {
        flex: 1,
    },
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000',
    },
    headerContainer: {
        alignItems: 'center',
    },
    todaysWeatherImage: {
        ...Platform.select({
            ios: {
                width: 150,
                height: 150,
            },
            android: {
                width: 125,
                height: 125,
            },
        }),
        marginLeft: 'auto',
        marginRight: 'auto',
        resizeMode: 'contain',
        marginTop: 3,
    },
    todaysTemperature: {
        marginTop: 20,
        flexDirection: 'row',
        alignItems: 'flex-end',
    },
    todaysDate: {
        flexDirection: 'row',
        marginTop: 25,
        marginLeft: 20,
        marginRight: 20,
        alignItems: 'center',
        borderBottomWidth: 2,
        borderBottomColor: '#fff',
    },
    forecastContainer: {
        flex: 1,
        marginTop: 5,
        marginBottom: 10,
        ...Platform.select({
            ios: {
                paddingLeft: 20,
                paddingRight: 20,
            },
            android: {
                paddingLeft: 10,
                paddingRight: 10,
            },
        }),
    },
    flatListItem: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    flatListDate: {
        fontSize: 18,
        color: '#fff',
        lineHeight: 18,
        textAlign: 'left',
    },
    flatListImage: {
        width: 35,
        height: 35,
        marginLeft: 'auto',
        marginRight: 'auto',
        resizeMode: 'contain',
    },
    flatListTemp: {
        fontSize: 18,
        color: '#fff',
        lineHeight: 18,
        textAlign: 'right',
    },
    lowOpacityText: {
        opacity: 0.5,
    },
    lowTemp: {
        marginRight: 30,
    },
    maxTemp: {
        marginLeft: 30,
    },
    bigText: {
        fontSize: 28,
        color: '#fff',
        lineHeight: 28,
        textAlign: 'center',
    },
    smallText: {
        fontSize: 24,
        color: '#fff',
        lineHeight: 24,
        textAlign: 'center',
    },
    todaysDateText: {
        fontSize: 18,
        color: '#fff',
        lineHeight: 18,
    },
    todaysDateLabel: {
        fontSize: 14,
        color: '#fff',
        lineHeight: 14,
        fontWeight: 'bold',
        marginLeft: 10,
        textTransform: 'uppercase',
    },
    marginTopText: {
        marginTop: 10,
    },
    marginRightText: {
        marginRight: 10,
    },
});

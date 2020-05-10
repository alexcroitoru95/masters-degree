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

// TO BE DELETED MOCK DATA
const formattedData = parseStringData(LATEST_DATA);

export default function MapScreen(props) {
    const [userAgreement, setUserAgreement] = useState(false);
    const [deviceData, setDeviceData] = useState({
        location: null,
        errorMessage: null,
    });
    const [loader, setLoader] = useState(false);
    const [latestNewsLink, setLatestNewsLink] = useState(LATEST_NEWS_LINK);
    const [latestData, setLatestData] = useState('');
    const [apiError, setAPIError] = useState('');

    // TO BE UNCOMMENTED OUT FOR LIVE DATA
    useEffect(() => {
        getLatestNews()
            .then((response) => {
                if (response.data.output && response.data.output.length) {
                    const formattedLink = response.data.output.split('/')[3];
                    setLatestNewsLink(formattedLink);
                }
            })
            .catch((e) => {
                Alert.alert('API Link Error', `\n${e}`, [
                    {
                        text: 'Ok',
                        onPress: () => {
                            setLoader(false);
                            setAPIError(e);
                        },
                        style: 'cancel',
                    },
                ]);
            });
    }, []);

    useEffect(() => {
        const { isLoaded } = props.screenProps;

        if (!userAgreement && isLoaded) {
            setLoader(true);

            // MOCK DATA
            // if (!latestData.length) {
            //     setLatestData(formattedData);
            //     setLoader(false);
            // }

            // TO BE UNCOMMENTED OUT FOR LIVE DATA
            if (latestNewsLink.length) {
                getLatestData(latestNewsLink)
                    .then((response) => {
                        if (
                            response.data.output &&
                            response.data.output.length
                        ) {
                            const formattedData = parseStringData(
                                response.data.output
                            );
                            setLatestData(formattedData);
                            setLoader(false);
                        }
                    })
                    .catch((e) => {
                        Alert.alert('API Data Error', `\n${e}`, [
                            {
                                text: 'Ok',
                                onPress: () => {
                                    setLoader(false);
                                    setAPIError(e);
                                },
                                style: 'cancel',
                            },
                        ]);
                    });
            }

            Alert.alert(
                'Acordul Utilizatorului',
                `\nAceastă aplicație necesită locația telefonului dvs.\n\nDacă sunteți de acord, vom folosi locația pentru a afișa ca prim rezultat informații despre județul în care vă aflați.\n\nVă mulțumim!`,
                [
                    {
                        text: 'Accept',
                        onPress: () => {
                            setUserAgreement(true);
                        },
                        style: 'cancel',
                    },
                    {
                        text: 'Refuz',
                        onPress: () => {
                            setUserAgreement(false);
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
                        setDeviceData({
                            location: {
                                latitude: data.location.latitude,
                                longitude: data.location.longitude,
                                region: data.location.region,
                            },
                            errorMessage: null,
                        });
                    });
                }
            }
        }
    }, [props.screenProps.isLoaded, userAgreement, latestNewsLink, deviceData]);

    return (
        <View style={styles.container}>
            {loader && <Loader size="large" tintColor="#fff" />}
            {!apiError && (
                <InteractiveMap
                    data={latestData}
                    location={deviceData.location}
                />
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
    },
});

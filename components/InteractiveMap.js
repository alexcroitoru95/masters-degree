import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Animated, Image } from 'react-native';
import MapView from 'react-native-maps';
import { Marker } from 'react-native-maps';

import { window, latitudeDelta, longitudeDelta } from '../constants';

const { width: WINDOW_WIDTH, height: WINDOW_HEIGHT } = window;

const Images = [
    { uri: 'https://i.imgur.com/sNam9iJ.jpg' },
    { uri: 'https://i.imgur.com/N7rlQYt.jpg' },
    { uri: 'https://i.imgur.com/UDrH0wm.jpg' },
    { uri: 'https://i.imgur.com/Ka8kNST.jpg' },
];

const CARD_HEIGHT = WINDOW_HEIGHT / 4;
const CARD_WIDTH = CARD_HEIGHT - 50;

export function InteractiveMap(props) {
    const [markers, setMarkers] = useState([
        {
            coordinate: {
                latitude: 45.524548,
                longitude: -122.6749817,
            },
            title: 'Best Place',
            image: Images[0],
        },
        {
            coordinate: {
                latitude: 45.524698,
                longitude: -122.6655507,
            },
            title: 'Second Best Place',
            image: Images[1],
        },
        {
            coordinate: {
                latitude: 45.5230786,
                longitude: -122.6701034,
            },
            title: 'Third Best Place',
            image: Images[2],
        },
        {
            coordinate: {
                latitude: 45.521016,
                longitude: -122.6561917,
            },
            title: 'Fourth Best Place',
            image: Images[3],
        },
    ]);
    const [region, setRegion] = useState({
        // latitude: props.location.latitude,
        // longitude: props.location.longitude,
        // latitude: 45.8138902,
        // longitude: 21.3331055,
        // latitudeDelta,
        // longitudeDelta,
        latitude: 45.52220671242907,
        longitude: -122.6653281029795,
        latitudeDelta: 0.04864195044303443,
        longitudeDelta: 0.040142817690068,
    });

    let startIndex = 0;
    let animation = new Animated.Value(0);
    let mapRef = useRef(null);
    let regionTimeout = null;

    useEffect(() => {
        // We should detect when scrolling has stopped then animate
        // We should just debounce the event listener here
        animation.addListener(({ value }) => {
            let index = Math.floor(value / CARD_WIDTH + 0.3); // animate 30% away from landing on the next item

            if (index >= markers.length) {
                index = markers.length - 1;
            }
            if (index <= 0) {
                index = 0;
            }

            clearTimeout(regionTimeout);

            regionTimeout = setTimeout(() => {
                if (startIndex !== index) {
                    startIndex = index;
                    const { coordinate } = markers[index];

                    mapRef.animateToRegion(
                        {
                            ...coordinate,
                            latitudeDelta: region.latitudeDelta,
                            longitudeDelta: region.longitudeDelta,
                        },
                        350
                    );
                }
            }, 10);
        });
    });

    const interpolations = markers.map((marker, index) => {
        const inputRange = [
            (index - 1) * CARD_WIDTH,
            index * CARD_WIDTH,
            (index + 1) * CARD_WIDTH,
        ];
        const scale = animation.interpolate({
            inputRange,
            outputRange: [1, 2.5, 1],
            extrapolate: 'clamp',
        });
        const opacity = animation.interpolate({
            inputRange,
            outputRange: [0.35, 1, 0.35],
            extrapolate: 'clamp',
        });
        return { scale, opacity };
    });

    return (
        <View style={styles.container}>
            <MapView
                ref={(map) => (mapRef = map)}
                initialRegion={region}
                style={styles.container}
            >
                {markers.map((marker, index) => {
                    const scaleStyle = {
                        transform: [
                            {
                                scale: interpolations[index].scale,
                            },
                        ],
                    };
                    const opacityStyle = {
                        opacity: interpolations[index].opacity,
                    };
                    return (
                        <Marker key={index} coordinate={marker.coordinate}>
                            <Animated.View
                                style={[styles.markerWrap, opacityStyle]}
                            >
                                <Animated.View
                                    style={[styles.ring, scaleStyle]}
                                />
                                <View style={styles.marker} />
                            </Animated.View>
                        </Marker>
                    );
                })}
            </MapView>
            <Animated.ScrollView
                horizontal
                scrollEventThrottle={1}
                showsHorizontalScrollIndicator={false}
                snapToInterval={CARD_WIDTH}
                onScroll={Animated.event(
                    [
                        {
                            nativeEvent: {
                                contentOffset: {
                                    x: animation,
                                },
                            },
                        },
                    ],
                    { useNativeDriver: true }
                )}
                style={styles.scrollView}
                contentContainerStyle={styles.endPadding}
            >
                {markers.map((marker, index) => (
                    <View style={styles.card} key={index}>
                        <Image
                            source={marker.image}
                            style={styles.cardImage}
                            resizeMode="cover"
                        />
                        <View style={styles.textContent}>
                            <Text numberOfLines={1} style={styles.cardtitle}>
                                {marker.title}
                            </Text>
                            {/* <Text
                                numberOfLines={1}
                                style={styles.cardDescription}
                            >
                                {marker.description}
                            </Text> */}
                        </View>
                    </View>
                ))}
            </Animated.ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollView: {
        position: 'absolute',
        bottom: 30,
        left: 0,
        right: 0,
        paddingVertical: 10,
    },
    endPadding: {
        paddingRight: WINDOW_WIDTH - CARD_WIDTH,
    },
    card: {
        padding: 10,
        elevation: 2,
        backgroundColor: '#FFF',
        marginHorizontal: 10,
        shadowColor: '#000',
        shadowRadius: 5,
        shadowOpacity: 0.3,
        shadowOffset: { x: 2, y: -2 },
        height: CARD_HEIGHT,
        width: CARD_WIDTH,
        overflow: 'hidden',
    },
    cardImage: {
        flex: 3,
        width: '100%',
        height: '100%',
        alignSelf: 'center',
    },
    textContent: {
        flex: 1,
    },
    cardtitle: {
        fontSize: 12,
        marginTop: 5,
        fontWeight: 'bold',
    },
    cardDescription: {
        fontSize: 12,
        color: '#444',
    },
    markerWrap: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    marker: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: 'rgba(130,4,150, 0.9)',
    },
    ring: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: 'rgba(130,4,150, 0.3)',
        position: 'absolute',
        borderWidth: 1,
        borderColor: 'rgba(130,4,150, 0.5)',
    },
});

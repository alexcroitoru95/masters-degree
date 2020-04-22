import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Animated, Image } from 'react-native';
import MapView from 'react-native-maps';
import { Marker } from 'react-native-maps';

import {
    WINDOW,
    LATITUDE_DELTA,
    ROMANIA_CENTER_LATITUDE,
    ROMANIA_CENTER_LONGITUDE,
    regionsOfRomania,
    replaceDiacriticsOnRegion,
} from '../constants';
import { Icons } from '../assets/icons';

const { width: WINDOW_WIDTH, height: WINDOW_HEIGHT } = WINDOW;

const ASPECT_RATIO = WINDOW_WIDTH / WINDOW_HEIGHT;
const CARD_HEIGHT = WINDOW_HEIGHT / 4;
const CARD_WIDTH = CARD_HEIGHT - 50;

export function InteractiveMap(props) {
    const [data, setData] = useState(props.data);
    const [region, setRegion] = useState({
        name: '',
        latitude: ROMANIA_CENTER_LATITUDE,
        longitude: ROMANIA_CENTER_LONGITUDE,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LATITUDE_DELTA * ASPECT_RATIO,
    });
    const [regionCardsPosition, setRegionCardsPosition] = useState([]);

    const animation = new Animated.Value(0);
    let startIndex = 0;
    let mapRef = useRef(null);
    let scrollViewRef = useRef(null);
    let regionTimeout = null;

    useEffect(() => {
        if (props.data.length > 0) {
            setData(props.data);
        }
    }, [props.data]);

    useEffect(() => {
        animation.addListener(({ value }) => {
            let index = Math.floor(value / CARD_WIDTH + 0.3);

            if (index >= data.length) {
                index = data.length - 1;
            }
            if (index <= 0) {
                index = 0;
            }

            regionTimeout = setTimeout(() => {
                if (startIndex !== index) {
                    startIndex = index;
                    const { coordinate } = data[index];

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

        return () => {
            clearTimeout(regionTimeout);
        };
    });

    useEffect(() => {
        if (props.location) {
            const formattedRegion = replaceDiacriticsOnRegion(
                props.location.region
            );
            const currentRegion =
                regionsOfRomania[formattedRegion.toLowerCase()];

            setRegion({
                name: formattedRegion.toLowerCase(),
                latitude: currentRegion.latitude,
                longitude: currentRegion.longitude,
                latitudeDelta: LATITUDE_DELTA,
                longitudeDelta: LATITUDE_DELTA * ASPECT_RATIO,
            });
        }
    }, [props.location]);

    useEffect(() => {
        if (
            region.latitude !== ROMANIA_CENTER_LATITUDE &&
            region.longitude !== ROMANIA_CENTER_LONGITUDE
        ) {
            mapRef.animateToRegion(region, 350);
        }
        if (regionCardsPosition && region.name.length) {
            scrollViewRef.getNode().scrollTo({
                x: regionCardsPosition[region.name],
                y: 0,
                animated: true,
            });
        }
    }, [region]);

    return (
        <View style={styles.container}>
            <MapView
                ref={(map) => (mapRef = map)}
                initialRegion={region}
                style={styles.container}
            >
                {data.length > 0 &&
                    data.map((marker, index) => {
                        const inputRange = [
                            (index - 1) * CARD_WIDTH,
                            index * CARD_WIDTH,
                            (index + 1) * CARD_WIDTH,
                        ];
                        const scaleStyle = {
                            transform: [
                                {
                                    scale: animation.interpolate({
                                        inputRange,
                                        outputRange: [1, 2.5, 1],
                                        extrapolate: 'clamp',
                                    }),
                                },
                            ],
                        };
                        const opacityStyle = {
                            opacity: animation.interpolate({
                                inputRange,
                                outputRange: [0.35, 1, 0.35],
                                extrapolate: 'clamp',
                            }),
                        };
                        return (
                            <Marker
                                key={`Region-Marker-${index}`}
                                coordinate={marker.coordinate}
                            >
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
            {data.length > 0 && (
                <Animated.ScrollView
                    ref={(ref) => {
                        scrollViewRef = ref;
                    }}
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
                    {data.map(({ image, title, cases }, index) => (
                        <View
                            key={`Region-Card-${index}`}
                            onLayout={({ nativeEvent }) => {
                                setRegionCardsPosition({
                                    ...regionCardsPosition,
                                    [title.toLowerCase()]: nativeEvent.layout.x,
                                });
                            }}
                            style={styles.card}
                        >
                            <Image
                                source={Icons[image]}
                                style={styles.cardImage}
                                resizeMode="cover"
                            />
                            <View style={styles.textContent}>
                                <Text
                                    numberOfLines={1}
                                    style={styles.cardTitle}
                                >
                                    {title}
                                </Text>
                                <View style={styles.cardDescription}>
                                    <Text
                                        numberOfLines={1}
                                        style={styles.cardPlaceholder}
                                    >
                                        Total Cazuri:
                                    </Text>
                                    <Text
                                        numberOfLines={1}
                                        style={styles.cardCases}
                                    >
                                        {cases}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    ))}
                </Animated.ScrollView>
            )}
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
        marginHorizontal: 10,
        backgroundColor: '#FFF',
        shadowColor: '#000',
        shadowRadius: 5,
        shadowOpacity: 0.3,
        shadowOffset: { x: 2, y: -2 },
        borderRadius: 5,
        height: CARD_HEIGHT,
        width: CARD_WIDTH,
        overflow: 'hidden',
        position: 'relative',
    },
    cardImage: {
        flex: 3,
        width: '100%',
        height: '100%',
        borderRadius: 10,
        alignSelf: 'center',
    },
    textContent: {
        flex: 1,
    },
    cardTitle: {
        flex: 1,
        fontSize: 14,
        marginTop: 10,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    cardDescription: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: 12,
        textAlign: 'center',
    },
    cardPlaceholder: {
        color: '#444',
        marginRight: 5,
    },
    cardCases: {
        color: '#ed2939',
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

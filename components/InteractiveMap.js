import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Animated, Image } from 'react-native';
import MapView from 'react-native-maps';
import { Marker } from 'react-native-maps';
import Carousel from 'react-native-snap-carousel';

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
const MARGIN_BETWEEN_CARDS = 10;

const CarouselItems = ({ item, index }) => {
    const { title, image, cases } = item;
    return (
        <View key={`Region-Card-${index}`} style={styles.cardContainer}>
            <Image
                source={Icons[image]}
                style={styles.cardImage}
                resizeMode="cover"
            />
            <View style={styles.textContainer}>
                <Text numberOfLines={1} style={styles.cardTitle}>
                    {title}
                </Text>
                <View style={styles.cardDescription}>
                    <Text numberOfLines={1} style={styles.cardPlaceholder}>
                        Total Cazuri:
                    </Text>
                    <Text numberOfLines={1} style={styles.cardCases}>
                        {cases}
                    </Text>
                </View>
            </View>
        </View>
    );
};

export function InteractiveMap(props) {
    const [data, setData] = useState(props.data);
    const [region, setRegion] = useState({
        name: '',
        latitude: ROMANIA_CENTER_LATITUDE,
        longitude: ROMANIA_CENTER_LONGITUDE,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LATITUDE_DELTA * ASPECT_RATIO,
    });

    let mapRef = useRef(null);
    let carouselRef = useRef(null);

    useEffect(() => {
        if (props.data.length > 0) {
            setData(props.data);
        }
    }, [props.data]);

    useEffect(() => {
        if (props.location) {
            const formattedRegion = replaceDiacriticsOnRegion(
                props.location.region
            );
            const currentRegion =
                regionsOfRomania[formattedRegion.toLowerCase()];

            setRegion({
                name: formattedRegion,
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
        if (region.name.length) {
            const newIndex = props.data.findIndex(
                (e) => e.title === region.name
            );
            if (newIndex >= 0) {
                carouselRef.current.snapToItem(newIndex);
            }
        }
    }, [region]);

    function onCarouselSnap(index) {
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

    return (
        <View style={styles.container}>
            <MapView
                ref={(map) => (mapRef = map)}
                initialRegion={region}
                style={styles.container}
            >
                {data.length > 0 &&
                    data.map((marker, index) => (
                        <Marker
                            key={`Region-Marker-${index}`}
                            coordinate={marker.coordinate}
                        >
                            <Animated.View style={styles.markerWrap}>
                                <Animated.View style={styles.ring} />
                                <View style={styles.marker} />
                            </Animated.View>
                        </Marker>
                    ))}
            </MapView>
            {data.length > 0 && (
                <View style={styles.carouselContainer}>
                    <Carousel
                        ref={carouselRef}
                        data={data}
                        loop
                        useScrollView
                        renderItem={CarouselItems}
                        sliderWidth={WINDOW_WIDTH}
                        itemWidth={CARD_WIDTH}
                        contentContainerCustomStyle={styles.startPadding}
                        onSnapToItem={(index) => onCarouselSnap(index)}
                    />
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    carouselContainer: {
        position: 'absolute',
        bottom: 30,
        left: 0,
        right: 0,
    },
    startPadding: {
        paddingLeft: (WINDOW_WIDTH - CARD_WIDTH) / 2 - MARGIN_BETWEEN_CARDS,
    },
    cardContainer: {
        padding: 5,
        elevation: 2,
        marginHorizontal: MARGIN_BETWEEN_CARDS,
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
    textContainer: {
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
        position: 'absolute',
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: 'rgba(130,4,150, 0.3)',
        borderWidth: 1,
        borderColor: 'rgba(130,4,150, 0.5)',
        transform: [{ scale: 1.5 }],
    },
});

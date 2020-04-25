import React, { useState } from 'react';
import { StyleSheet, View, Image } from 'react-native';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import ImageZoom from 'react-native-image-pan-zoom';

import { WINDOW } from '../constants';
import { RecommendationCardImages } from '../assets/images';

const { width: WINDOW_WIDTH, height: WINDOW_HEIGHT } = WINDOW;

const CarouselItems = (carouselProps, activeScroll, setActiveScroll) => {
    const { item, index } = carouselProps;
    return (
        <View key={`Recommendation-Card-${index}`}>
            <ImageZoom
                panToMove={!activeScroll}
                cropWidth={WINDOW_WIDTH}
                cropHeight={WINDOW_HEIGHT}
                onMove={({ scale }) => {
                    setActiveScroll(scale === 1 ? true : false);
                }}
                imageWidth={WINDOW_WIDTH}
                imageHeight={WINDOW_HEIGHT}
            >
                <Image
                    source={item}
                    style={styles.cardImage}
                    resizeMode="contain"
                />
            </ImageZoom>
        </View>
    );
};

export default function RecommendationsScreen() {
    const [activeIndex, setActiveIndex] = useState(0);
    const [activeScroll, setActiveScroll] = useState(true);

    const arrayOfImages = Object.values(RecommendationCardImages);

    return (
        <View style={styles.carouselContainer}>
            <Carousel
                scrollEnabled={activeScroll}
                data={arrayOfImages}
                renderItem={(carouselProps) =>
                    CarouselItems(carouselProps, activeScroll, setActiveScroll)
                }
                sliderWidth={WINDOW_WIDTH}
                itemWidth={WINDOW_WIDTH}
                slideStyle={styles.slide}
                inactiveSlideOpacity={1}
                inactiveSlideScale={1}
                onSnapToItem={(index) => setActiveIndex(index)}
            />
            <Pagination
                dotsLength={arrayOfImages.length}
                activeDotIndex={activeIndex}
                containerStyle={styles.paginationContainer}
                dotStyle={styles.paginationBullets}
                inactiveDotOpacity={0.4}
                inactiveDotScale={0.6}
            />
        </View>
    );
}

RecommendationsScreen.navigationOptions = {
    header: null,
};

const styles = StyleSheet.create({
    carouselContainer: {
        flex: 1,
        backgroundColor: '#309df5',
    },
    slide: {
        width: WINDOW_WIDTH,
    },
    cardImage: {
        width: '100%',
        height: '100%',
    },
    paginationContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        alignItems: 'flex-end',
        justifyContent: 'center',
    },
    paginationBullets: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginHorizontal: 8,
        backgroundColor: 'rgba(255, 255, 255, 0.92)',
    },
});

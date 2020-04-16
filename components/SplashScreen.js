import React, { useState, useEffect } from 'react';
import {
    Animated,
    StatusBar,
    View,
    StyleSheet,
    MaskedViewIOS,
} from 'react-native';

export function SplashScreen(props) {
    const [loadingProgress, setLoadingProgress] = useState(
        new Animated.Value(0)
    );
    const [animationDone, setAnimationDone] = useState(false);

    useEffect(() => {
        if (props.isLoaded) {
            Animated.timing(loadingProgress, {
                toValue: 100,
                duration: 1000,
                useNativeDriver: true,
            }).start(() => {
                setAnimationDone(true);
            });
        }
    }, [props.isLoaded]);

    const opacityClearToVisible = {
        opacity: loadingProgress.interpolate({
            inputRange: [0, 15, 30],
            outputRange: [0, 0, 1],
            extrapolate: 'clamp',
        }),
    };

    const imageScale = {
        transform: [
            {
                scale: loadingProgress.interpolate({
                    inputRange: [0, 10, 100],
                    outputRange: [1, 0.8, 70],
                }),
            },
        ],
    };

    const appScale = {
        transform: [
            {
                scale: loadingProgress.interpolate({
                    inputRange: [0, 100],
                    outputRange: [1.1, 1],
                }),
            },
        ],
    };

    const fullScreenBackgroundLayer = animationDone ? null : (
        <View style={[StyleSheet.absoluteFill, props.backgroundStyle]} />
    );
    const fullScreenWhiteLayer = animationDone ? null : (
        <View style={[StyleSheet.absoluteFill, styles.fullScreenWhiteLayer]} />
    );

    return (
        <View style={styles.fullScreen}>
            <StatusBar animated={true} hidden={!animationDone} />
            {fullScreenBackgroundLayer}
            <MaskedViewIOS
                style={{ flex: 1 }}
                maskElement={
                    <View style={styles.centeredFullScreen}>
                        <Animated.Image
                            style={[styles.maskImageStyle, imageScale]}
                            source={props.imageSource}
                        />
                    </View>
                }
            >
                {fullScreenWhiteLayer}
                <Animated.View
                    style={[opacityClearToVisible, appScale, { flex: 1 }]}
                >
                    {props.children}
                </Animated.View>
            </MaskedViewIOS>
        </View>
    );
}

const styles = StyleSheet.create({
    fullScreen: {
        flex: 1,
    },
    centeredFullScreen: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    maskImageStyle: {
        height: 100,
        width: 100,
    },
    fullScreenWhiteLayer: {
        backgroundColor: 'white',
    },
});

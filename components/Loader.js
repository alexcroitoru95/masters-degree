import React from 'react';
import PropTypes from 'prop-types';

import { ActivityIndicator, View } from 'react-native';

export const Loader = (props) => {
    const { size, tintColor } = props;
    const { overlayBackground, container } = styles;

    return (
        <View style={container}>
            <View style={overlayBackground} />
            <ActivityIndicator size={size} color={tintColor} />
        </View>
    );
};

Loader.propTypes = {
    size: PropTypes.string.isRequired,
    tintColor: PropTypes.string.isRequired,
};

Loader.defaultProps = {
    size: 'small',
    tintColor: '#fff',
};

const styles = {
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    overlayBackground: {
        backgroundColor: 'black',
        position: 'absolute',
        height: '100%',
        width: '100%',
        top: 0,
    },
    textStyle: {
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        paddingHorizontal: 5,
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 20,
    },
};

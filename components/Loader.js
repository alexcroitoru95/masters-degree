import React from 'react';
import PropTypes from 'prop-types';

import { ActivityIndicator, View } from 'react-native';

export const Loader = (props) => {
    const { size, tintColor } = props;
    const { container } = styles;

    return (
        <View style={container}>
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
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0, 0.8)',
    },
};

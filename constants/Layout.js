import { Dimensions } from 'react-native';

export const WINDOW = {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
};

export const isSmallDevice = window.width < 375;

// DEFAULT VALUE FOR LATITUDE DELTAs
export const LATITUDE_DELTA = 0.0922;

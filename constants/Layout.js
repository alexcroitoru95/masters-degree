import { Dimensions } from 'react-native';

export const window = {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
};

export const isSmallDevice = window.width < 375;

export const latitudeDelta = 0.04864195044303443;
export const longitudeDelta = 0.040142817690068;

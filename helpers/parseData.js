import { regionsOfRomania } from '../constants';

export const parseStringData = (data) => {
    let formattedData = data.split('\n\n\n').slice(1);

    formattedData = formattedData.map((e) => {
        const arrayWithRegionAndCases = e
            .slice(e.indexOf('\n') + 1, e.length)
            .split('\n');
        return {
            region: !arrayWithRegionAndCases[1]
                ? 'Total'
                : arrayWithRegionAndCases[0],
            cases: !arrayWithRegionAndCases[1]
                ? arrayWithRegionAndCases[0]
                : arrayWithRegionAndCases[1],
        };
    });

    // formattedData = addCoordinatesToData(formattedData);

    return formattedData;
};

const addCoordinatesToData = (data) => {
    let dataWithCoordinates = [];

    dataWithCoordinates = data.map((e) => {
        const regionData = regionsOfRomania[e.region.toLowerCase()];

        console.log(regionData);

        return {
            coordinate: {
                latitude: regionData,
                longitude,
            },
            title: e.region,
            cases: e.cases,
            image,
        };
    });

    console.log(dataWithCoordinates);

    return dataWithCoordinates;
};

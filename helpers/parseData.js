import {
    regionsOfRomania,
    ROMANIA_CENTER_LONGITUDE,
    ROMANIA_CENTER_LATITUDE,
} from '../constants';

export const parseStringData = (data) => {
    let formattedData = data.split('\n\n\n');
    formattedData = formattedData.slice(1, formattedData.length - 1);
    formattedData = formattedData.filter((e) => e.indexOf('–') === -1);

    formattedData = formattedData.map((e) => {
        const arrayWithRegionAndCases = e
            .slice(e.indexOf('\n') + 1, e.length)
            .split('\n');
        return {
            region: arrayWithRegionAndCases[0],
            cases: !arrayWithRegionAndCases[1]
                ? arrayWithRegionAndCases[0]
                : arrayWithRegionAndCases[1],
        };
    });

    formattedData = addExtraInformationToData(formattedData);

    return formattedData;
};

const addExtraInformationToData = (data) => {
    let dataWithAllInformation = [];

    dataWithAllInformation = data.map((e) => {
        let formattedRegion = e.region.replace('-', '_').toLowerCase();
        formattedRegion =
            formattedRegion.indexOf('bucurești') !== -1
                ? formattedRegion.slice(
                      formattedRegion.indexOf('bucurești'),
                      formattedRegion.length
                  )
                : formattedRegion;
        const regionData = regionsOfRomania[formattedRegion];

        const latitude = regionData
            ? regionData.latitude
            : ROMANIA_CENTER_LATITUDE;
        const longitude = regionData
            ? regionData.longitude
            : ROMANIA_CENTER_LONGITUDE;
        const image =
            formattedRegion === 'satu mare' ? 'satu_mare' : formattedRegion;

        return {
            coordinate: {
                latitude,
                longitude,
            },
            title: e.region,
            cases: e.cases,
            image,
        };
    });

    return dataWithAllInformation;
};

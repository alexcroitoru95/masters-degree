import {
    regionsOfRomania,
    ROMANIA_CENTER_LONGITUDE,
    ROMANIA_CENTER_LATITUDE,
} from '../constants';

function getWeek(date) {
    const target = new Date(date.valueOf());
    const dayNr = (date.getDay() + 6) % 7;

    target.setDate(target.getDate() - dayNr + 3);

    const jan4 = new Date(target.getFullYear(), 0, 4);
    const dayDiff = (target - jan4) / 86400000;

    if (new Date(target.getFullYear(), 0, 1).getDay() < 5) {
        return 1 + Math.ceil(dayDiff / 7);
    } else {
        return Math.ceil(dayDiff / 7);
    }
}

const MONTH_NAMES = [
    'Ianuarie',
    'Februarie',
    'Martie',
    'Aprilie',
    'Mai',
    'Iunie',
    'Iulie',
    'August',
    'Septembrie',
    'Octombrie',
    'Noiembrie',
    'Decembrie',
];

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
        const regionData =
            formattedRegion === 'satu mare'
                ? regionsOfRomania['satu_mare']
                : regionsOfRomania[formattedRegion];

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

export const formatStatData = (data) => {
    let labels = [];
    let allCases = {};
    let totalCases = 0;
    let totalDeaths = 0;
    let totalRecovered = 0;
    let dailyCases = {};
    let allDeaths = {};
    let dailyDeaths = {};
    let allRecovered = {};
    let dailyRecovered = {};
    let nextElementDate = null;
    let nextElementMonth = null;
    const todaysDate = new Date();

    data.map((e, i) => {
        const currentElementDate = new Date(e.Date);
        const currentMonth = MONTH_NAMES[currentElementDate.getMonth()];
        const currentYear = currentElementDate.getFullYear();
        const todaysYear = todaysDate.getFullYear();

        if (labels.indexOf(currentMonth) === -1 && currentYear === todaysYear) {
            labels.push(currentMonth);
        }

        if (data[i + 1]) {
            nextElementDate = new Date(data[i + 1].Date);
            nextElementMonth = MONTH_NAMES[nextElementDate.getMonth()];
        }

        if (currentMonth !== nextElementMonth) {
            allCases = {
                ...allCases,
                [currentMonth]: e.Confirmed,
            };
            allDeaths = {
                ...allDeaths,
                [currentMonth]: e.Deaths,
            };
            allRecovered = {
                ...allRecovered,
                [currentMonth]: e.Recovered,
            };
        }

        if (e.Confirmed !== 0) {
            totalCases = e.Confirmed;
        }

        if (e.Deaths !== 0) {
            totalDeaths = e.Deaths;
        }

        if (e.Recovered !== 0) {
            totalRecovered = e.Recovered;
        }

        if (getWeek(currentElementDate) === getWeek(todaysDate)) {
            const currentDay = currentElementDate.getDate();

            if (e.Confirmed !== 0) {
                dailyCases = {
                    ...dailyCases,
                    [`${currentDay} ${currentMonth}`]: Math.abs(
                        data[i - 1].Confirmed - data[i].Confirmed
                    ),
                };
            }

            if (e.Deaths !== 0) {
                dailyDeaths = {
                    ...dailyDeaths,
                    [`${currentDay} ${currentMonth}`]: Math.abs(
                        data[i - 1].Deaths - data[i].Deaths
                    ),
                };
            }

            if (e.Recovered !== 0) {
                dailyRecovered = {
                    ...dailyRecovered,
                    [`${currentDay} ${currentMonth}`]: Math.abs(
                        data[i - 1].Recovered - data[i].Recovered
                    ),
                };
            }
        }
    });

    return {
        labels,
        totalCases,
        allCases,
        dailyCases,
        totalDeaths,
        allDeaths,
        dailyDeaths,
        totalRecovered,
        allRecovered,
        dailyRecovered,
    };
};

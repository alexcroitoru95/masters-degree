export const ROMANIA_CENTER_LATITUDE = 45.9432;
export const ROMANIA_CENTER_LONGITUDE = 24.9668;

export const regionsOfRomania = {
    alba: {
        latitude: 46.07,
        longitude: 23.57,
    },
    arad: {
        latitude: 46.19,
        longitude: 21.31,
    },
    argeș: {
        latitude: 44.86,
        longitude: 24.88,
    },
    bacău: {
        latitude: 46.57,
        longitude: 26.91,
    },
    bihor: {
        latitude: 47.05,
        longitude: 21.94,
    },
    bistrița_năsăud: {
        latitude: 47.13,
        longitude: 24.49,
    },
    botoșani: {
        latitude: 47.74,
        longitude: 26.67,
    },
    brașov: {
        latitude: 45.65,
        longitude: 25.6,
    },
    brăila: {
        latitude: 45.27,
        longitude: 27.97,
    },
    bucurești: {
        latitude: 44.44,
        longitude: 26.1,
    },
    buzău: {
        latitude: 45.15,
        longitude: 26.82,
    },
    caraș_severin: {
        latitude: 45.29,
        longitude: 21.9,
    },
    călărași: {
        latitude: 44.2,
        longitude: 27.34,
    },
    cluj: {
        latitude: 46.78,
        longitude: 23.61,
    },
    constanța: {
        latitude: 44.18,
        longitude: 28.63,
    },
    covasna: {
        latitude: 45.86,
        longitude: 25.79,
    },
    dâmbovița: {
        latitude: 44.93,
        longitude: 25.46,
    },
    dolj: {
        latitude: 44.32,
        longitude: 23.8,
    },
    galați: {
        latitude: 45.44,
        longitude: 28.04,
    },
    giurgiu: {
        latitude: 43.89,
        longitude: 25.97,
    },
    gorj: {
        latitude: 45.04,
        longitude: 23.28,
    },
    harghita: {
        latitude: 46.36,
        longitude: 25.81,
    },
    hunedoara: {
        latitude: 45.88,
        longitude: 22.9,
    },
    ialomița: {
        latitude: 44.56,
        longitude: 27.38,
    },
    iași: {
        latitude: 47.16,
        longitude: 27.58,
    },
    ilfov: {
        latitude: 44.56,
        longitude: 25.95,
    },
    maramureș: {
        latitude: 47.66,
        longitude: 23.58,
    },
    mehedinți: {
        latitude: 44.63,
        longitude: 22.66,
    },
    mureș: {
        latitude: 46.54,
        longitude: 24.56,
    },
    neamț: {
        latitude: 46.93,
        longitude: 26.37,
    },
    olt: {
        latitude: 44.43,
        longitude: 24.36,
    },
    prahova: {
        latitude: 44.94,
        longitude: 26.02,
    },
    satu_mare: {
        latitude: 47.8,
        longitude: 22.88,
    },
    sălaj: {
        latitude: 47.18,
        longitude: 23.06,
    },
    sibiu: {
        latitude: 45.79,
        longitude: 24.15,
    },
    suceava: {
        latitude: 47.64,
        longitude: 26.24,
    },
    teleorman: {
        latitude: 43.98,
        longitude: 25.64,
    },
    timiș: {
        latitude: 45.76,
        longitude: 21.23,
    },
    tulcea: {
        latitude: 45.18,
        longitude: 28.79,
    },
    vaslui: {
        latitude: 46.64,
        longitude: 27.73,
    },
    vâlcea: {
        latitude: 45.11,
        longitude: 24.37,
    },
    vrancea: {
        latitude: 45.7,
        longitude: 27.18,
    },
};

export const replaceDiacriticsOnRegion = (region) => {
    let formattedRegion = region;

    formattedRegion = formattedRegion.replace(new RegExp(/Județul /g), '');
    formattedRegion = formattedRegion.replace(new RegExp(/ş/g), 'ș');
    formattedRegion = formattedRegion.replace(new RegExp(/â/g), 'â');
    formattedRegion = formattedRegion.replace(new RegExp(/ă/g), 'ă');
    formattedRegion = formattedRegion.replace(new RegExp(/ţ/g), 'ț');

    return formattedRegion;
};

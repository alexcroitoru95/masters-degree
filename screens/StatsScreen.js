import React, { useState, useEffect } from 'react';
import {
    Alert,
    SafeAreaView,
    Text,
    StyleSheet,
    View,
    Image,
    ScrollView,
} from 'react-native';
import { LineChart, BarChart } from 'react-native-chart-kit';

import { WINDOW, ALL_DATA_RO_COVID_API } from '../constants';
import { Loader } from '../components';
import { roFlag } from '../assets/images';
import { formatStatData } from '../helpers/parseData';

const { width: WINDOW_WIDTH } = WINDOW;

const GRAPH_HEIGHT = 220;
const GRAPH_INNER_PADDING = 30;

const CHART_CONFIG = {
    backgroundGradientFrom: '#fff',
    backgroundGradientTo: '#fff',
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    decimalPlaces: 0,
    propsForDots: {
        r: '4',
        strokeWidth: '2',
        stroke: '#000',
    },
};

function getLineValueColor(opacity = 1) {
    return `rgba(0, 0, 0, ${opacity})`;
}

export default function StatsScreen() {
    const [data, setData] = useState({});
    const [loader, setLoader] = useState(false);

    useEffect(() => {
        setLoader(true);

        getData()
            .then((response) => {
                const formattedData = formatStatData(response);
                setData(formattedData);
                setLoader(false);
            })
            .catch((e) => {
                Alert.alert('API All Data Error', `\n${e}`, [
                    {
                        text: 'Ok',
                        onPress: () => {
                            setLoader(false);
                        },
                        style: 'cancel',
                    },
                ]);
            });
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            {loader && <Loader size="large" tintColor="#fff" />}
            {data && (
                <ScrollView contentContainerStyle={styles.scrollView}>
                    <View style={styles.textContainer}>
                        <View style={styles.countryContainer}>
                            <Image source={roFlag} style={styles.roFlag} />
                            <Text style={styles.countryName}>România</Text>
                        </View>
                        <View style={styles.headingContainer}>
                            <Text style={styles.headingDescription}>
                                Cazuri Coronavirus:
                            </Text>
                            <Text
                                style={[
                                    styles.headingValue,
                                    styles.totalCasesColor,
                                ]}
                            >
                                {data.totalCases}
                            </Text>
                        </View>
                        <View style={styles.headingContainer}>
                            <Text style={styles.headingDescription}>
                                Decese:
                            </Text>
                            <Text
                                style={[
                                    styles.headingValue,
                                    styles.totalDeathsColor,
                                ]}
                            >
                                {data.totalDeaths}
                            </Text>
                        </View>
                        <View style={styles.headingContainer}>
                            <Text style={styles.headingDescription}>
                                Recuperări:
                            </Text>
                            <Text
                                style={[
                                    styles.headingValue,
                                    styles.totalRecoveredColor,
                                ]}
                            >
                                {data.totalRecovered}
                            </Text>
                        </View>
                    </View>
                    {data.labels && (
                        <View style={styles.graphsContainer}>
                            {data.allCases && (
                                <View style={styles.graphContainer}>
                                    <Text style={styles.graphTitle}>
                                        Cazuri Totale
                                    </Text>
                                    <Text style={styles.graphDescription}>
                                        Date de la începutul pandemiei până
                                        astăzi
                                    </Text>
                                    <LineChart
                                        data={{
                                            labels: data.labels,
                                            datasets: [
                                                {
                                                    data: Object.values(
                                                        data.allCases
                                                    ),
                                                    color: getLineValueColor,
                                                },
                                            ],
                                        }}
                                        width={
                                            WINDOW_WIDTH - GRAPH_INNER_PADDING
                                        }
                                        height={GRAPH_HEIGHT}
                                        chartConfig={CHART_CONFIG}
                                        style={styles.graphStyle}
                                    />
                                </View>
                            )}
                            {data.dailyCases && (
                                <View style={styles.graphContainer}>
                                    <Text style={styles.graphTitle}>
                                        Cazuri Zilnice
                                    </Text>
                                    <Text style={styles.graphDescription}>
                                        Date de la începutul săptămânii curente
                                    </Text>
                                    <BarChart
                                        data={{
                                            labels: Object.keys(
                                                data.dailyCases
                                            ),
                                            datasets: [
                                                {
                                                    data: Object.values(
                                                        data.dailyCases
                                                    ),
                                                    color: getLineValueColor,
                                                },
                                            ],
                                        }}
                                        width={
                                            WINDOW_WIDTH - GRAPH_INNER_PADDING
                                        }
                                        height={GRAPH_HEIGHT}
                                        fromZero
                                        yLabelsOffset={25}
                                        chartConfig={CHART_CONFIG}
                                        style={styles.barChartStyle}
                                    />
                                </View>
                            )}
                            {data.allDeaths && (
                                <View style={styles.graphContainer}>
                                    <Text style={styles.graphTitle}>
                                        Total Decese
                                    </Text>
                                    <Text style={styles.graphDescription}>
                                        Date de la începutul pandemiei până
                                        astăzi
                                    </Text>
                                    <LineChart
                                        data={{
                                            labels: data.labels,
                                            datasets: [
                                                {
                                                    data: Object.values(
                                                        data.allDeaths
                                                    ),
                                                    color: getLineValueColor,
                                                },
                                            ],
                                        }}
                                        width={
                                            WINDOW_WIDTH - GRAPH_INNER_PADDING
                                        }
                                        height={GRAPH_HEIGHT}
                                        chartConfig={CHART_CONFIG}
                                        style={styles.graphStyle}
                                    />
                                </View>
                            )}
                            {data.dailyDeaths && (
                                <View style={styles.graphContainer}>
                                    <Text style={styles.graphTitle}>
                                        Decese Zilnice
                                    </Text>
                                    <Text style={styles.graphDescription}>
                                        Date de la începutul săptămânii curente
                                    </Text>
                                    <BarChart
                                        data={{
                                            labels: Object.keys(
                                                data.dailyDeaths
                                            ),
                                            datasets: [
                                                {
                                                    data: Object.values(
                                                        data.dailyDeaths
                                                    ),
                                                    color: getLineValueColor,
                                                },
                                            ],
                                        }}
                                        width={
                                            WINDOW_WIDTH - GRAPH_INNER_PADDING
                                        }
                                        height={GRAPH_HEIGHT}
                                        yLabelsOffset={25}
                                        fromZero
                                        chartConfig={CHART_CONFIG}
                                        style={styles.barChartStyle}
                                    />
                                </View>
                            )}
                            {data.allRecovered && (
                                <View style={styles.graphContainer}>
                                    <Text style={styles.graphTitle}>
                                        Total Recuperări
                                    </Text>
                                    <Text style={styles.graphDescription}>
                                        Date de la începutul pandemiei până
                                        astăzi
                                    </Text>
                                    <LineChart
                                        data={{
                                            labels: data.labels,
                                            datasets: [
                                                {
                                                    data: Object.values(
                                                        data.allRecovered
                                                    ),
                                                    color: getLineValueColor,
                                                },
                                            ],
                                        }}
                                        width={
                                            WINDOW_WIDTH - GRAPH_INNER_PADDING
                                        }
                                        height={GRAPH_HEIGHT}
                                        chartConfig={CHART_CONFIG}
                                        style={styles.graphStyle}
                                    />
                                </View>
                            )}
                            {data.dailyRecovered && (
                                <View style={styles.graphContainer}>
                                    <Text style={styles.graphTitle}>
                                        Recuperări Zilnice
                                    </Text>
                                    <Text style={styles.graphDescription}>
                                        Date de la începutul săptămânii curente
                                    </Text>
                                    <BarChart
                                        data={{
                                            labels: Object.keys(
                                                data.dailyRecovered
                                            ),
                                            datasets: [
                                                {
                                                    data: Object.values(
                                                        data.dailyRecovered
                                                    ),
                                                    color: getLineValueColor,
                                                },
                                            ],
                                        }}
                                        width={
                                            WINDOW_WIDTH - GRAPH_INNER_PADDING
                                        }
                                        height={GRAPH_HEIGHT}
                                        yLabelsOffset={25}
                                        fromZero
                                        chartConfig={CHART_CONFIG}
                                        style={styles.barChartStyle}
                                    />
                                </View>
                            )}
                        </View>
                    )}
                </ScrollView>
            )}
        </SafeAreaView>
    );
}

async function getData() {
    let responseData = null;

    try {
        let response = await fetch(ALL_DATA_RO_COVID_API);
        responseData = await response.json();
    } catch (error) {
        Alert.alert('Error', error, [
            {
                text: 'Ok',
                onPress: () => undefined,
                style: 'cancel',
            },
        ]);
    }

    return responseData;
}

StatsScreen.navigationOptions = {
    header: null,
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    scrollView: {
        marginTop: 30,
        paddingBottom: 30,
        marginHorizontal: 20,
    },
    textContainer: {
        marginTop: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    countryContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 30,
    },
    roFlag: {
        width: 60,
        height: 40,
        marginRight: 10,
    },
    countryName: {
        fontSize: 40,
    },
    headingContainer: {
        flexDirection: 'column',
        alignItems: 'center',
        marginBottom: 20,
    },
    headingDescription: {
        fontSize: 25,
        color: '#000',
        marginBottom: 5,
    },
    headingValue: {
        fontSize: 40,
        fontWeight: '700',
    },
    totalCasesColor: {
        color: '#aaa',
    },
    totalDeathsColor: {
        color: '#696969',
    },
    totalRecoveredColor: {
        color: '#8ACA2B',
    },
    graphsContainer: {
        marginTop: 20,
    },
    graphContainer: {
        marginBottom: 20,
    },
    graphTitle: {
        fontSize: 24,
        fontWeight: '500',
        marginBottom: 5,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    graphDescription: {
        fontSize: 12,
        color: '#666666',
        textAlign: 'center',
        marginBottom: 10,
    },
    graphStyle: {
        paddingLeft: 0,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: -10,
        marginLeft: -10,
    },
    barChartStyle: {
        paddingLeft: 0,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: -10,
        marginLeft: 0,
    },
});

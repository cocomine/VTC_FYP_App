import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Dimensions, Image, SafeAreaView, StatusBar, StyleSheet, View } from 'react-native';
import MapView, { Marker, UserLocationChangeEvent } from 'react-native-maps';
import { Button, IconButton, Text, useTheme } from 'react-native-paper';
import { check, PERMISSIONS, request, RESULTS } from 'react-native-permissions';
import { Color } from '../module/Color';
import BottomSheet, { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { URL } from '../App';

/**
 * 主頁
 * @returns {React.ReactElement}
 * @constructor
 */
const Main = ({}) => {
    /** @type ResultData[] */
    const ResultDataType = [];
    const cardWidth = Dimensions.get('window').width * 0.8; //卡片寬度
    const windowHeight = Dimensions.get('window').height; //螢幕高度
    const theme = useTheme(); //主題

    const ref = useRef(null); //MapView ref
    const userLocal = useRef({
        latitude: 22.3659544,
        longitude: 114.1213403,
    }).current; // 目前用戶位置
    const flatList = useRef(null); //FlatList Ref

    const [gps, setGps] = useState(false); // 是否開啟地圖定位
    const [mapPadding, setMapPadding] = useState({
        top: 0,
        left: 0,
        right: 0,
        bottom: windowHeight * 0.25,
    }); // 預設地圖Padding
    const [loading, setLoading] = useState(false); // 是否正在載入
    const [data, setData] = useState(ResultDataType); // 搜尋結果
    const [activatedMarker, setActivatedMarker] = useState(null); // 激活的標記

    const snapPoints = useMemo(() => ['15%', '25%', '50%'], []); // bottomSheet 停止位置

    /**
     * gps更新
     * @param {UserLocationChangeEvent} e 事件數據
     */
    const onUserLocationChange = e => {
        const { latitude, longitude } = e.nativeEvent.coordinate;
        userLocal.latitude = latitude;
        userLocal.longitude = longitude;
    };

    /**
     * 定位
     */
    const onLocal = useCallback(() => {
        ref.current.animateCamera({
            center: { ...userLocal },
            pitch: 0,
            heading: 0,
            zoom: 15.5,
        });
    }, [userLocal]);

    /* 檢查定位權限 */
    const checkPermissions = useCallback(result => {
        switch (result) {
            case RESULTS.UNAVAILABLE:
                console.log('你的裝置無法使用定位功能');
                break;
            case RESULTS.DENIED:
                request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION).then(
                    checkPermissions,
                );
                console.log(
                    'The permission has not been requested / is denied but requestable',
                );
                break;
            case RESULTS.LIMITED:
                console.log(
                    'The permission is limited: some actions are possible',
                );
                break;
            case RESULTS.GRANTED:
                setGps(true);
                console.log('已允許');
                break;
            case RESULTS.BLOCKED:
                console.log('你拒絕了位置權限');
                break;
        }
    }, []);

    /* 根據櫃桶拉開距離決定地圖Padding */
    const handleSheetChanges = useCallback(index => {
        if (index === 0) {
            setMapPadding({
                top: 0,
                left: 0,
                right: 0,
                bottom: windowHeight * 0.15,
            });
        } else if (index === 1) {
            setMapPadding({
                top: 0,
                left: 0,
                right: 0,
                bottom: windowHeight * 0.25,
            });
        } else {
            setMapPadding({
                top: 0,
                left: 0,
                right: 0,
                bottom: windowHeight * 0.50,
            });
        }
    }, [windowHeight]);


    const markerPass = useCallback((index) => {
        console.log(index);
        flatList.current.scrollToIndex({ index: index, animated: true });
        setActivatedMarker(index);
    }, []);

    /**
     * 搜尋區域
     * @returns {Promise<void>}
     */
    const onSearch = async () => {
        setLoading(true);
        const bounds = await ref.current.getMapBoundaries();
        console.log(bounds); //debug

        /* send */
        fetch(URL + '/api/app/xmap/', {
            method: 'POST',
            redirect: 'error',
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
            },
            body: JSON.stringify(bounds),
        }).then(async (response) => {
            /** @type {respondData} */
            const json = await response.json();
            console.log(json);
            if (response.ok && json.code === 200) {
                setData(json.data);
            } else {

            }
        }).finally(() => {
            setLoading(false);
        }).catch((error) => {
            console.log(error);
        });
    };

    /* 開app 檢查權限 */
    useEffect(() => {
        check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION).then(checkPermissions);
    }, [checkPermissions]);

    /* 當櫃桶距離更改時自動定位 */
    useEffect(() => {
        setTimeout(() => {
            onLocal();
        }, 1000);
    }, [mapPadding, onLocal]);

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <StatusBar
                animated={true}
                backgroundColor={Color.transparent}
                translucent={true}
            />
            <MapView
                style={{ flex: 1, elevation: -1 }}
                initialCamera={{
                    center: {
                        latitude: 22.3659544,
                        longitude: 114.1213403,
                    },
                    pitch: 0,
                    heading: 0,
                    zoom: 9.8,
                }}
                onUserLocationChange={onUserLocationChange}
                showsUserLocation={gps}
                followsUserLocation={true}
                toolbarEnabled={false}
                showsMyLocationButton={false}
                mapPadding={mapPadding}
                ref={ref}
            >
                {
                    /** @type {React.ReactElement[]} */
                    data.map((item, index) => (
                        <MapMarker data={item} onPress={() => markerPass(index)} key={item.ID} trigger={activatedMarker === index}/>
                    ))
                }
            </MapView>
            <View style={styles.top}>
                <Button
                    onPress={onSearch}
                    mode={'contained'}
                    style={{ width: 'auto', elevation: 5 }}
                    textColor={Color.light}
                    loading={loading}>
                    搜尋這個區域
                </Button>
            </View>
            <IconButton
                onPress={onLocal}
                mode={'contained'}
                icon={'crosshairs-gps'}
                iconColor={Color.primaryColor}
                style={styles.localBtn}
                accessibilityLabel={'定位目前位置'}
            />
            <BottomSheet
                index={1}
                snapPoints={snapPoints}
                onChange={handleSheetChanges}
                style={{ elevation: 5 }}
                backgroundStyle={{ backgroundColor: theme.colors.background }}
            >
                <BottomSheetFlatList
                    ref={flatList}
                    data={data}
                    horizontal={true}
                    keyExtractor={i => i.ID.toString()}
                    snapToInterval={cardWidth + 10}
                    snapToAlignment={'start'}
                    decelerationRate={'normal'}
                    showsHorizontalScrollIndicator={false}
                    ListHeaderComponent={<View style={{ width: 20 }} />}
                    renderItem={({ item, index }) => (
                        <EventCard data={item} cardWidth={cardWidth} />
                    )}
                />
            </BottomSheet>
        </SafeAreaView>
    );
};

/**
 * 地圖標記
 * @param {ResultData} data
 * @param {() => void} onPress
 * @param trigger
 * @returns {JSX.Element}
 * @constructor
 */
const MapMarker = ({ data, onPress, trigger = false}) => {
    const [opacity, setOpacity] = useState(0.6);

    /* 處理按下 */
    const handlePress = useCallback(() => {
        if (opacity <= 0.6) {
            setOpacity(1);
        } else {
            setOpacity(0.6);
        }
        onPress && onPress();
    }, [onPress, opacity]);

    useEffect(() => {
        if (trigger) {
            setOpacity(1);
        } else {
            setOpacity(0.6);
        }
    }, [trigger, handlePress]);

    return (
        <Marker
            title={data.name}
            opacity={opacity}
            coordinate={{
                latitude: data.latitude,
                longitude: data.longitude,
            }}
            pinColor={Color.primaryColor}
            onPress={handlePress}
        />
    );
};

/**
 * Event卡片
 * @param {ResultData} data
 * @param {number} cardWidth
 * @constructor
 */
const EventCard = ({ data, cardWidth }) => {
    return (
        <View
            style={{
                width: cardWidth,
                marginRight: 10,
            }}>
            <Image style={styles.thumbnail} source={{ uri: URL + '/panel/api/media/' + data.thumbnail }} />
            <Text style={styles.text_title} variant={'titleMedium'}>{data.name}</Text>
            <Text style={styles.text_summary} variant={'bodyMedium'}>{data.summary}</Text>
            <View style={styles.moreBtn_container}>
                <Button mode={'contained'} textColor={Color.light} style={{ width: 'auto' }}>立即預約</Button>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    thumbnail: {
        width: '100%',
        height: 100,
        borderRadius: 10,
    },
    text_summary: {
        color: Color.secondary,
        paddingTop: 10,
    },
    text_title: {
        paddingTop: 10,
    },
    top: {
        position: 'absolute',
        top: 56,
        left: 0,
        right: 0,
        justifyContent: 'center',
        flexDirection: 'row',
    },
    localBtn: {
        position: 'absolute',
        top: 50,
        right: 10,
        backgroundColor: Color.light,
        elevation: 5,
    },
    moreBtn_container: {
        justifyContent: 'flex-end',
        flexDirection: 'row',
        marginTop: 10,
    },
});

export default Main;

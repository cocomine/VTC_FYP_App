import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Dimensions, PixelRatio, SafeAreaView, StatusBar, StyleSheet, View } from 'react-native';
import MapView, { UserLocationChangeEvent } from 'react-native-maps';
import { Button, IconButton, useTheme } from 'react-native-paper';
import { check, PERMISSIONS, request, RESULTS } from 'react-native-permissions';
import { Color } from '../module/Color';
import BottomSheet from '@gorhom/bottom-sheet';
import { URL } from '../App';
import { FlatList } from 'react-native-gesture-handler';
import Toast from 'react-native-simple-toast';
import MapMarker from '../module/MapMarker';
import EventCard from '../module/EventCard';

/**
 * 主頁
 * @returns {React.ReactElement}
 * @constructor
 */
const Main = ({}) => {
    /** @type ResultData[] */
    const ResultDataType = [];
    const cardWidth = Dimensions.get('window').width * 0.8; //卡片寬度
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
        bottom: PixelRatio.getFontScale() + 160,
    }); // 預設地圖Padding
    const [loading, setLoading] = useState(false); // 是否正在載入
    const [data, setData] = useState(ResultDataType); // 搜尋結果
    const [activatedMarker, setActivatedMarker] = useState(0); // 激活的標記

    const snapPoints = useMemo(() => [80, PixelRatio.getFontScale() + 160, 400], []); // bottomSheet 停止位置

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
                Toast.show('你的裝置無法使用定位功能', Toast.LONG);
                break;
            case RESULTS.DENIED:
                request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION).then(
                    checkPermissions,
                );
                console.log('要求權限');
                break;
            case RESULTS.LIMITED:
                console.log('The permission is limited: some actions are possible');
                Toast.show('需要精準位置權限, 請前往設定開啟', Toast.LONG);
                break;
            case RESULTS.GRANTED:
                setGps(true);
                console.log('已允許');
                break;
            case RESULTS.BLOCKED:
                console.log('你拒絕了位置權限');
                Toast.show('你拒絕了位置權限, 請前往設定開啟', Toast.LONG);
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
                bottom: 80,
            });
        } else if (index === 1) {
            setMapPadding({
                top: 0,
                left: 0,
                right: 0,
                bottom: PixelRatio.getFontScale() + 160,
            });
        } else {
            setMapPadding({
                top: 0,
                left: 0,
                right: 0,
                bottom: 400,
            });
        }
    }, []);

    /* 點擊標記 */
    const markerPass = useCallback((index) => {
        flatList.current.scrollToIndex({ index: index, viewOffset: 0 });
        setActivatedMarker(index);
    }, [flatList]);

    /* 列表滾動 */
    const listScroll = useCallback((e) => {
        const index = Math.round(e.nativeEvent.contentOffset.x / (cardWidth + 10));
        setActivatedMarker(index);
        console.log(index);
    }, [cardWidth]);

    /**
     * 搜尋區域
     * @returns {Promise<void>}
     */
    const onSearch = useCallback(async () => {
        if (loading) {
            return;
        }

        setLoading(true);
        const bounds = await ref.current.getMapBoundaries();

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
            if (response.ok && json.code === 200) {
                setData(json.data);
                setActivatedMarker(0);
            } else {

            }
        }).finally(() => {
            setLoading(false);
        }).catch((error) => {
            console.log(error);
        });
    }, [loading]);

    /* 開app 檢查權限 */
    useEffect(() => {
        check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION).then(checkPermissions);
    }, [checkPermissions]);

    /* 當櫃桶距離更改時自動定位 */
    useEffect(() => {
        setTimeout(() => {
            onLocal();
        }, 500);
    }, [mapPadding, onLocal]);

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <React.StrictMode>
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
                            <MapMarker data={item} onPress={() => markerPass(index)} key={item.ID}
                                       trigger={activatedMarker === index} />
                        ))
                    }
                </MapView>
                <View style={styles.top}>
                    <Button
                        onPress={onSearch}
                        mode={'contained'}
                        style={{ width: 'auto', elevation: 5 }}
                        textColor={Color.light}
                        loading={loading}
                    >
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
                    handleIndicatorStyle={{ backgroundColor: Color.secondary, width: '40%' }}
                >
                    <FlatList
                        ref={flatList}
                        data={data}
                        horizontal={true}
                        keyExtractor={i => i.ID.toString()}
                        snapToInterval={cardWidth + 10}
                        snapToAlignment={'start'}
                        decelerationRate={'normal'}
                        showsHorizontalScrollIndicator={false}
                        onScroll={listScroll}
                        snapToOffsets={data.map((_, index) => index * (cardWidth + 10))}
                        ListHeaderComponent={<View style={{ width: 20 }} />}
                        getItemLayout={(_, index) => (
                            { length: cardWidth, offset: (cardWidth + 10) * index, index }
                        )}
                        renderItem={({ item, index }) => (
                            <EventCard data={item} cardWidth={cardWidth} />
                        )}
                    />
                </BottomSheet>
            </React.StrictMode>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
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
});

export default Main;

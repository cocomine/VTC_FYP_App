import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
    Dimensions,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    View,
} from 'react-native';
import MapView, { UserLocationChangeEvent } from 'react-native-maps';
import { Button, IconButton, Text } from 'react-native-paper';
import { check, PERMISSIONS, request, RESULTS } from 'react-native-permissions';
import { Color } from '../module/Color';
import BottomSheet, { BottomSheetFlatList } from '@gorhom/bottom-sheet';

const Main = (callback, deps) => {
    const cardWidth = Dimensions.get('window').width * 0.8;
    const windowHeight = Dimensions.get('window').height;
    const ref = useRef(null); //MapView ref
    const [gps, setGps] = useState(false); // 是否開啟地圖定位
    const userLocal = useRef({
        latitude: 22.3659544,
        longitude: 114.1213403,
    }).current; // 目前用戶位置
    const [mapPadding, setMapPadding] = useState({
        top: 0,
        left: 0,
        right: 0,
        bottom: windowHeight * 0.25,
    }); // 預設地圖Padding
    const bottomSheetRef = useRef(null); //bottomSheet Ref
    const snapPoints = useMemo(() => ['15%', '25%', '50%'], []); // bottomSheet 停止位置
    const [loading, setLoading] = useState(false); // 是否正在載入

    //debug
    const test = [
        { id: 0 },
        { id: 1 },
        { id: 2 },
        { id: 3 },
        { id: 4 },
        { id: 5 },
        { id: 6 },
        { id: 7 },
        { id: 8 },
        { id: 9 },
        { id: 10 },
        { id: 11 },
        { id: 12 },
    ];

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

    /**
     * 搜尋區域
     * @returns {Promise<void>}
     */
    const onSearch = async () => {
        setLoading(true);
        const bounds = await ref.current.getMapBoundaries();
        console.log(bounds);
        
        
    };

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
            />
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
                ref={bottomSheetRef}
                index={1}
                snapPoints={snapPoints}
                onChange={handleSheetChanges}
                style={{elevation: 5}}>
                <BottomSheetFlatList
                    data={test}
                    horizontal={true}
                    keyExtractor={i => i.id}
                    snapToInterval={cardWidth + 10}
                    snapToAlignment={'start'}
                    decelerationRate={'normal'}
                    showsHorizontalScrollIndicator={false}
                    ListHeaderComponent={<View style={{ width: 20 }} />}
                    renderItem={({ item, index }) => (
                        <View
                            key={index}
                            style={{
                                width: cardWidth,
                                backgroundColor: Color.secondary,
                                marginRight: 10,
                            }}>
                            <Text
                                style={{ color: Color.darkColor }}>
                                {item.id}
                            </Text>
                        </View>
                    )}
                />
            </BottomSheet>
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
    divider: {
        container: {
            justifyContent: 'center',
            flexDirection: 'row',
            marginTop: 5,
        },
        element: {
            paddingTop: 5,
            backgroundColor: Color.secondary,
            height: 5,
            flex: 1 / 3,
            borderRadius: 5,
        },
    },
});

export default Main;

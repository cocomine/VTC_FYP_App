import React, {useCallback, useEffect, useRef, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import MapView, {UserLocationChangeEvent} from 'react-native-maps';
import {Button, IconButton, Text} from 'react-native-paper';
import {check, PERMISSIONS, request, RESULTS} from 'react-native-permissions';
import {Color} from '../module/Color';
import BottomDrawer from "react-native-bottom-drawer-view";

const Main = () => {
    const ref = useRef(null); //MapView ref
    const [gps, setGps] = useState(false); //是否開啟地圖定位
    const userLocal = useRef({latitude:22.3659544, longitude:114.1213403}).current; //目前用戶位置

    /**
     * gps更新
     * @param {UserLocationChangeEvent} e 事件數據
     */
    const onUserLocationChange = (e) => {
        const {latitude, longitude} = e.nativeEvent.coordinate
        userLocal.latitude = latitude;
        userLocal.longitude = longitude;
    };

    /**
     * 定位
     */
    const onLocal = () => {
        ref.current.animateCamera({
            center: {...userLocal},
            pitch: 0,
            heading: 0,
            zoom: 15.5,
        });
    };

    /**
     * 搜尋區域
     * @returns {Promise<void>}
     */
    const onSearch = async () => {
        const bounds = await ref.current.getMapBoundaries();
    };

    /**
     * 檢查定位權限
     * @type {React.useCallback<(function(any): void) | any>}
     */
    const checkPermissions = useCallback(result => {
        switch (result) {
            case RESULTS.UNAVAILABLE:
                console.log('你的裝置無法使用定位功能');
                break;
            case RESULTS.DENIED:
                request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION).then(checkPermissions);
                console.log('The permission has not been requested / is denied but requestable');
                break;
            case RESULTS.LIMITED:
                console.log('The permission is limited: some actions are possible');
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

    /* 檢查權限 */
    useEffect(() => {
        check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION).then(checkPermissions);
    }, [checkPermissions]);

    return (
        <View style={{flex: 1}}>
            <MapView
                style={{flex: 1}}
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
                mapPadding={{
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 20,
                }}
                ref={ref}
            />
            <View style={styles.top}>
                <Button onPress={onSearch} mode={'contained'} style={{width: 'auto'}}>
                    搜尋這個區域
                </Button>
            </View>
            <IconButton onPress={onLocal} mode={'contained'} icon={'crosshairs-gps'} iconColor={Color.primaryColor} style={styles.localBtn} accessibilityLabel={'定位目前位置'}/>
            <BottomDrawer
                containerHeight={500}
                downDisplay={400}
                startUp={false}
                alldownDisplay={20}
            >
                <View>

                </View>
            </BottomDrawer>
        </View>
    );
};

const styles = StyleSheet.create({
    top: {
        position: 'absolute',
        top: 16,
        left: 0,
        right: 0,
        justifyContent: 'center',
        flexDirection: 'row',
    },
    localBtn:{
        position: 'absolute',
        top: 10,
        right: 10,
        backgroundColor: Color.light,
        elevation:5,
    },
});

export default Main;

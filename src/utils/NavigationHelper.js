import * as React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { StackActions } from '@react-navigation/routers';

import { CommonActions } from '@react-navigation/native';

export const navigationRef = React.createRef();

export const isReadyRef = React.createRef();

export function navigate(name, params) {
    if (isReadyRef.current && navigationRef.current) {
        navigationRef.current?.navigate(name, params);
    } else {
        console.log('not init');
    }
}

export function push(name, params) {
    if (isReadyRef.current && navigationRef.current) {
        navigationRef.current.dispatch(StackActions.push(name, params));
    } else {
        console.log('not init');
    }
}

export function replace(name, params) {
    if (isReadyRef.current && navigationRef.current) {
        // navigationRef.current?.navigate(name, params);
        navigationRef.current.dispatch(StackActions.replace(name, params));
    } else {
        console.log('not init');
    }
}

export function reset(name, params) {
    navigationRef.current.dispatch(CommonActions.reset({
        index  : 0,
        routes : [ { name, params } ]
    }));
}


export function getRootState() {
    return navigationRef.current.getRootState();
}


export function getCurrentRoute(nav = getRootState()) {
    if (Array.isArray(nav.routes) && nav.routes.length > 0) {
        return getCurrentRoute(nav.routes[nav.index]);
    }

    return nav.name;
}

// class NavigationHelper {
//     initRootNavigator(navigator) {
//         this.rootNavigator = navigator;
//     }

//     getRootNavigator() {
//         return this.rootNavigator;
//     }
// }

// export default new NavigationHelper();

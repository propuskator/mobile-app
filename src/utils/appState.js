export function isAppStateActiveAfterBackground(appState, nextAppState) {
    return appState.match(/inactive|background/) && nextAppState === 'active';
}

export function isAppStateSwitchToBackground(appState, nextAppState) {
    return nextAppState === 'background' && appState.match(/active|inactive/);
}

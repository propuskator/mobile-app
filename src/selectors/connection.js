export const isConnectingAfterBackgroundSelector = state => state.connection.isConnectingAfterBackground;
export const isBrokerConnectedSelector           = state => state.homieConnection.isConnected;
export const isInternetConnectedSelector         = state => state.connection.isInternetReachable;
export const isBrokerConectionLoadingSelector    = state => state.homieConnection.isLoading;
export const isTryingToConnectVisibleSelector    = state => state.connection.isTryingToConnectVisible;
export const isNoConnectScreenVisibleSelector    = state => state.connection.isNoConnectScreenVisible;
export const isAppInBackgroundSelector           = state => state.connection.isAppInBackground;

export const isUserNotLogedInSelector       = state =>
    state.session.isUserStateInitialized && !state.session.isSessionExist;
export const isUserLogedInSelector          = state =>
    state.session.isUserStateInitialized && !!state.session.isSessionExist;
export const isUserStateInitializedSelector = state => state.session.isUserStateInitialized;
export const isSessionCheckedSelector       = state => state.session.isSessionExist !== null;

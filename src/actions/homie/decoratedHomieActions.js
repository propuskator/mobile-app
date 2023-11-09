import {
    handleBrokerConnectionRestored,
    handleBrokerConnectionLost
}                               from '../homie/connection';
import store                    from '../../store';
import { handleHardwareDelete } from './homie';


export function dispatchBrokerConnectionLost() {
    store.dispatch(handleBrokerConnectionLost());
}

export function dispatchBrokerConnectionRestore() {
    store.dispatch(handleBrokerConnectionRestored());
}

export function dispatchHandleHardwareDelete(data) {
    store.dispatch(handleHardwareDelete(data));
}

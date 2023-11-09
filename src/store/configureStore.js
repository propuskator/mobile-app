import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware                  from 'redux-thunk';
import reducers                         from '../reducers';

function bindMiddleware(middleware) {
    if (process.env.NODE_ENV !== 'production') {
        const createDebugger = require('redux-flipper').default;
        const { composeWithDevTools } = require('redux-devtools-extension');

        return composeWithDevTools(applyMiddleware(...middleware, createDebugger()));
    }

    return applyMiddleware(...middleware);
}

export default function configureStore(initialState) {
    const store = createStore(
        reducers,
        initialState,
        bindMiddleware([ thunkMiddleware ])
    );

    if (module.hot) {
        module.hot.accept('../reducers', () => {
            const nextRootReducer = require('../reducers/index').default;

            store.replaceReducer(nextRootReducer);
        });
    }

    return store;
}

// import module dari `redux`
import { combineReducers, createStore, applyMiddleware, compose } from 'redux';

// import redux-thunk middleware
import thunk from 'redux-thunk';

// import authReducer
import authReducer from '../features/Auth/reducer';

// buat composer enhancer untuk menghubungkan dengan Chrome DevTools Redux
const composerEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

// gabung reducer, untuk sementara kosong, karena kita belum membuat reducer
const rootReducers = combineReducers({
    auth: authReducer
});

// buat store, dan gunakan composerEnhancer + middleware thunk 
const store = createStore(rootReducers, composerEnhancer(applyMiddleware(thunk)));

// export store 
export default store

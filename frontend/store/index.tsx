import { combineReducers, configureStore } from '@reduxjs/toolkit';
import themeConfigSlice from '@/store/themeConfigSlice';
import adminslice from './adminslice';

const rootReducer = combineReducers({
    themeConfig: themeConfigSlice,
    admin: adminslice
});

export default configureStore({
    reducer: rootReducer,
});

export type IRootState = ReturnType<typeof rootReducer>;

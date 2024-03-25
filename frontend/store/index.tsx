import { combineReducers, configureStore } from '@reduxjs/toolkit';
import themeConfigSlice from '@/store/themeConfigSlice';
import adminslice from './adminslice';
import vendorSlice from './vendorSlice';

const rootReducer = combineReducers({
    themeConfig: themeConfigSlice,
    admin: adminslice,
    vendor: vendorSlice
});

export default configureStore({
    reducer: rootReducer,
});

export type IRootState = ReturnType<typeof rootReducer>;

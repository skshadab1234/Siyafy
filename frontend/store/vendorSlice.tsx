import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define the type for an admin object

// Define the type for the state

const adminSlice = createSlice({
    name: 'admin',
    initialState: {}, // Initial state is an empty object
    reducers: {
        addVendor(state, action: PayloadAction) {
            // Replace the entire state with the new Admin object
            return action.payload;
        },
        read(state, action: PayloadAction) {
            // Replace the entire state with the new data
            return action.payload;
        }
      
    },
});

export const { addVendor, read } = adminSlice.actions;

export default adminSlice.reducer;

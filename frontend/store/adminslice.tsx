import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define the type for an admin object
interface Admin {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string;
    profile_image: string;
    created_at: string;
    updated_at: string;
}

// Define the type for the state
type AdminState = Admin; // Changed to a single Admin object

const adminSlice = createSlice({
    name: 'admin',
    initialState: {} as AdminState, // Initial state is an empty object
    reducers: {
        addAdmin(state, action: PayloadAction<Admin>) {
            // Replace the entire state with the new Admin object
            return action.payload;
        },
        read(state, action: PayloadAction<AdminState>) {
            // Replace the entire state with the new data
            return action.payload;
        }
      
    },
});

export const { addAdmin, read } = adminSlice.actions;

export default adminSlice.reducer;

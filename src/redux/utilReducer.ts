import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    isOpenMobileNav: false,
    removeHeaderBorder: false,
    headerHeight: 0,
    activeTab: '/home/menu',
    isAdmin: false,
    role: null,
    lookupStatus: '',
}

export const utilSlice = createSlice({
    name: "util",
    initialState: initialState,
    reducers: {
        setOpenMobileNav: (state, action) => {
            state.isOpenMobileNav = action.payload;
        },
        setRemoveHeaderBorder: (state, action) => {
            state.removeHeaderBorder = action.payload;
        },
        setHeaderHeight: (state, action) => {
            state.headerHeight = action.payload;
        },
        setActiveTab: (state, action) => {
            state.activeTab = action.payload;
        },
        setAdmin: (state, action) => {
            state.isAdmin = action.payload;
        },
        setRole: (state, action) => {
            state.role = action.payload;
        },
        setLookupStatus: (state, action) => {
            state.lookupStatus = action.payload;
        }
    }
})

export const {
    setOpenMobileNav,
    setRemoveHeaderBorder,
    setHeaderHeight,
    setActiveTab,
    setAdmin,
    setRole,
    setLookupStatus,
} = utilSlice.actions;

export default utilSlice.reducer;
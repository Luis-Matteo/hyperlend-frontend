import { createSlice } from '@reduxjs/toolkit';

const sidebarSlice = createSlice({
  name: 'sidebar',
  initialState: {
    isOpen: false,
    modalOpen: false,
  },
  reducers: {
    toggleSidebar(state) {
      state.isOpen = !state.isOpen;
    },
    toggleModalOpen(state) {
      state.modalOpen = !state.modalOpen;
    },
  },
});

export const { toggleSidebar } = sidebarSlice.actions;
export const { toggleModalOpen } = sidebarSlice.actions;
export default sidebarSlice.reducer;

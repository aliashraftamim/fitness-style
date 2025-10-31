// import { createSlice } from "@reduxjs/toolkit";
// import { RootState } from "../../store";

// type TNotification = {
//   isRead: boolean;
// };

// const initialState: TNotification = {
//   isRead: true, // Default: all notifications read
// };

// const notificationSlice = createSlice({
//   name: "notification", // Changed from "auth" to "notification"
//   initialState,
//   reducers: {
//     setReadNotification: (state, action) => {
//       state.isRead = action.payload; // Accept true or false
//     },
//   },
// });

// // Export actions
// export const { setReadNotification } = notificationSlice.actions;

// // Export reducer
// export default notificationSlice.reducer;

// // Selector to get notification state
// export const selectIsNotificationRead = (state: RootState) =>
//   state.notification.isRead;

import { configureStore } from "@reduxjs/toolkit";

import notificationReducer from "./reducers/notificationReducer";
import statusReducer from "./reducers/statusReducer";
import blogReducer from "./reducers/blogReducer";
import userReducer from "./reducers/userReducer";
import authorsReducer from "./reducers/authorsReducer";

const store = configureStore({
  reducer: {
    notification: notificationReducer,
    status: statusReducer,
    blogs: blogReducer,
    user: userReducer,
    authors: authorsReducer,
  },
});

export default store;

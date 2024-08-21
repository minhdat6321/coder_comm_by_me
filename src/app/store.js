import { configureStore } from "@reduxjs/toolkit";
import commentReducer from "../features/comment/commentSlice.js"
import friendReducer from "../features/friend/friendSlice.js"
import postReducer from "../features/post/postSlice.js"
import userReducer from "../features/user/userSlice.js"

const rootReducer = {
  comment: commentReducer,
  friend: friendReducer,
  post: postReducer,
  user: userReducer,
};

const store = configureStore({
  reducer: rootReducer,
});

export default store;
import { createSlice } from "@reduxjs/toolkit"
import apiService from "../../app/apiService"
import { POST_PER_PAGE } from "../../app/config";
import { cloudinaryUpload } from "../../utils/cloudinary";
import { toast } from "react-toastify";

import { getCurrentUserProfile } from "../user/userSlice";

const initialState = {
  isLoading: false,
  error: null,
  postsById: {},
  currentPagePosts: [],
  totalPosts: 0,
};

const slice = createSlice({
  name: "post",
  initialState,
  reducers: {
    startLoading(state) {
      state.isLoading = true;
    },

    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },
    createPostSuccess(state, action) {
      state.isLoading = false;
      state.error = null;
      const newPost = action.payload.data
      if (state.currentPagePosts.length % POST_PER_PAGE === 0) {
        state.currentPagePosts.pop()
      }
      state.postsById[newPost._id] = newPost
      state.currentPagePosts.unshift(newPost._id)
    },
    getPostSuccess(state, action) {
      state.isLoading = false;
      state.error = null;
      const { posts, count } = action.payload.data
      posts.forEach((post) => {
        state.postsById[post._id] = post;
        if (!state.currentPagePosts.includes(post._id))
          state.currentPagePosts.push(post._id);
      });
      state.totalPosts = count;
    },
    sendPostReactionSuccess(state, action) {
      state.isLoading = false;
      state.error = null;
      const { postId, reactions } = action.payload;
      state.postsById[postId].reactions = reactions;
    },
    resetPosts(state, action) {
      state.postsById = {};
      state.currentPagePosts = [];
    },
    deletePostSuccess(state, action) {
      state.isLoading = false;
      state.error = null;
      const deletedPost = action.payload;

      state.currentPagePosts = state.currentPagePosts.filter(post => post !== deletedPost._id)

      delete state.postsById[deletedPost._id];
      state.totalPosts = state.totalPosts - 1;
    },
    updatePostSuccess(state, action) {
      state.isLoading = false;
      state.error = null;

      const editPost = action.payload
      console.log(`Edit Post: ${JSON.stringify(editPost)}`)
      state.postsById[editPost._id].content = editPost.content

      if (editPost.image) {
        state.postsById[editPost._id].image = editPost.image
      }
    }
  },
})
export const createPost = ({ content, image }) => async (dispatch) => {
  dispatch(slice.actions.startLoading());
  try {
    // upload image to cloudinary
    const imageUrl = await cloudinaryUpload(image);
    const response = await apiService.post("/posts", {
      content,
      image: imageUrl,
    });

    dispatch(slice.actions.createPostSuccess(response.data));
    toast.success("Post successfully");
    dispatch(getCurrentUserProfile());
  } catch (error) {
    dispatch(slice.actions.hasError(error.message));
  }
};

export const getPosts = ({ userId, page, limit = POST_PER_PAGE }) => async (dispatch) => {
  dispatch(slice.actions.startLoading());
  try {
    const params = { page, limit }
    const response = await apiService.get(`/posts/user/${userId}`, {
      params,
    });
    if (page === 1) dispatch(slice.actions.resetPosts())
    dispatch(slice.actions.getPostSuccess(response.data));

  } catch (error) {
    dispatch(slice.actions.hasError(error.message));
    toast.error(error.message);

  }

}

export const sendPostReaction = ({ postId, emoji }) => async (dispatch) => {
  dispatch(slice.actions.startLoading());
  try {
    const params = { targetType: "Post", targetId: postId, emoji }
    const response = await apiService.post(`/reactions`,
      params,
    );
    dispatch(slice.actions.sendPostReactionSuccess({
      reactions: response.data.data,
      postId
    }));
  } catch (error) {
    dispatch(slice.actions.hasError(error.message));
    toast.error(error.message);

  }
}
export const deletePost = ({ postId }) => async (dispatch) => {
  dispatch(slice.actions.startLoading());
  try {
    const response = await apiService.delete(`/posts/${postId}`);
    dispatch(slice.actions.deletePostSuccess(response.data.data));


    dispatch(getCurrentUserProfile());

    toast.success("Delete Post successfully");
  } catch (error) {
    dispatch(slice.actions.hasError(error.message));
    toast.error(error.message);

  }
}
export const updatePost = ({ content, image, postId }) => async (dispatch) => {
  dispatch(slice.actions.startLoading());
  try {
    // upload image to cloudinary
    const imageUrl = await cloudinaryUpload(image);
    const response = await apiService.put(`/posts/${postId}`, {
      content,
      image: imageUrl,
    });
    dispatch(slice.actions.updatePostSuccess(response.data.data));
    dispatch(getCurrentUserProfile());

    toast.success("EditPost successfully");
  } catch (error) {
    dispatch(slice.actions.hasError(error.message));
    toast.error(error.message);

  }
}



export default slice.reducer
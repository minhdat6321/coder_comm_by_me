import { createSlice } from "@reduxjs/toolkit"
import apiService from "../../app/apiService"
import { COMMENTS_PER_POST, POST_PER_PAGE } from "../../app/config";
import { toast } from "react-toastify";
import { getCurrentUserProfile } from "../user/userSlice";


const initialState = {
  isLoading: false,
  error: null,
  commentsById: {},
  commentsByPost: {},
  totalCommentsByPost: {},
  currentPageByPost: {},
};



const slice = createSlice({
  name: "comment",
  initialState,
  reducers: {
    startLoading(state) {
      state.isLoading = true;
    },

    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },

    createCommentSuccess(state, action) {
      state.isLoading = false;
      state.error = null;
    },
    getCommentSuccess(state, action) {

      state.isLoading = false;
      state.error = "";
      const { postId, page } = action.payload;
      const comments = action.payload.data.comments
      const count = action.payload.data.count


      comments.forEach(
        (comment) => (state.commentsById[comment._id] = comment)
      );
      state.commentsByPost[postId] = comments
        .map((comment) => comment._id)
        .reverse();
      state.totalCommentsByPost[postId] = count;
      state.currentPageByPost[postId] = page;
    },
    sendCommentReactionSuccess(state, action) {
      state.isLoading = false;
      state.error = "";
      const { commentId, reactions } = action.payload
      state.commentsById[commentId].reactions = reactions
    },
    deleteCommentSuccess(state, action) {
      state.isLoading = false;
      state.error = null;
      const deletedComment = action.payload;

      delete state.commentsById[deletedComment._id];
      state.commentsByPost[deletedComment.post] = state.commentsByPost[deletedComment.post].filter(commentId =>
        commentId !== deletedComment._id)
      state.totalCommentsByPost[deletedComment.post] = state.totalCommentsByPost[deletedComment.post] - 1;


    }

  },
})

export const createComment = ({ postId, content }) => async (dispatch) => {
  dispatch(slice.actions.startLoading());
  try {
    const response = await apiService.post("/comments", {
      content,
      postId,
    });
    dispatch(slice.actions.createCommentSuccess(response.data));
    dispatch(getComments({ postId }));

  } catch (error) {
    dispatch(slice.actions.hasError(error.message));
  }
};


export const getComments = ({ postId, page = 1, limit = COMMENTS_PER_POST }) => async (dispatch) => {
  dispatch(slice.actions.startLoading());
  try {
    const params = {
      page: page,
      limit: limit,
    }

    const response = await apiService.get(`/posts/${postId}/comments`, {
      params,
    });

    dispatch(slice.actions.getCommentSuccess({
      ...response.data,
      postId,
      page,
    }));
  } catch (error) {
    dispatch(slice.actions.hasError(error.message));
  }
};


export const sendCommentReaction = ({ commentId, emoji }) => async (dispatch) => {
  dispatch(slice.actions.startLoading());
  try {
    const params = {
      targetType: "Comment",
      targetId: commentId,
      emoji
    }

    const response = await apiService.post(`/reactions`, params);

    dispatch(slice.actions.sendCommentReactionSuccess({
      reactions: response.data.data,
      commentId,

    }));
  } catch (error) {
    dispatch(slice.actions.hasError(error.message));
  }
}

export const deleteComment = ({ commentId }) => async (dispatch) => {
  dispatch(slice.actions.startLoading());
  try {
    const response = await apiService.delete(`/comments/${commentId}`);
    dispatch(slice.actions.deleteCommentSuccess(response.data.data));
    console.log(`dataa tra ve: ${JSON.stringify(response.data.data)}`)


    toast.success("Delete Comment successfully");
  } catch (error) {
    dispatch(slice.actions.hasError(error.message));
    toast.error(error.message);

  }
}

export default slice.reducer
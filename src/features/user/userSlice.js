import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import apiService from "../../app/apiService";
import { cloudinaryUpload } from "../../utils/cloudinary";

const initialState = {
  isLoading: false,
  error: null,
  updatedProfile: null,
  selectedUser: null,
};

const slice = createSlice({
  name: "user",
  initialState,
  reducers: {
    startLoading(state) {
      state.isLoading = true;
    },

    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },

    updateUserProfileSuccess(state, action) {
      state.isLoading = false;
      state.error = null;

      const updatedUser = action.payload;
      state.updatedProfile = updatedUser;
    },

    getUserSuccess(state, action) {
      state.isLoading = false;
      state.error = null;

      state.selectedUser = action.payload;
    },
  },
});

export const getUser = (id) => async (dispatch) => {
  dispatch(slice.actions.startLoading());
  try {
    const response = await apiService.get(`/users/${id}`);
    dispatch(slice.actions.getUserSuccess(response.data.data));
  } catch (error) {
    dispatch(slice.actions.hasError(error));
    toast.error(error.message);
  }
};
export const updateUserProfile = ({ userId, name,
  coverUrl,
  aboutMe,
  city,
  country,
  company,
  jobTitle,
  avatarUrl,
  facebookLink,
  instagramLink,
  linkedinLink,
  twitterLink }) => async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const data = {
        name,
        coverUrl,
        aboutMe,
        city,
        country,
        company,
        jobTitle,
        facebookLink,
        instagramLink,
        linkedinLink,
        twitterLink,
      }
      if (avatarUrl instanceof File) {
        const imageUrl = await cloudinaryUpload(avatarUrl)
        data.avatarUrl = imageUrl
      }
      const response = await apiService.put(`/users/${userId}`, data);
      dispatch(slice.actions.updateUserProfileSuccess(response.data.data));
      toast.success("Updated profile successfully");

    } catch (error) {
      dispatch(slice.actions.hasError(error));
      toast.error(error.message);
    }
  };
export const getCurrentUserProfile = () => async (dispatch) => {
  dispatch(slice.actions.startLoading());
  try {
    const response = await apiService.get("/users/me");
    dispatch(slice.actions.updateUserProfileSuccess(response.data.data));
  } catch (error) {
    dispatch(slice.actions.hasError(error));
  }
};
export default slice.reducer;

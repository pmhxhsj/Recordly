import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IWorkspace } from "../../types/workspace";
import axios from "axios";

const initialState = {
  workspaceList: [],
};

const workspaceSlice = createSlice({
  name: "workspace",
  initialState,
  reducers: {
    setWorkspace: (state, action: PayloadAction<any>) => {
      state.workspaceList = action.payload;
    },
  },
});

export const { setWorkspace } = workspaceSlice.actions;

export const fetchWorkspace = () => {
  return async (dispatch: Function) => {
    axios
      .get("api/workspace")
      .then((res) => {
        dispatch(setWorkspace(res.data));
      })
      .catch((err) => {
        console.log(err);
      });
  };
};

export const filterWorkspaceList = (value: string) => {
  return async (dispatch: Function) => {
    axios
      .get("api/workspace")
      .then((res) => {
        const filterData = res.data.filter((v: IWorkspace) =>
          v.title.includes(value)
        );
        dispatch(setWorkspace(filterData));
      })
      .catch((err) => {
        console.log(err);
      });
  };
};

export default workspaceSlice.reducer;

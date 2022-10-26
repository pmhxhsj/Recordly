import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { IWorkspace } from "../../types/workspace";
import axios from "axios";

import Swal from "sweetalert2";
import sortBy from "lodash/sortBy";

const handleError = (err: any) => {
  if (err.response.data.error === 11000) {
    Swal.fire({
      position: "center",
      icon: "error",
      title: "중복된 이름이 있습니다.",
      showConfirmButton: false,
      timer: 1000,
    });
  } else {
    // 메모 수정 실패
    Swal.fire({
      position: "center",
      icon: "error",
      title: "메모 생성에 실패했습니다.",
      showConfirmButton: false,
      timer: 1000,
    });
  }
};

/**
 * 폴더에 있는 것 빼고 전체 workspace 불러오는 로직
 */
export const fetchWorkspaceList = createAsyncThunk(
  "workspace/fetchWorkspaceList",
  async () => {
    const response = await axios.get("/api/workspace");

    const filterData = response?.data.filter(
      (workspace: IWorkspace) => workspace.folder === null
    );

    return filterData;
  }
);

/**
 * 워크스페이스 생성
 */
export const postWorkspace = createAsyncThunk(
  "workspace/postFolderList",
  async (arg: { title: string; workspaceType: string }, { dispatch }) => {
    try {
      await axios.post("/api/workspace", {
        title: arg.title,
        workspaceType: arg.workspaceType,
      });

      dispatch(fetchWorkspaceList());
    } catch (err) {
      handleError(err);
    }
  }
);

/**
 * 워크스페이스 수정
 */
export const patchWorkspace = createAsyncThunk(
  "workspace/patchWorkspace",
  async (
    arg: { workspaceId: string; title?: string; folder?: string },
    { dispatch }
  ) => {
    try {
      await axios.patch(`/api/workspace/${arg.workspaceId}`, {
        workspaceId: arg.workspaceId,
        folder: arg.folder,
        title: arg.title,
      });

      dispatch(fetchWorkspaceList());
    } catch (err) {
      handleError(err);
    }
  }
);

export const deleteWorkspace = createAsyncThunk(
  "workspace/patchWorkspace",
  async (arg: { workspaceId: string }, { dispatch }) => {
    try {
      await axios.delete(`/api/workspace/${arg.workspaceId}`);

      Swal.fire({
        position: "center",
        icon: "success",
        title: "메모가 삭제 되었습니다.",

        showConfirmButton: false,
        timer: 1000,
      });

      dispatch(fetchWorkspaceList());
    } catch (err) {
      handleError(err);
    }
  }
);

/**
 * 전체 workspace 불러오는 로직
 */
export const fetchAllWorkspaceList = createAsyncThunk(
  "workspace/fetchAllWorkspaceList",
  async () => {
    const response = await axios.get("/api/workspace");

    return response?.data;
  }
);

/**
 * 특정 폴더의 workspace 불러오는 로직
 */
export const fetchWorkspaceInFolder = createAsyncThunk(
  "workspace/fetchWorkspaceInFolder",
  async (arg: { uid: string }) => {
    const response = await axios.get(`/api/folder/${arg.uid}/workspace`);

    return response?.data;
  }
);

/**
 * 검색에 포함된 workspace 불러오는 로직
 */
export const filterWorkspaceList = createAsyncThunk(
  "workspace/filterWorkspaceList",
  async (arg: { value: string }) => {
    const response = await axios.get("/api/workspace");

    const filterData = response.data.filter((v: IWorkspace) => {
      if (arg.value.length === 0) {
        return v.folder === null;
      } else {
        return v.title.includes(arg.value);
      }
    });

    return filterData;
  }
);

/**
 * 드롭다운(최신, 오래된 순)일 때 실행되는 로직
 */
export const sortWorkspaceList = createAsyncThunk(
  "workspace/sortWorkspaceList",
  async (arg: { type: String }) => {
    const response = await axios.get("/api/workspace");

    if (arg.type === "newest") {
      return response?.data;
    } else {
      const sortedData = sortBy(response.data, "editedAt");

      return sortedData;
    }
  }
);

/**
 * 즐겨찾기된 workspace 필터링 로직
 */
export const filterFavoritesWorkspaceList = createAsyncThunk(
  "workspace/filterFavoritesWorkspaceList",
  async () => {
    const response = await axios.get("/api/workspace");

    const filterFavoritesWorkspace = response.data.filter(
      (v: IWorkspace) => v.favorites
    );

    return filterFavoritesWorkspace;
  }
);

const initialState = {
  workspaceList: [],
  isLoading: false,
};

const workspaceSlice = createSlice({
  name: "workspace",
  initialState,
  reducers: {
    setWorkspaceList: (state, action: PayloadAction<any>) => {
      state.workspaceList = action.payload;
    },
  },
  extraReducers: {
    [fetchWorkspaceList.pending.type]: (state) => {
      state.isLoading = true;
    },
    [fetchWorkspaceList.fulfilled.type]: (state, action) => {
      state.workspaceList = action.payload;
      state.isLoading = false;
    },
    [fetchAllWorkspaceList.pending.type]: (state, action) => {
      state.workspaceList = action.payload;
      state.isLoading = true;
    },
    [fetchAllWorkspaceList.fulfilled.type]: (state) => {
      state.isLoading = false;
    },
    [fetchWorkspaceInFolder.pending.type]: (state) => {
      state.isLoading = true;
    },
    [fetchWorkspaceInFolder.fulfilled.type]: (state, action) => {
      state.workspaceList = action.payload;
      state.isLoading = false;
    },
    [filterWorkspaceList.pending.type]: (state) => {
      state.isLoading = true;
    },
    [filterWorkspaceList.fulfilled.type]: (state, action) => {
      state.workspaceList = action.payload;
      state.isLoading = false;
    },
    [filterFavoritesWorkspaceList.pending.type]: (state) => {
      state.isLoading = true;
    },
    [filterFavoritesWorkspaceList.fulfilled.type]: (state, action) => {
      state.workspaceList = action.payload;
      state.isLoading = false;
    },
    [sortWorkspaceList.pending.type]: (state) => {
      state.isLoading = true;
    },
    [sortWorkspaceList.fulfilled.type]: (state, action) => {
      state.workspaceList = action.payload;
      state.isLoading = false;
    },
  },
});

export const { setWorkspaceList } = workspaceSlice.actions;

export const actions = {
  fetchWorkspaceList,
  fetchAllWorkspaceList,
  fetchWorkspaceInFolder,
  filterWorkspaceList,
  filterFavoritesWorkspaceList,
  sortWorkspaceList,
  postWorkspace,
  patchWorkspace,
  deleteWorkspace,
};

export default workspaceSlice.reducer;

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { TOrder, TOrdersData } from '../../utils/types';
import { getFeedsApi } from '../../utils/burger-api';

type TFeedState = {
  allOrders: TOrder[];
  fetchError: string | null;
  totalCount: number;
  totalTodayCount: number;
  isFeedLoading: boolean;
};

const initialFeedState: TFeedState = {
  allOrders: [],
  fetchError: null,
  totalCount: 0,
  totalTodayCount: 0,
  isFeedLoading: false
};

export const fetchFeedData = createAsyncThunk<TOrdersData>(
  'feed/fetchFeedData',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getFeedsApi();
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.message || 'Не удалось загрузить данные ленты заказов'
      );
    }
  }
);

const feedSlice = createSlice({
  name: 'feed',
  initialState: initialFeedState,
  reducers: {},
  selectors: {
    selectCurrentOrders: (state) => state.allOrders,
    selectTotalOrders: (state) => state.totalCount,
    selectTotalTodayOrders: (state) => state.totalTodayCount,
    selectFeedLoadingStatus: (state) => state.isFeedLoading,
    selectFeedError: (state) => state.fetchError
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeedData.pending, (state) => {
        state.isFeedLoading = true;
        state.fetchError = null;
      })
      .addCase(
        fetchFeedData.fulfilled,
        (state, action: PayloadAction<TOrdersData>) => {
          state.isFeedLoading = false;
          state.allOrders = action.payload.orders;
          state.totalCount = action.payload.total;
          state.totalTodayCount = action.payload.totalToday;
        }
      )
      .addCase(fetchFeedData.rejected, (state, action) => {
        state.isFeedLoading = false;
        state.fetchError = action.payload as string;
      });
  }
});

export default feedSlice.reducer;

export const {
  selectCurrentOrders,
  selectTotalOrders,
  selectTotalTodayOrders,
  selectFeedLoadingStatus,
  selectFeedError
} = feedSlice.selectors;

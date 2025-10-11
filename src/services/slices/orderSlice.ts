import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TOrder } from '../../utils/types';
import {
  getOrderByNumberApi,
  getOrdersApi,
  orderBurgerApi
} from '../../utils/burger-api';

type TOrderState = {
  orderList: TOrder[];
  currentOrder: TOrder | null;
  newOrder: TOrder | null;
  isLoading: boolean;
  error: string | null;
};

const initialOrderState: TOrderState = {
  orderList: [],
  currentOrder: null,
  newOrder: null,
  isLoading: false,
  error: null
};

export const fetchUserOrders = createAsyncThunk<
  TOrder[],
  void,
  { rejectValue: string }
>('ordersManager/fetchUserOrders', async (_, { rejectWithValue }) => {
  try {
    const response = await getOrdersApi();
    return response;
  } catch (error: any) {
    return rejectWithValue('Не удалось получить список заказов');
  }
});

export const fetchOrderDetails = createAsyncThunk<
  TOrder,
  number,
  { rejectValue: string }
>(
  'ordersManager/fetchOrderDetails',
  async (orderNumber, { rejectWithValue }) => {
    try {
      const response = await getOrderByNumberApi(orderNumber);
      return response.orders[0];
    } catch (error: any) {
      return rejectWithValue('Не удалось получить детали заказа');
    }
  }
);

export const createNewOrder = createAsyncThunk<
  TOrder,
  string[],
  { rejectValue: string }
>(
  'ordersManager/createNewOrder',
  async (ingredientIds, { rejectWithValue }) => {
    try {
      const response = await orderBurgerApi(ingredientIds);
      return response.order;
    } catch (error: any) {
      return rejectWithValue('Ошибка создания заказа');
    }
  }
);

const orderSlice = createSlice({
  name: 'orders',
  initialState: initialOrderState,
  reducers: {
    clearNewOrder: (state) => {
      state.newOrder = null;
    },
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    },
    clearOrderError: (state) => {
      state.error = null;
    },
    resetOrderState: () => initialOrderState
  },
  selectors: {
    selectAllOrders: (state) => state.orderList,
    selectOrderDetails: (state) => state.currentOrder,
    selectCreatedOrder: (state) => state.newOrder,
    selectOrderLoading: (state) => state.isLoading,
    selectOrderError: (state) => state.error
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        fetchUserOrders.fulfilled,
        (state, action: PayloadAction<TOrder[]>) => {
          state.isLoading = false;
          state.orderList = action.payload;
        }
      )
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchOrderDetails.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.currentOrder = null;
      })
      .addCase(
        fetchOrderDetails.fulfilled,
        (state, action: PayloadAction<TOrder>) => {
          state.isLoading = false;
          state.currentOrder = action.payload;
        }
      )
      .addCase(fetchOrderDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.currentOrder = null;
      })
      .addCase(createNewOrder.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.newOrder = null;
      })
      .addCase(
        createNewOrder.fulfilled,
        (state, action: PayloadAction<TOrder>) => {
          state.isLoading = false;
          state.newOrder = action.payload;
        }
      )
      .addCase(createNewOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.newOrder = null;
      });
  }
});

export const {
  clearNewOrder,
  clearCurrentOrder,
  clearOrderError,
  resetOrderState
} = orderSlice.actions;

export const {
  selectAllOrders,
  selectOrderDetails,
  selectCreatedOrder,
  selectOrderLoading,
  selectOrderError
} = orderSlice.selectors;

export default orderSlice.reducer;

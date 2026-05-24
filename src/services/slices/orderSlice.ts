import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { orderBurgerApi, getOrderByNumberApi } from '../../utils/burger-api';
import { TOrder } from '@utils-types';
import { getOrdersApi } from '../../utils/burger-api';

interface TOrderState {
  orders: TOrder[];
  orderByNumber: TOrder | null;
  orderRequest: boolean;
  orderModalData: TOrder | null;
  error: string | null;
}

const initialState: TOrderState = {
  orders: [],
  orderByNumber: null,
  orderRequest: false,
  orderModalData: null,
  error: null
};

export const getOrderByNumber = createAsyncThunk(
  'order/getByNumber',
  async (number: number) => {
    const res = await getOrderByNumberApi(number);
    // API возвращает { success: boolean, orders: TOrder[] }
    return res.orders[0];
  }
);

export const fetchUserOrders = createAsyncThunk('order/fetchAll', async () => {
  const res = await getOrdersApi();
  return res;
});

export const createOrder = createAsyncThunk(
  'order/create',
  async (ingredientIds: string[]) => {
    const res = await orderBurgerApi(ingredientIds);
    return res.order;
  }
);

export const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearOrderData: (state) => {
      state.orderModalData = null;
      state.orderByNumber = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.orderRequest = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orderModalData = action.payload as unknown as TOrder;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.orderRequest = false;
        state.error = action.error.message || 'Ошибка оформления заказа';
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.orders = action.payload;
      })
      .addCase(getOrderByNumber.pending, (state) => {
        state.orderRequest = true;
      })
      .addCase(getOrderByNumber.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orderByNumber = action.payload;
      })
      .addCase(getOrderByNumber.rejected, (state, action) => {
        state.orderRequest = false;
        state.error = action.error.message || 'Ошибка загрузки заказа';
      });
  }
});

export const { clearOrderData } = orderSlice.actions;
export default orderSlice.reducer;

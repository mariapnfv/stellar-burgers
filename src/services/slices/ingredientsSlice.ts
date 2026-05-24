import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getIngredientsApi } from '../../utils/burger-api';
import { TIngredient } from '@utils-types';
import { RootState } from '../store';
interface IIngredientsState {
  ingredients: TIngredient[];
  isIngredientsLoading: boolean;
  error: string | null;
}

const initialState: IIngredientsState = {
  ingredients: [],
  isIngredientsLoading: false,
  error: null
};

export const fetchIngredients = createAsyncThunk(
  'ingredients/fetchIngredients',
  async () => await getIngredientsApi(),
  {
    condition: (_, { getState }) => {
      const { ingredients, isIngredientsLoading } = (getState() as RootState)
        .ingredients;

      if (isIngredientsLoading || ingredients.length > 0) {
        return false;
      }
    }
  }
);

export const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredients.pending, (state) => {
        state.isIngredientsLoading = true;
        state.error = null;
      })
      .addCase(fetchIngredients.fulfilled, (state, action) => {
        state.isIngredientsLoading = false;
        state.ingredients = action.payload;
      })
      .addCase(fetchIngredients.rejected, (state, action) => {
        state.isIngredientsLoading = false;
        state.error = action.error.message || 'Ошибка загрузки';
      });
  }
});

export default ingredientsSlice.reducer;

import { configureStore } from '@reduxjs/toolkit';

import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';

import ingredientsReducer from './slices/ingredientsSlice';
import profileReducer from './slices/profileSlice';
import loginReducer from './slices/loginSlice';
import registerReducer from './slices/registerSlice';
import burgerConstructorReducer from './slices/burgerConstructorSlice';
import feedReducer from './slices/feedSlice';
import orderReducer from './slices/orderSlice';

const store = configureStore({
  reducer: {
    ingredients: ingredientsReducer,
    profile: profileReducer,
    login: loginReducer,
    register: registerReducer,
    burgerConstructor: burgerConstructorReducer,
    feed: feedReducer,
    orders: orderReducer
  },
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = () => dispatchHook<AppDispatch>();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;

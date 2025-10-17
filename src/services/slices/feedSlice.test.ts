import { configureStore } from '@reduxjs/toolkit';
import feedReducer, {
  fetchFeedData,
  selectCurrentOrders,
  selectTotalOrders,
  selectTotalTodayOrders,
  selectFeedLoadingStatus,
  selectFeedError
} from './feedSlice';
import { getFeedsApi } from '../../utils/burger-api';
import { TOrder, TOrdersData } from '../../utils/types';

jest.mock('../../utils/burger-api', () => ({
  getFeedsApi: jest.fn()
}));

const mockOrders: TOrder[] = [
  {
    _id: '1',
    ingredients: ['ingr1'],
    status: 'done',
    name: 'Burger 1',
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z',
    number: 1001
  }
];
const mockFeedResponse: TOrdersData = {
  orders: mockOrders,
  total: 1500,
  totalToday: 25
};

describe('feedSlice', () => {
  const initialState = {
    allOrders: [],
    fetchError: null,
    totalCount: 0,
    totalTodayCount: 0,
    isFeedLoading: false
  };

  it('should handle initial state', () => {
    expect(feedReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  describe('fetchFeedData async thunk', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should handle pending', () => {
      const action = { type: fetchFeedData.pending.type };
      const state = feedReducer(initialState, action);
      expect(state.isFeedLoading).toBe(true);
      expect(state.fetchError).toBeNull();
    });

    it('should handle fulfilled', () => {
      const action = {
        type: fetchFeedData.fulfilled.type,
        payload: mockFeedResponse
      };
      const state = feedReducer(initialState, action);
      expect(state.isFeedLoading).toBe(false);
      expect(state.allOrders).toEqual(mockOrders);
      expect(state.totalCount).toBe(1500);
      expect(state.totalTodayCount).toBe(25);
    });

    it('should handle rejected', () => {
      const action = {
        type: fetchFeedData.rejected.type,
        payload: 'Network error'
      };
      const state = feedReducer(initialState, action);
      expect(state.isFeedLoading).toBe(false);
      expect(state.fetchError).toBe('Network error');
    });

    it('should fetch feed data successfully in a store', async () => {
      (getFeedsApi as jest.Mock).mockResolvedValue(mockFeedResponse);

      const store = configureStore({
        reducer: { feed: feedReducer }
      });

      await store.dispatch(fetchFeedData());

      const state = store.getState().feed;
      expect(state.allOrders).toEqual(mockOrders);
      expect(state.totalCount).toBe(1500);
      expect(state.isFeedLoading).toBe(false);
    });

    it('should handle API error in store', async () => {
      (getFeedsApi as jest.Mock).mockRejectedValue(new Error('API failed'));

      const store = configureStore({
        reducer: { feed: feedReducer }
      });

      await store.dispatch(fetchFeedData());

      const state = store.getState().feed;
      expect(state.isFeedLoading).toBe(false);
      expect(state.fetchError).toBe('API failed');
    });
  });

  describe('selectors', () => {
    const mockState = {
      feed: {
        allOrders: mockOrders,
        totalCount: 2000,
        totalTodayCount: 30,
        isFeedLoading: true,
        fetchError: 'error'
      }
    };

    it('should select current orders', () => {
      expect(selectCurrentOrders(mockState)).toEqual(mockOrders);
    });

    it('should select total orders', () => {
      expect(selectTotalOrders(mockState)).toBe(2000);
    });

    it('should select total today orders', () => {
      expect(selectTotalTodayOrders(mockState)).toBe(30);
    });

    it('should select loading status', () => {
      expect(selectFeedLoadingStatus(mockState)).toBe(true);
    });

    it('should select feed error', () => {
      expect(selectFeedError(mockState)).toBe('error');
    });
  });
});

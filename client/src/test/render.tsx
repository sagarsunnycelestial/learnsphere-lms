import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { render } from '@testing-library/react';
import type { RenderOptions } from '@testing-library/react';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router';
import { ThemeProvider } from '@mui/material/styles';
import type { ReactElement } from 'react';
import authReducer from '../store/slices/authSlice';
import themeReducer from '../store/slices/themeSlice';
import formReducer from '../store/slices/formSlice';
import profileReducer from '../store/slices/profileSlice';
import { lightTheme } from '../theme/theme';

const rootReducer = combineReducers({
  theme: themeReducer,
  auth: authReducer,
  form: formReducer,
  profile: profileReducer,
});

export type TestRootState = ReturnType<typeof rootReducer>;

export function createTestStore(preloadedState?: Partial<TestRootState>) {
  return configureStore({
    reducer: rootReducer,
    preloadedState: preloadedState as TestRootState | undefined,
  });
}

export type TestStore = ReturnType<typeof createTestStore>;

export function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0 },
      mutations: { retry: false },
    },
  });
}

type RenderWithProvidersOptions = Omit<RenderOptions, 'wrapper'> & {
  route?: string;
  store?: TestStore;
};

export function renderWithProviders(
  ui: ReactElement,
  {
    route = '/',
    store = createTestStore(),
    ...options
  }: RenderWithProvidersOptions = {}
) {
  const queryClient = createTestQueryClient();

  return {
    store,
    queryClient,
    ...render(
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider theme={lightTheme}>
            <MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>
          </ThemeProvider>
        </QueryClientProvider>
      </Provider>,
      options
    ),
  };
}

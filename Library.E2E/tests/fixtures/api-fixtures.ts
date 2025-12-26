import { test as baseTest, expect as baseExpect, request } from '@playwright/test';
import { ApiHelper } from '../utils/api-helpers';

type ApiFixtures = {
  api: ApiHelper;
};

export const test = baseTest.extend<ApiFixtures>({
  api: async ({ }, use) => {
    const apiContext = await request.newContext({
      baseURL: 'http://localhost:5000', // current backend url, might move to a config later
      extraHTTPHeaders: {
        'Content-Type': 'application/json',
      },
    });

    const api = new ApiHelper(apiContext);
    await use(api);

    await apiContext.dispose();
  },
});

export const expect = baseExpect;

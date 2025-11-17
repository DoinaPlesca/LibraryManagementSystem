import { test as baseTest, expect as baseExpect, APIRequestContext } from "@playwright/test";
import { ApiHelper } from "../utils/api-helpers";

type ApiFixtures = {
  api: ApiHelper;
};

export const test = baseTest.extend<ApiFixtures>({
  api: async ({ request }, use) => {
    const api = new ApiHelper(request);
    await use(api);
  }
});

export const expect = baseExpect;

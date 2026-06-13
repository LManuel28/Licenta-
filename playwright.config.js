// @ts-nocheck
const { defineConfig, devices } = require("@playwright/test");

module.exports = defineConfig({
  testDir: "./tests",
  timeout: 240000,
  retries: 0,
  workers: 1,
  reporter: [
    ["list"],
    ["html", { open: "always", outputFolder: "playwright-report" }],
  ],
  use: {
    baseURL: "http://localhost:8080",
    headless: false,
    screenshot: "on",
    video: "on",
    trace: "on",
    slowMo: 0,
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: "npx serve app -p 8080 --single --no-clipboard",
    url: "http://localhost:8080",
    reuseExistingServer: true,
    timeout: 15000,
  },
});

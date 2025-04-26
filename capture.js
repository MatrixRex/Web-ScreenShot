const puppeteer = require("puppeteer");
const path = require("path");
const fs = require("fs");
const os = require("os");

const CHROME_PATH = puppeteer.executablePath();

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  // Set the custom user-agent (you can set it to match popular browsers)
  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
  );
  await page.goto("https://example.com");
  await page.screenshot({ path: "screenshot.png" });
  await browser.close();
})();

async function captureScreenshot(url, width) {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: "new",
  });

  const page = await browser.newPage();
  await page.setViewport({ width: parseInt(width), height: 800 });

  try {
    await page.goto(url, {
      waitUntil: "networkidle0",
      timeout: 60000,
    });

    // Get the full height of the page
    const bodyHeight = await page.evaluate(() => {
      return Math.max(
        document.body.scrollHeight,
        document.documentElement.scrollHeight,
        document.body.offsetHeight,
        document.documentElement.offsetHeight
      );
    });

    // Set viewport to match content
    await page.setViewport({ width: parseInt(width), height: bodyHeight });

    const outputPath = path.join(os.tmpdir(), `screenshot_${Date.now()}.png`);
    await page.screenshot({
      path: outputPath,
      fullPage: false, // We don't need fullPage since we set correct height
    });

    await browser.close();
    return outputPath;
  } catch (err) {
    await browser.close();
    throw new Error("Failed to load the page: " + err.message);
  }
}

module.exports = { captureScreenshot };

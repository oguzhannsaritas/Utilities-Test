import {SignInStaticSelectors} from "../helpers/pages/signIn/selectors/signInStaticSelectors";
import {expect} from "@playwright/test";
import {addPhoto} from "../helpers/app/s3";
const { request } = require('@playwright/test');



export function getNavigation(page) {

   return customByRole(page, SignInStaticSelectors.navigationSideBar);
}

export async function customHover(element) {
   await element.hover();
}

export function customWaitForTimeout(time) {

   return new Promise(resolve => setTimeout(resolve, time));
}


export function exitButton(page){

   return customByRole(page, 'navigation').locator('div').filter({ hasText: SignInStaticSelectors.exitButton }).getByRole('link').nth(2)
}

export function waitForLoadState(page) {

   return page.waitForLoadState('load');
}

export async function customClick(locator, stepDescription, page, options = {}) {
   try {
      if (!locator) {
         throw new Error(`Locator is undefined at step: ${stepDescription}`);
      }
      console.log(`WAITING FOR ELEMENT TO BE ATTACHED: ${locator}`);
      await locator.waitFor({ state: 'attached' });
      console.log(`ELEMENT IS ATTACHED, NOW CLICKING`);
      await locator.click(options);
      console.log(`CLICKED ON ELEMENT: ${locator}`);
   } catch (error) {
      console.error(`ERROR CLICKING ON ELEMENT at step: ${stepDescription} - ${error}`);
      await captureError(page, error, stepDescription);
      throw error;
   }
}



export async function customFill(locator, value, stepDescription, page) {
   try {
      console.log(`WAITING FOR ELEMENT TO BE VISIBLE: ${locator}`);
      await locator.waitFor({ state: 'visible' });
      console.log(`ELEMENT IS VISIBLE, NOW FILLING`);
      await locator.fill(value);
      console.log(`FILLED ELEMENT WITH VALUE: ${value}`);
      const inputValue = await locator.inputValue();
      console.log(`ELEMENT VALUE AFTER FILL: ${inputValue}`);
      expect(inputValue).toBe(value);
   } catch (error) {
      console.error(`ERROR FILLING ELEMENT at step: ${stepDescription} - ${error}`);
      await captureError(page, error, stepDescription);
      throw error;
   }
}

export function customPlaceholder(page, placeholder) {
   try {
      console.log(`FINDING ELEMENT WITH PLACEHOLDER: ${placeholder}`);
      const element = page.locator(`[placeholder="${placeholder}"]`);
      console.log(`FOUND ELEMENT WITH PLACEHOLDER: ${placeholder}`);

      return element;
   } catch (error) {
      console.error(`ERROR FINDING ELEMENT WITH PLACEHOLDER: ${placeholder} - ${error}`);
      throw error;
   }
}

export function customLocator(page, selector, { isText = false } = {}) {
   try {
      let finalSelector = selector;
      if (isText) {
         finalSelector = `text=${selector}`;
      }

      console.log(`FINDING ELEMENT WITH SELECTOR: ${finalSelector}`);
      const element = page.locator(finalSelector);
      console.log(`FOUND ELEMENT WITH SELECTOR: ${finalSelector}`);

      return element;
   } catch (error) {
      console.error(`ERROR FINDING ELEMENT WITH SELECTOR: ${selector} - ${error}`);
      throw error;
   }
}

export function customByText(page, text, options = {}) {
   try {
      console.log(`FINDING ELEMENT WITH TEXT: ${text}`);
      const element = page.getByText(text, options);
      console.log(`FOUND ELEMENT WITH TEXT: ${text}`);

      return element;
   } catch (error) {
      console.error(`ERROR FINDING ELEMENT WITH TEXT: ${text} - ${error}`);
      throw error;
   }
}


export function customByRole(page, role, options = {}) {
   try {
      console.log(`FINDING ELEMENT WITH ROLE: ${role}`);
      const element = page.getByRole(role, options);
      console.log(`FOUND ELEMENT WITH ROLE: ${role}`);

      return element;
   } catch (error) {
      console.error(`ERROR FINDING ELEMENT WITH ROLE: ${role} - ${error}`);
      throw error;
   }
}

//Take a screenshot
global.captureError = async function(page, error, step) {
   console.error(`ERROR OCCURRED AT STEP: ${step} - ${error}`);


   const screenshotPath = `error_${step}.png`;  // We will use it as the file name when uploading to S3
   const screenshotBuffer = await page.screenshot();  // We take the screenshot as buffer

   // Upload screenshot to S3
   try {
      await addPhoto(screenshotBuffer, screenshotPath, 'Error');  // Buffer and filename are used when uploading to S3
   } catch (s3Error) {
      console.error(`Failed to upload screenshot to S3: ${s3Error.message}`);
   }

   throw new Error(`Step: ${step} - ${error.message}`);
}


global.captureSuccess = async function(page, step) {

   const screenshotPath = `success_${step}.png`;
   const screenshotBuffer = await page.screenshot();  // Take screenshot as Buffer

   try {
      await addPhoto(screenshotBuffer, screenshotPath, 'Success');  // S3' downloads
   } catch (s3Error) {
      console.error(`Failed to upload success screenshot to S3: ${s3Error.message}`);
   }
};







export function waitForNoMoreRequestsForPath(
    page,
    networkTracking,
    path,
    idleTime = 2000,
    maxOverallTime = 40000
) {
   return new Promise((resolve, reject) => {
      const startTime = Date.now();
      let lastActivityTime = Date.now(); // Will be updated when the request starts or ends
      const activeRequests = new Set();  // Keeps the IDs of requests that match the path and have not finished yet

      // --- Event handlers ---

      //  The request begins
      function onRequest(request) {
         if (
             request.method() === "GET" &&
             request.url().includes(path)
         ) {
            activeRequests.add(request._requestId); // Playwright internal ID (bazı versiyonlarda değişiklik gösterebilir)
            lastActivityTime = Date.now();
         }
      }

      // The request completed successfully
      function onRequestFinished(request) {
         if (
             request.method() === "GET" &&
             request.url().includes(path)
         ) {
            activeRequests.delete(request._requestId);
            lastActivityTime = Date.now();
         }
      }

      //  The request ended with an error (fail).
      function onRequestFailed(request) {
         if (
             request.method() === "GET" &&
             request.url().includes(path)
         ) {
            activeRequests.delete(request._requestId);
            lastActivityTime = Date.now();
         }
      }

      // --- Listen for events ---
      page.on("request", onRequest);
      page.on("requestfinished", onRequestFinished);
      page.on("requestfailed", onRequestFailed);

      // --- Control loop ---
      function checkIdle() {
         const now = Date.now();

         // OK if there are no active requests and idleTime has passed
         if (activeRequests.size === 0 && now - lastActivityTime >= idleTime) {
            cleanup();
            resolve();
            return;
         }

         // Error if total waiting time has expired
         if (now - startTime >= maxOverallTime) {
            cleanup();
            reject(
                new Error(
                    `Belirtilen ${
                        maxOverallTime / 1000
                    } sn içinde ${path} istekleri bitmedi!`
                )
            );
            return;
         }

         // Short wait for rechecking
         setTimeout(checkIdle, 500);
      }

      // --- Cleanup (drop events) ---
      function cleanup() {
         page.off("request", onRequest);
         page.off("requestfinished", onRequestFinished);
         page.off("requestfailed", onRequestFailed);
      }

      checkIdle(); // starts
   });
}



export async function trackPackageGroupFlow(page, networkTracking) {
   const detailRequest = await networkTracking.get("/YOUR API");
   const detailPayloadObj = JSON.parse(detailRequest.payload || "{}");
   const packageGroupID = detailPayloadObj.packageGroupID;
   if (!packageGroupID) {
      throw new Error(
          "packageGroupID not found! Check payload of request /package/group/detail."
      );
   }
   console.log("Received packageGroupID :", packageGroupID);

   const runPackagePath = `/YOUR API/${packageGroupID}`;
   const runPackageRequest = await networkTracking.get(runPackagePath);

   const runPackageResponse = runPackageRequest.response.responseBody;
   const jobID = runPackageResponse?.jobID;
   if (!jobID) {
      throw new Error(
          `jobID not found! Check the response of the ${runPackagePath} request.`
      );
   }
   console.log("Received jobID :", jobID);

   const statusPath = `YOUR API/${jobID}`;
   await waitForNoMoreRequestsForPath(page, networkTracking, statusPath, 5000, 360000);

   const statusRequest = await networkTracking.get(statusPath);
   const statusResponse = statusRequest.response.responseBody;
   console.log("package-group-status final response JSON:");
   console.log(JSON.stringify(statusResponse, null, 2));
}


export async function trackReportFlow(page, networkTracking) {
   const insightListRequest = await networkTracking.get("YOUR API");
   if (!insightListRequest) {
      throw new Error("‼ YOUR API request not caught!");
   }

   const insightPayload = JSON.parse(insightListRequest.payload || "{}");
   const packagesArray = insightPayload.packages;

   if (!packagesArray || !packagesArray.length) {
      throw new Error("‼ 'packages' not found in YOUR API request payload!");
   }

   console.log("Packages taken from YOUR API :", packagesArray);

   const runPackagePath = `YOUR API${packagesArray[0]}`;
   const runPackageRequest = await networkTracking.get(runPackagePath);
   if (!runPackageRequest) {
      throw new Error(`‼ ${runPackagePath} request not caught!`);
   }

   const runPackageReqPayload = JSON.parse(runPackageRequest.payload || "{}");
   const clientID = runPackageReqPayload.clientID;
   if (!clientID) {
      throw new Error(
          `‼ No clientID found in payload of request ${runPackagePath}!`
      );
   }

   const runPackageResponseBody = runPackageRequest.response.responseBody;
   const reportID = runPackageResponseBody?.reportID;
   if (!reportID) {
      throw new Error(
          `‼ ReportID not found in response to request ${runPackagePath}!`
      );
   }

   console.log("/ :", clientID);
   console.log("/ :", reportID);

   const clientReportPath = `YOUR API${clientID}/YOUR API/${reportID}`;
   console.log(`Now we track ${clientReportPath} requests...`);

   await waitForNoMoreRequestsForPath(page, networkTracking, clientReportPath, 5000, 360000);

   console.log(`${clientReportPath} requests completed.`);

   const finalRequest = await networkTracking.get(clientReportPath);
   if (!finalRequest) {
      console.log("‼ Latest request not found! We probably didn't catch any YOUR API/... requests.");
      return;
   }

   const finalResponse = finalRequest?.response?.responseBody;
   console.log("Response JSON format of the last request :");
   console.log(JSON.stringify(finalResponse, null, 2));
}

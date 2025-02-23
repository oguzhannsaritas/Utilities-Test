### Utility Functions for Playwright Testing

#### `getNavigation(page)`
- **Description:** Retrieves the navigation sidebar element on the page.
- **Input:**
    - `page`: The page object.
- **Output:** Returns the navigation sidebar element.
- **Error Handling:** None.

#### `customHover(element)`
- **Description:** Hovers over the specified element.
- **Input:**
    - `element`: The element to hover over.
- **Output:** None.
- **Error Handling:** None.

#### `customWaitForTimeout(time)`
- **Description:** Waits for a specified amount of time.
- **Input:**
    - `time`: The time to wait in milliseconds.
- **Output:** Returns a promise that resolves after the specified time.
- **Error Handling:** None.

#### `exitButton(page)`
- **Description:** Retrieves the exit button element from the navigation sidebar.
- **Input:**
    - `page`: The page object.
- **Output:** Returns the exit button element.
- **Error Handling:** None.

#### `waitForLoadState(page)`
- **Description:** Waits for the page to reach the 'load' state.
- **Input:**
    - `page`: The page object.
- **Output:** Returns a promise that resolves when the page is fully loaded.
- **Error Handling:** None.

#### `async customClick(locator, stepDescription, page, options = {})`
- **Description:** Clicks on a specified element and handles errors.
- **Input:**
    - `locator`: The element locator.
    - `stepDescription`: Description of the current step for error reporting.
    - `page`: The page object.
    - `options`: (Optional) Click options.
- **Output:** None.
- **Error Handling:** Captures a screenshot and logs an error if the click fails.

#### `async customFill(locator, value, stepDescription, page)`
- **Description:** Fills a specified element with a value and verifies the input.
- **Input:**
    - `locator`: The element locator.
    - `value`: The value to fill.
    - `stepDescription`: Description of the current step for error reporting.
    - `page`: The page object.
- **Output:** None.
- **Error Handling:** Captures a screenshot and logs an error if the fill fails.

#### `customPlaceholder(page, placeholder)`
- **Description:** Finds an element with a specific placeholder.
- **Input:**
    - `page`: The page object.
    - `placeholder`: The placeholder text.
- **Output:** Returns the element with the specified placeholder.
- **Error Handling:** Logs and throws an error if the element is not found.

#### `customLocator(page, selector)`
- **Description:** Finds an element with a specific selector.
- **Input:**
    - `page`: The page object.
    - `selector`: The CSS selector.
- **Output:** Returns the element with the specified selector.
- **Error Handling:** Logs and throws an error if the element is not found.

#### `customByText(page, text, options = {})`
- **Description:** Finds an element containing specific text.
- **Input:**
    - `page`: The page object.
    - `text`: The text to search for.
    - `options`: (Optional) Search options.
- **Output:** Returns the element containing the specified text.
- **Error Handling:** Logs and throws an error if the element is not found.

#### `customByRole(page, role, options = {})`
- **Description:** Finds an element with a specific role.
- **Input:**
    - `page`: The page object.
    - `role`: The role to search for.
    - `options`: (Optional) Search options.
- **Output:** Returns the element with the specified role.
- **Error Handling:** Logs and throws an error if the element is not found.

#### `async captureError(page, error, step)`
- **Description:** Captures a screenshot and logs an error message.
- **Input:**
    - `page`: The page object.
    - `error`: The error object.
    - `step`: The step description for error reporting.
- **Output:** None.
- **Error Handling:** Throws a new error with the step and original error message.



#### `async waitForNoMoreRequestsForPath`
- **Description:** It checks the specified request at 5-second intervals in multiple request pulses.
- **Error Handling:** If a request is not made within a certain number of seconds, the control ends. If the request waits for more than a certain period of time, the check ends.


#### `async trackPackageGroupFlow(page, networkTracking)`
- **Description:** Tracks the flow of a package group. It starts by monitoring the `/YOUR API` API to retrieve the `packageGroupID`. The retrieved `packageGroupID` is then used to make a request to `/v1/package/run-package-group/${packageGroupID}`, where the `jobID` is extracted. The process continues by tracking the `/v1/package/package-group-status/${jobID}` API. Finally, using the `waitForNoMoreRequestsForPath` function, the last specified API is monitored, and the final request's JSON response is logged to the console..
- **Error Handling:** If a request is not made within a certain number of seconds, the control ends. If the request waits for more than a certain period of time, the check ends.



#### `async trackReportFlow(page, networkTracking)`
- **Description:** Tracks the flow of a report. It starts by monitoring the `/package/insight/list` API to retrieve the `packages` value. The retrieved value is then used in the `/v1/package/run-package/${packagesArray[0]}` API, where `reportID` and `clientID` are extracted. These values are then used in the `/v1/clients/${clientID}/reports/${reportID}` API. Finally, the `waitForNoMoreRequestsForPath` function monitors the specified API until the last request is made, and the response of the final request is logged to the console in JSON format.
- **Error Handling:** If a request is not made within a certain number of seconds, the control ends. If the request waits for more than a certain period of time, the check ends.

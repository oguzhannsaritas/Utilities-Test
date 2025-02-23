### Network Class Function Descriptions

#### `constructor`
- **Description:** Initializes a new Network object.
- **Input:**
    - `url`: The URL of the network request.
    - `method`: The HTTP method of the request (GET, POST, etc.).
    - `payload`: The request payload, if any.
    - `headers`: The request headers.
    - `status`: The HTTP status code of the response (default is null).
    - `startTime`: The timestamp when the request started.
    - `responseBody`: The response body (default is null).
    - `responseTime`: The response time (default is null).
- **Output:** None.

#### `setResponse({ statusCode, responseBody, responseHeaders, elapsedTime })`
- **Description:** Sets response details and calculates the elapsed time.
- **Input:**
    - `statusCode`: The HTTP status code of the response.
    - `responseBody`: The response body.
    - `responseHeaders`: The response headers.
    - `elapsedTime`: The elapsed time for the request.
- **Output:** None.
- **Error Handling:** Calls `raiseForStatus` to throw an error if the status code indicates a failure.

#### `raiseForStatus()`
- **Description:** Throws an error if the response status code indicates a failure.
- **Input:** None.
- **Output:** None.
- **Error Handling:** Throws an error if the status code is less than 200 or greater than or equal to 400, or if the status code is null.

#### `static async getHeaders(networkTracking, path)`
- **Description:** Retrieves and normalizes headers for a specific path.
- **Input:**
    - `networkTracking`: The network tracking object.
    - `path`: The path to retrieve headers for.
- **Output:** Returns an object containing request and response headers.
- **Error Handling:** Throws an error if no network data is found for the path.

#### `static async getHeader(networkTracking, path, key)`
- **Description:** Retrieves a specific header value for a given path.
- **Input:**
    - `networkTracking`: The network tracking object.
    - `path`: The path to retrieve the header for.
    - `key`: The key of the header to retrieve.
- **Output:** Returns the value of the specified header.
- **Error Handling:** Throws an error if headers are not found for the path.

#### `static async getBaseUrl(networkTracking, path)`
- **Description:** Retrieves the base URL for a specific path.
- **Input:**
    - `networkTracking`: The network tracking object.
    - `path`: The path to retrieve the base URL for.
- **Output:** Returns the base URL of the network request.
- **Error Handling:** Throws an error if no network data is found for the path.

#### `static async getFullData(networkTracking, path)`
- **Description:** Retrieves the full data for a specific path.
- **Input:**
    - `networkTracking`: The network tracking object.
    - `path`: The path to retrieve the full data for.
- **Output:** Returns an object containing the full network data.
- **Error Handling:** None.

#### `static async getAllRequests(networkTracking)`
- **Description:** Retrieves all network requests.
- **Input:**
    - `networkTracking`: The network tracking object.
- **Output:** Returns all network requests.
- **Error Handling:** None.

#### `static getNetworkData(networkjson, path)`
- **Description:** Retrieves network data for a specific path.
- **Input:**
    - `networkjson`: The network JSON object.
    - `path`: The path to retrieve the network data for.
- **Output:** Returns the network data for the specified path or null if not found.
- **Error Handling:** None.

#### `static async getRequestMap(networkTracking, path)`
- **Description:** Retrieves request map for a specific path.
- **Input:**
    - `networkTracking`: The network tracking object.
    - `path`: The path to retrieve the request map for.
- **Output:** Returns the request map for the specified path.
- **Error Handling:** Throws an error if no requests are found for the path.

---

### NetworkTracking Class Function Descriptions

#### `constructor`
- **Description:** Initializes a new NetworkTracking object and registers event listeners for requests and responses.
- **Input:**
    - `page`: The page object to track network requests on.
- **Output:** None.

#### `isRelevantRequest(url)`
- **Description:** Checks if the request URL is relevant to track.
- **Input:**
    - `url`: The URL of the request.
- **Output:** Returns true if the URL is relevant, otherwise false.
- **Error Handling:** None.

#### `handlePath(request)`
- **Description:** Extracts the path and search parameters from the URL.
- **Input:**
    - `request`: The request object.
- **Output:** Returns the path and search parameters as a string.
- **Error Handling:** None.

#### `handleRequest(request)`
- **Description:** Handles and stores request details if it's relevant.
- **Input:**
    - `request`: The request object.
- **Output:** None.
- **Error Handling:** None.

#### `async parseResponseBody(response)`
- **Description:** Parses the response body to JSON.
- **Input:**
    - `response`: The response object.
- **Output:** Returns the parsed response body or an error message if parsing fails.
- **Error Handling:** None.

#### `async handleResponse(response)`
- **Description:** Handles and stores response details if it's relevant.
- **Input:**
    - `response`: The response object.
- **Output:** None.
- **Error Handling:** Logs an error message if handling the response fails.

#### `async get(path)`
- **Description:** Retrieves network data for a specific path.
- **Input:**
    - `path`: The path to retrieve the network data for.
- **Output:** Returns the network data for the specified path.
- **Error Handling:** Throws an error if no network data is found for the path.

class Network {
    constructor({ url, method, payload, headers, status, startTime, responseBody = null, responseTime = null }) {
        this.url = url;
        this.method = method;
        this.statusCode = status || null;
        this.headers = headers;
        this.response = {
            responseHeaders: null,
            responseBody: responseBody,
            elapsedTime: null,
            responseTime: responseTime
        };
        this.payload = payload;
        this.startTime = startTime;
    }

    // Set response details and calculate the elapsed time
    setResponse({ statusCode, responseBody, responseHeaders, elapsedTime }) {
        this.statusCode = statusCode;
        this.response.responseHeaders = responseHeaders;
        this.response.responseBody = responseBody;
        this.response.elapsedTime = elapsedTime;
        this.response.responseTime = Date.now();
        this.raiseForStatus();
    }

    // Throw an error if the response status code indicates a failure
    raiseForStatus() {

        if (this.statusCode === null || this.statusCode < 200 || this.statusCode > 404) {
            throw new Error(`Request failed with status ${this.statusCode}`);
        }
    }


    // Retrieve and normalize headers for a specific path
    static async getHeaders(networkTracking, path) {
        const network = Network.getNetworkData(networkTracking.networkjson, path);

        if (network) {
            while (network.statusCode === null) {
                await new Promise(resolve => setTimeout(resolve, 100));
            }
            network.raiseForStatus();
            const headers = {
                requestHeaders: {},
                responseHeaders: {}
            };

            for (const key in network.headers) {
                headers.requestHeaders[key.toLowerCase()] = network.headers[key];
            }

            for (const key in network.response.responseHeaders) {
                headers.responseHeaders[key.toLowerCase()] = network.response.responseHeaders[key];
            }

            return headers;
        } else {
            throw new Error(`No network data found for path ${path}`);
        }
    }

    // Retrieve a specific header value for a given path
    static async getHeader(networkTracking, path, key) {
        const headers = await Network.getHeaders(networkTracking, path);

        if (headers) {
            const normalizedKey = key.toLowerCase();
            const requestHeader = headers.requestHeaders[normalizedKey];
            const responseHeader = headers.responseHeaders[normalizedKey];

            if (requestHeader) {
                return requestHeader;
            } else if (responseHeader) {
                return responseHeader;
            } else {
                throw new Error(`Header '${key}' not found!`);
            }
        } else {
            throw new Error(`Headers not found for path ${path}`);
        }
    }

    // Retrieve the base URL for a specific path
    static async getBaseUrl(networkTracking, path) {
        const network = Network.getNetworkData(networkTracking.networkjson, path);

        if (network) {

            return new URL(network.url).origin;
        } else {
            throw new Error(`No network data found for path ${path}`);
        }
    }

    // Retrieve the full data for a specific path
    static async getFullData(networkTracking, path) {
        const network = await networkTracking.get(path);

        while (network.statusCode === null) {
            await new Promise(resolve => setTimeout(resolve, 500));
        }

        const headers = await Network.getHeaders(networkTracking, path);
        const baseUrl = await Network.getBaseUrl(networkTracking, path);

        return {
            url: network.url,
            method: network.method,
            statusCode: network.statusCode,
            payload: network.payload,
            headers: network.headers,
            startTime: network.startTime,
            response: network.response,
            additionalData: {
                headers: headers,
                baseUrl: baseUrl
            }
        };
    }

    // Retrieve all requests
    static async getAllRequests(networkTracking) {
        console.info( "ALL REQUESTS : " , networkTracking.networkjson )

        return networkTracking.networkjson;
    }

    // Get network data for a specific path
    static getNetworkData(networkjson, path) {

        return networkjson[path] || null;
    }

    // Retrieve request map for a specific path
    static async getRequestMap(networkTracking, path) {
        const network = Network.getNetworkData(networkTracking.networkjson, path);

        if (network) {

            return network;
        } else {
            throw new Error(`No requests found for ${path}`);
        }
    }

}

export default Network;

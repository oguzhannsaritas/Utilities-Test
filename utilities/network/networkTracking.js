import Network from './network';

class NetworkTracking {
    constructor(page) {
        this.page = page;
        this.networkjson = {};
        // Register event listeners for requests and responses on the page
        this.page.on('request', request => this.handleRequest(request));
        this.page.on('response', response => this.handleResponse(response));
    }

    // Check if the request URL is relevant to track
    isRelevantRequest(url) {

        return url.includes('your API');
    }

    // Extract the path and search parameters from the URL
    handlePath(request) {
        const urlObj = new URL(request.url());


        return urlObj.pathname + urlObj.search;
    }

    // Handle and store request details if it's relevant
    handleRequest(request) {
        if ((request.resourceType() === 'fetch' || request.resourceType() === 'xhr') && this.isRelevantRequest(request.url())) {
            const path = this.handlePath(request);
            const network = new Network({
                url: request.url(),
                method: request.method(),
                headers: request.headers(),
                payload: request.postData() || null,
                startTime: Date.now()
            });
            this.networkjson[path] = network;
        }
    }


    // Parse response body to JSON
    async parseResponseBody(response) {
        try {
            return JSON.parse(await response.body());
        } catch (error) {

            return { error: 'Failed to parse response body' };
        }
    }

    // Handle and store response details if it's relevant
    async handleResponse(response) {
        try {
            const request = response.request();
            if ((request.resourceType() === 'fetch' || request.resourceType() === 'xhr') && this.isRelevantRequest(request.url())) {
                const path = this.handlePath(request);
                const endTime = Date.now();
                const body = await this.parseResponseBody(response);
                const elapsedTime = ((endTime - request.timing().startTime) / 1000).toFixed(1);

                const network = this.networkjson[path];

                if (network) {
                    network.setResponse({
                        statusCode: response.status(),
                        responseHeaders: response.headers(),
                        responseBody: body,
                        elapsedTime
                    });
                }
            }
        } catch (error) {
            console.error(`Error handling response for ${response.url()}:`, error);
        }

    }

    // Retrieve network data for a specific path
    async get(path) {
        const network = Network.getNetworkData(this.networkjson, path);

        if (network) {
            let attempts = 0;
            const maxAttempts = 10; // Maksimum bekleme deneme sayısı (örneğin, 10 saniye)

            // Durum kodu null olduğu sürece bekle, ama maksimum bekleme süresini sınırla
            while (network.statusCode === null && attempts < maxAttempts) {
                await new Promise(resolve => setTimeout(resolve, 2000)); // 1 saniye bekle
                attempts++;
            }

            // Eğer durum kodu hala null ise hata fırlat
            if (network.statusCode === null) {
                throw new Error(`Network status code not set for path: ${path} after ${maxAttempts} seconds.`);
            }

            // Hata fırlatmadan önce kontrol
            network.raiseForStatus();

            return network;
        } else {
            throw new Error(`No network data found for path ${path}`);
        }
    }
}

export default NetworkTracking;

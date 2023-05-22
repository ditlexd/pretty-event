var payloads = [];
var isPaused = false;


chrome.webRequest.onBeforeRequest.addListener(
    function(details) {
        if (details.url.indexOf('/events') !== -1) {
            let decodedData = '';
            if (details.requestBody && details.requestBody.raw) {
                let encoder = new TextDecoder('utf-8');
                for (let rawData of details.requestBody.raw) {
                    if (rawData.bytes) {
                        decodedData = encoder.decode(new DataView(rawData.bytes));
                    }
                }
            }

            let payload = {
                url: details.url,
                body: decodedData
            };

            payloads.push(payload);
        }
    },
    {urls: ["<all_urls>"]},
    ["requestBody"]
);

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.method === "getPayloads") {
        sendResponse({payloads: payloads});
    } else if (request.method === "clearPayloads") {
        payloads = [];
    }
});
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    const { type, tabID, interval } = request;

    chrome.storage.local.get(['reloadJobID'], function (result) {
        let { reloadJobID } = result;

        if (reloadJobID) {
            clearInterval(reloadJobID);
        }
        if (type === 'remove') {
            return sendResponse({ result: 'ok' });
        }

        try {
            reloadJobID = setInterval(() => {
                chrome.tabs.reload(tabID);
            }, interval * 1000);
        } catch (err) {
            console.error(err);
            clearInterval(reloadJobID);
            return sendResponse({ result: 'fail' });
        }

        chrome.storage.local.set({ reloadJobID });
        sendResponse({ result: 'ok' });
    });
});

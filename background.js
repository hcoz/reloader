chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    const { type, tabID, interval, alarmName } = request;

    if (type === 'remove') {
        chrome.alarms.clear(alarmName);
        return sendResponse({ result: 'ok' });
    }

    chrome.alarms.create(`reloader_${tabID}`, { periodInMinutes: interval });
    chrome.alarms.onAlarm.addListener(function (alarm) {
        if (alarm.name === `reloader_${tabID}`) {
            chrome.tabs.reload(tabID);
        }
    });
    sendResponse({ result: 'ok' });
});

chrome.tabs.onRemoved.addListener(function (tabID) {
    chrome.alarms.clear(`reloader_${tabID}`);
});

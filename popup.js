function reloader(type, interval) {
    const isIntervalValid = Number.isInteger(interval) && interval >= 5 && interval <= 500;
    if (type === 'add' && !isIntervalValid) {
        // window.alert('Please enter a valid interval value!');
        chrome.notifications.create('alert', {
            icon: 'icon.png',
            type: 'basic',
            title: 'Invalid Input!',
            message: 'Please enter a valid interval value.'
        });
        return;
    }

    chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
        if (tabs[0]) {
            const params = {
                tabID: tabs[0].id,
                type,
                interval
            };

            chrome.runtime.sendMessage(params, function (response) {
                if (response.result !== 'ok') {
                    console.error(response);
                }
                window.close();
            });
        }
    });
}

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('start').addEventListener('click', function () {
        const interval = parseInt(document.getElementById('interval').value, 10);
        reloader('add', interval);
    });
    document.getElementById('stop').addEventListener('click', function () {
        reloader('remove');
    });
});

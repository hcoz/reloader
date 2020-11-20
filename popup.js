function reloader(type, interval, alarmName) {
    const message = document.getElementById('message');
    const isIntervalValid = Number.isInteger(interval) && interval >= 1 && interval <= 60;

    if (type === 'add' && !isIntervalValid) {
       message.innerHTML = 'Please enter a valid interval value!';
       message.style.display = 'block';
        return;
    }
    message.style.display = 'none';
    message.innerHTML = '';

    chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
        if (tabs[0]) {
            const params = {
                tabID: tabs[0].id,
                type,
                interval,
                alarmName
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
        const interval = parseFloat(document.getElementById('interval').value);
        reloader('add', interval);
    });

    document.getElementById('tasklist').addEventListener('click', function (e) {
        if (e.target && e.target.name) {
            reloader('remove', null, e.target.name);
        }
    });

    chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
        const currentTabID = `${tabs[0].id}`;
        // list reload tasks
        chrome.alarms.getAll(function (alarmList) {
            const taskList = document.getElementById('tasklist');
    
            alarmList.forEach(alarm => {
                const item = document.createElement('li');
                const tabID = alarm.name.split('_')[1];
                item.innerHTML = `<span>${alarm.name}${tabID === currentTabID ? ' (Current Tab)' : ''}</span><button name="${alarm.name}">Stop</button>`;
                taskList.appendChild(item);
            });
        });
    });
});

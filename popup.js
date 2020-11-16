document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('start').addEventListener('click', function (e) {
        e.preventDefault();
        const interval = parseInt(document.getElementById('interval').value, 10);

        if (Number.isInteger(interval) && interval > 5 && interval < 500) {
            chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
                if (tabs[0]) {
                    chrome.storage.local.get(['reloadJobID'], function (result) {
                        let { reloadJobID } = result;

                        if (reloadJobID) {
                            clearInterval(reloadJobID);
                        }

                        reloadJobID = setInterval(() => {
                            chrome.tabs.reload(tabs[0].id);
                        }, interval);

                        chrome.storage.local.set({ reloadJobID });
                    });
                    // let reloadJobID = window.localStorage.getItem('reloadJobID');
                    // if (reloadJobID) {
                    //     clearInterval(reloadJobID);
                    // }
                    // reloadJobID = setInterval(() => {
                    //     chrome.tabs.reload(tabs[0].id);
                    // }, interval);
                    // window.localStorage.setItem('reloadJobID', reloadJobID);
                }
                window.close();
            });
        } else {
            window.alert('Please enter a valid interval value!');
            window.close();
        }
    });
});

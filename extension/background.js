// PhishGuard Dynamic Badge

chrome.runtime.onMessage.addListener((message, sender) => {

    if (!sender.tab) {
        return;
    }

    const tabId = sender.tab.id;


    if (message.status === "Safe") {

        chrome.action.setBadgeText({
            tabId: tabId,
            text: "✓"
        });

        chrome.action.setBadgeBackgroundColor({
            tabId: tabId,
            color: "#20c997"
        });

        chrome.action.setTitle({
            tabId: tabId,
            title: "PhishGuard: Safe"
        });

    }


    else if (message.status === "Suspicious") {

        chrome.action.setBadgeText({
            tabId: tabId,
            text: "!"
        });

        chrome.action.setBadgeBackgroundColor({
            tabId: tabId,
            color: "#f5a623"
        });

        chrome.action.setTitle({
            tabId: tabId,
            title: "PhishGuard: Suspicious"
        });

    }


    else if (message.status === "Phishing") {

        chrome.action.setBadgeText({
            tabId: tabId,
            text: "!"
        });

        chrome.action.setBadgeBackgroundColor({
            tabId: tabId,
            color: "#ff4d6d"
        });

        chrome.action.setTitle({
            tabId: tabId,
            title: "PhishGuard: Dangerous"
        });

    }

});


// Clear old badge when navigating to a new page

chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {

    if (changeInfo.status === "loading") {

        chrome.action.setBadgeText({
            tabId: tabId,
            text: ""
        });

    }

});
chrome.runtime.sendMessage(
  {
    type: "GET_REDIRECT_URL",
  },
  (url) => {
    if (url) {
      window.location = url;
    }
  }
);

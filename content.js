console.log("content script added");

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  console.log("req", request);
  if (request.action === "start") {
    let i = 0;
    const x = [
      ...document.querySelectorAll(".reusable-search__result-container button"),
    ].filter((ele) => ele.innerText === "Connect");
    console.log(x);

    chrome.storage.sync.set({ started: true });

    sendResponse("started");

    (function loop() {
      chrome.storage.sync.get("started", (data) => {
        if (data.started) {
          if (i < x.length) {
            console.log(x[i]);
            x[i].click();
            document.querySelector("#artdeco-modal-outlet").style.opacity = "0";
            setTimeout(() => {
              document.querySelector('[aria-label="Send now"]').click();
              document.querySelector("#artdeco-modal-outlet").style.opacity =
                "1";
            }, 1);

            chrome.storage.sync.set({ count: i });
          }
          if (i === x.length) {
            chrome.storage.sync.set({ started: false });
          }
          if (i < x.length) {
            setTimeout(loop, 5000);
            i++;
          }
        }
      });
    })();
  } else if (request.action === "stop") {
    chrome.storage.sync.set({ started: false });
    sendResponse("stopped");
  }
});

// function start() {
//   alert("started");
//   const x = document.querySelectorAll(
//     ".reusable-search__result-container button"
//   );
//   console.log(x);
//   let i = 0;

//   (function loop() {
//     console.log(x[i]);
//     if (++i < x.length) {
//       setTimeout(loop, 2000); // call myself in 2 seconds time if required
//     }
//   })();
// }

// document.querySelector('.reusable-search__result-container button').innerText.includes('Connect')

console.log("Pop up");

const connectBtn = document.querySelector("#connect-btn");
const countDisplayEle = document.querySelector("#count");
const redirectBtn = document.querySelector("#redirect-btn");
// const progressBar = document.querySelector("#bar");

redirectBtn.style.display = "none";
connectBtn.style.display = "none";

chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
  const currentTab = tabs[0].url.includes(
    "https://www.linkedin.com/search/results/people"
  );
  if (currentTab) {
    connectBtn.style.display = "block";
    redirectBtn.style.display = "none";
  } else {
    connectBtn.style.display = "none";
    redirectBtn.style.display = "block";

    document.querySelector("header").style.display = "none";
    document.querySelector("main").innerHTML =
      "<h1 style='text-align:center; margin:2rem;'>Go to LinkedIn</h1>";
  }
});

connectBtn.addEventListener("click", () => {
  console.log(connectBtn.innerText);
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    if (connectBtn.innerText === "START CONNECTING") {
      connectBtn.innerText = "STOP CONNECTING";
      chrome.tabs.sendMessage(
        tabs[0].id,
        { action: "start" },
        function (response) {
          console.log(response);
        }
      );
    } else {
      connectBtn.innerText = "START CONNECTING";
      document.querySelector(".progress-text").innerText = "0%";
      progressBar(0, 100, 0);

      chrome.tabs.sendMessage(
        tabs[0].id,
        { action: "stop" },
        function (response) {
          console.log(response);
        }
      );
    }
    // chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
  });
});

// gridBtn.addEventListener("click", () => {
//   chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
//   chrome.tabs.sendMessage(
//     tabs[0].id,
//     { action: "display-grid-view" },
//     function (response) {
//       console.log(response);
//     }
//   );
// });
//   window.close();
// });

// function popup() {
//   chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
//     var activeTab = tabs[0];
//     chrome.tabs.sendMessage(activeTab.id, { message: "start" });
//   });
// }

// document.addEventListener("DOMContentLoaded", function () {
//   connectBtn.addEventListener("click", popup);

// });
let count = 0;

chrome.storage.onChanged.addListener(function (changes, namespace) {
  chrome.storage.sync.get("started", (data) => {
    console.log(data.started);
    if (data.started) {
      for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
        console.log(
          `Storage key "${key}" in namespace "${namespace}" changed.`,
          `Old value was "${oldValue}", new value is "${newValue}".`
        );
        if (key === "count") {
          count++;
          progressBar(Math.floor(newValue), 100, count);
        }
      }
    } else {
      count = 0;
    }
  });
});

function progressBar(progressVal, totalPercentageVal = 100, c) {
  var strokeVal = (4.64 * 100) / totalPercentageVal;
  var x = document.querySelector(".progress-circle-prog");
  x.style.strokeDasharray = progressVal * strokeVal + " 999";
  var el = document.querySelector(".progress-text");
  console.log(el);
  var from = $(".progress-text").data("progress");
  $(".progress-text").data("progress", progressVal);
  var start = new Date().getTime();

  setTimeout(function () {
    var now = new Date().getTime() - start;
    var progress = now / 700;
    // el.innerHTML = Math.floor((progressVal / totalPercentageVal) * 100) + "%";
    el.innerHTML = c;
    if (progress < 1) setTimeout(arguments.callee, 10);
  }, 10);
}

redirectBtn.addEventListener("click", () => {
  chrome.tabs.create({ active: true, url: "http://linkedin.com" });
});

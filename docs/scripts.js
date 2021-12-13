function watchCardProgress() {
  let totalProgress = document.querySelector(".total-learn-progress");

  if (!totalProgress || !totalProgress.id) return;

  var progress = JSON.parse(localStorage.getItem(totalProgress.id) ?? "{}");
  var progressBars = {};

  var lstSwitcher = document.querySelectorAll(
    ".main-content .learn-group .learn-item input.form-check-input"
  );

  for (const switcher of lstSwitcher) {
    let gKey = switcher.getAttribute("aria-group-id");
    let itemKey = switcher.getAttribute("aria-learn-item");
    if (!progress[gKey]) progress[gKey] = {};

    if (!!!progress[gKey][itemKey]) progress[gKey][itemKey] = false;
    else switcher.checked = progress[gKey][itemKey];

    if (totalProgress.id && progress && gKey && itemKey) {
      switcher.onclick = () => {
        switcherClickHandler(totalProgress.id, gKey, itemKey, switcher.checked);
      };
    }
  }

  for (const pBar of document.querySelectorAll("[aria-group-id] .progress-bar"))
    progressBarStarter(pBar);

  function switcherClickHandler(learnId, gKey, itemKey, status) {
    progress[gKey][itemKey] = status;
    localStorage.setItem(learnId, JSON.stringify(progress));

    setProgressBarValue(progressBars[gKey], getProgressCount(progress[gKey]));
  }

  function progressBarStarter(pBarElem) {
    let gkey = pBarElem.getAttribute("aria-group-id");
    progressBars[gkey] = pBarElem;
    pBarElem.setAttribute("aria-count-itens", Object.values(progress[gkey]).length);

    setProgressBarValue(pBarElem, getProgressCount(progress[gkey]));
  }

  function setProgressBarValue(pBarElem, currentValue) {
    if (!pBarElem) return;

    let groupTotal = parseInt(pBarElem.getAttribute("aria-count-itens"));

    let groupDonePercentage = (currentValue / groupTotal) * 100;
    pBarElem.style.width = `${groupDonePercentage}%`;
    pBarElem.setAttribute("aria-valuenow", `${groupDonePercentage}%`);
  }

  function getProgressCount(group) {
    return Object.values(group).filter((i) => i == true).length;
  }
}

watchCardProgress();

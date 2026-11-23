"use strict";

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const openLetter = document.querySelector(".open-letter");
let openingTimer;
openLetter.addEventListener("click", (event) => {
  event.preventDefault();
  window.clearTimeout(openingTimer);
  document.body.classList.remove("letter-opening");
  void openLetter.offsetWidth;
  document.body.classList.add("letter-opening");
  openingTimer = window.setTimeout(() => {
    const invitation = document.querySelector("#invitation");
    invitation.focus({ preventScroll: true });
    invitation.scrollIntoView({ behavior: reducedMotion.matches ? "auto" : "smooth" });
    window.history.replaceState(null, "", "#invitation");
  }, reducedMotion.matches ? 0 : 550);
});

const quickNav = document.querySelector(".quick-nav");
if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(([entry]) => {
    quickNav.classList.toggle("is-visible", !entry.isIntersecting);
  }, { rootMargin: "-50px 0px 0px 0px" });
  observer.observe(document.querySelector(".envelope"));
} else {
  quickNav.classList.add("is-visible");
}

const copyButton = document.querySelector("#copy-address");
const copyStatus = document.querySelector("#copy-status");
copyButton.hidden = false;
copyButton.addEventListener("click", async () => {
  const address = "同庆楼常州奥体店 · 百合厅，常州市新北区天目山路奥体中心体育馆旁";
  try {
    if (!navigator.clipboard?.writeText) {
      throw new Error("Clipboard unavailable");
    }
    await navigator.clipboard.writeText(address);
    copyStatus.textContent = "地址已复制，期待与您相见。";
  } catch {
    copyStatus.textContent = "暂时无法自动复制，请长按上方地址选择复制，或点击「地图找店」。";
  }
});

const photoDialog = document.querySelector(".photo-dialog");
if (typeof photoDialog.showModal === "function") {
  const dialogImage = photoDialog.querySelector("img");
  let photoTrigger;
  document.querySelectorAll("[data-photo]").forEach((link) => {
    link.addEventListener("click", (event) => {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      photoTrigger = link;
      dialogImage.src = link.href;
      dialogImage.alt = link.querySelector("img").alt;
      photoDialog.showModal();
    });
  });
  photoDialog.querySelector(".close-photo").addEventListener("click", () => photoDialog.close());
  photoDialog.addEventListener("click", (event) => {
    if (event.target === photoDialog) photoDialog.close();
  });
  photoDialog.addEventListener("close", () => photoTrigger?.focus({ preventScroll: true }));
}

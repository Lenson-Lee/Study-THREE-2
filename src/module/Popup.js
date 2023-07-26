export function Popup(bodyTag, visible, run) {
  /** 존재여부 확인 */
  const validate = document.getElementById("popup");

  if (visible) {
    const popupDiv = document.createElement("div");
    popupDiv.innerText = "커비 따라가기";
    popupDiv.classList.add("popup");
    popupDiv.id = "popup";

    if (validate === null) {
      bodyTag.appendChild(popupDiv);
    }

    /** Click Event 생성 */
    popupDiv.addEventListener("click", (e) => {
      console.log("클릭");
      run = true;
    });
  }
}

export default Popup;

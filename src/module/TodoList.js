export function TodoList(bodyTag, list, coincount) {
  /** 존재여부 확인 */
  const validate = document.getElementById("todo");

  /** todo 객체 없을때만 생성 */
  if (validate === null) {
    const todoDiv = document.createElement("div");
    const titleDiv = document.createElement("p");

    /** 전체 구역 및 제목 DOM에 추가 */
    titleDiv.innerText = "🚩 Todo List";
    titleDiv.classList.add("title");
    todoDiv.classList.add("todo");
    todoDiv.id = "todo";

    todoDiv.appendChild(titleDiv);
    bodyTag.appendChild(todoDiv);

    /** 리스트 렌더 */
    list.forEach((item) => {
      /** 할 일 리스트 DOM 생성 */
      const containerDiv = document.createElement("div"); // 체크 + 할 일 담는 div
      const checkDiv = document.createElement("p"); //체크아이콘
      const listDiv = document.createElement("p"); //할 일 타이틀

      checkDiv.id = item.id;

      checkDiv.innerText = item.check ? `✔` : ``;

      containerDiv.classList.add("containerDiv");
      containerDiv.appendChild(checkDiv);
      containerDiv.appendChild(listDiv);
      todoDiv.appendChild(containerDiv);

      if (item.id === "money") {
        listDiv.id = "moneytext";
        return;
      } else {
        listDiv.innerText = item.title;
      }
    });
  }

  /** 수행완료시 체크 */
  list.forEach((li) => {
    const checkTarget = document.getElementById(li.id);
    const textTarget = document.getElementById("moneytext");
    if (li.id === "money") {
      textTarget.innerText =
        li.title +
        " (" +
        (coincount.catch ? coincount.catch : 0) +
        "/" +
        coincount.total +
        ")";
    }

    if (li.check) {
      checkTarget.innerText = `✔`;
    }
  });
  return;
}
export default TodoList;

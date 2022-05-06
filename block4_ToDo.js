let allTasks = [];
let valueInput = "";
let input = null;
let errorMessage = document.getElementById("message");

window.onload = async () => {
  input = document.getElementById("addTask");
  input.addEventListener("input", updateValue);
  const resp = await fetch("http://localhost:8000/allTasks", {
    method: "GET"
  });
  const result = await resp.json();
  allTasks = result.data;
  render();
};

const onClickButton = async () => {
  const valueTrim = valueInput.trim();
    if (valueTrim) {
      const resp = await fetch("http://localhost:8000/createTask", {
        method: "POST",
        headers: {
          "Content-Type" : "application/json;charset=utf-8",
          "Access-Control-Allow-Origin" : "*"
        },
        body: JSON.stringify({
          text: valueTrim,
          isCheck: false
        })
      });
      const result = await resp.json();
      allTasks = result.data;
      valueInput = "";
      input.value = "";
      render();
    } else {
        errorMessage.innerHTML = "Введите значение!!!"
      };
};

const updateValue = (event) => {
  valueInput = event.target.value
  if (valueInput) {
    errorMessage.innerHTML = ""
  };
};

const render = () => {
  const content = document.getElementById("content");
  while (content.firstChild) {
    content.removeChild(content.firstChild);
  };

  allTasks.sort((i, j) => i.isCheck - j.isCheck);
  allTasks.map((item, index) => {
    const {text:itemText, isCheck} = item;
    const conteiner = document.createElement("div");
    conteiner.id = `task-${index}`;
    conteiner.className = "taskCont";
    const checkBox = document.createElement("input");
    checkBox.type = "checkBox";
    checkBox.checked = isCheck;
    checkBox.onchange = () => onChangeCheckBox(index);

    checkBox.id = `checkBox-${index}`;
    conteiner.appendChild(checkBox);
    const text = document.createElement("p");
    text.innerText = itemText;
    text.className = isCheck ? "textTask doneText" : "textTask";
    conteiner.appendChild(text);
    content.appendChild(conteiner);

    const imageEdit = document.createElement("img");
    imageEdit.src = "images/edit.png";
    imageEdit.id = `edit-${index}`;

    if (!isCheck) {
      imageEdit.onclick = () => updateTaskText(index);
      conteiner.appendChild(imageEdit);
    }

    const imageDelete = document.createElement("img");
    imageDelete.src = "images/delete.png";
    imageDelete.onclick = () => onDeleteTask(index);
    conteiner.appendChild(imageDelete);
    content.appendChild(conteiner);
  });
};

const onChangeCheckBox = async (index) => {
  const itemTask = allTasks[index];
  const {id, text, isCheck} = itemTask;
  const resp = await fetch("http://localhost:8000/updateTask", {
    method: "PATCH",
    headers: {
      "Content-Type" : "application/json;charset=utf-8",
      "Access-Control-Allow-Origin" : "*"
    },
    body: JSON.stringify({
      "id": id,
      "text": text,
      "isCheck": !isCheck
    })
  });
  const result = await resp.json();
  allTasks = result.data;
  render();
};

const onDeleteTask = async (index) => {
  const itemText = allTasks[index];
  const {id} = itemText;
  const resp = await fetch(`http://localhost:8000/deleteTask?id=${id}`, {
    method: "DELETE",
  });
  const result = await resp.json();
  allTasks = result.data;
  render();
};

const updateTaskText = async (index) => {
  const itemTask = allTasks[index];
  const {id, isCheck} = itemTask;
  if (valueInput) {
    const resp = await fetch("http://localhost:8000/updateTask", {
      method: "PATCH",
      headers: {
        "Content-Type" : "application/json;charset=utf-8",
        "Access-Control-Allow-Origin" : "*"
      },
      body: JSON.stringify({
        "id": id,
        "text": valueInput,
        "isCheck": isCheck
      })
    });
    const result = await resp.json();
    allTasks = result.data;
    valueInput = "";
    input.value = "";
    render();
  }
};

const doneEditTask = () => {
  activeEditTask = null;
  render();
};
document.addEventListener("DOMContentLoaded", () => {
  let checklistItems = JSON.parse(localStorage.getItem("checklistItems")) || [];
  const checklistElement = document.getElementById("checklist-items");
  const form = document.getElementById("new-item-form");
  const newTaskInput = document.getElementById("new-item-input");

  function saveList() {
    localStorage.setItem("checklistItems", JSON.stringify(checklistItems));
  }

  // Drag & drop handlers
  function handleDragStart(e) {
    e.dataTransfer.setData("text/plain", e.currentTarget.dataset.index);
  }
  function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  }
  function handleDrop(e) {
    e.preventDefault();
    const draggedIndex = parseInt(e.dataTransfer.getData("text/plain"));
    const dropIndex = parseInt(e.currentTarget.dataset.index);
    if (draggedIndex === dropIndex) return;
    const draggedItem = checklistItems.splice(draggedIndex, 1)[0];
    checklistItems.splice(dropIndex, 0, draggedItem);
    saveList();
    renderList();
  }

  function renderList() {
    checklistElement.innerHTML = "";
    checklistItems.forEach((item, index) => {
      const li = document.createElement("li");
      li.setAttribute("draggable", "true");
      li.dataset.index = index;
      li.addEventListener("dragstart", handleDragStart);
      li.addEventListener("dragover", handleDragOver);
      li.addEventListener("drop", handleDrop);

      // Create checkbox element
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = item.checked;
      checkbox.addEventListener("change", () => {
        checklistItems[index].checked = checkbox.checked;
        saveList();
        renderList();
      });

      // Create span for task text
      const span = document.createElement("span");
      span.textContent = item.text;
      if (item.checked) {
        span.classList.add("checked");
      }
      // Prevent unwanted selection on double-click
      span.addEventListener("mousedown", (e) => {
        if (e.detail > 1) {
          e.preventDefault();
        }
      });
      // On double-click, switch to edit mode
      span.addEventListener("dblclick", () => {
        li.classList.add("editing");
        const editInput = document.createElement("input");
        editInput.type = "text";
        editInput.value = item.text;
        editInput.className = "editable-input";
        // Remove any fixed width so it expands to 100% per CSS
        editInput.style.width = "";
        // Replace the span with the input
        li.replaceChild(editInput, span);
        editInput.focus();

        function finishEditing() {
          checklistItems[index].text = editInput.value;
          li.classList.remove("editing");
          saveList();
          renderList();
        }
        editInput.addEventListener("blur", finishEditing);
        editInput.addEventListener("keydown", (e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            editInput.blur();
          }
        });
      });

      // Create remove button
      const removeBtn = document.createElement("button");
      removeBtn.textContent = "X";
      removeBtn.addEventListener("click", () => {
        checklistItems.splice(index, 1);
        saveList();
        renderList();
      });

      li.appendChild(checkbox);
      li.appendChild(span);
      li.appendChild(removeBtn);
      checklistElement.appendChild(li);
    });
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const text = newTaskInput.value.trim();
    if (text !== "") {
      const tasks = text.split("\n").filter(task => task.trim() !== "");
      tasks.forEach(task => {
        checklistItems.push({ text: task.trim(), checked: false });
      });
      newTaskInput.value = "";
      saveList();
      renderList();
    }
  });

  renderList();
});

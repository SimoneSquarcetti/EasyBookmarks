
function addCategoryToHTML(category) {
    categoryArray.push(category.id);
    var newCategoryDiv = document.createElement("div");
  
    newCategoryDiv.classList.add("categoryDiv");
    newCategoryDiv.setAttribute("draggable", true);
  
    newCategoryDiv.addEventListener("dragstart", onDragStart);
    newCategoryDiv.addEventListener("dragover", onDragOver);
    newCategoryDiv.addEventListener("drop", onDrop);
  
    newCategoryDiv.id = category.id;
  
    var headerDiv = document.createElement("div");
    var title = document.createElement("h3");
    title.id = "name_" + category.id;
    title.addEventListener("dblclick", function () {
      editName(title, true, category.id);
    });
    var buttonDiv = document.createElement("div");
  
    var subCategoryIcon = document.createElement("i");
    subCategoryIcon.classList.add("material-symbols-outlined");
    subCategoryIcon.textContent = "create_new_folder";
    subCategoryIcon.id = "subCategoryIcon";
    subCategoryIcon.setAttribute("title", "Add SubCategory");
    subCategoryIcon.onclick = function () {
      openAddSubcategoryDialog(category.id);
    };
    var bookmarkIcon = document.createElement("i");
    bookmarkIcon.classList.add("material-symbols-outlined");
    bookmarkIcon.textContent = "bookmark_add";
    bookmarkIcon.id = "bookmarkIcon";
    bookmarkIcon.setAttribute("title", "Add Bookmark");
    bookmarkIcon.onclick = function () {
      openAddUrlToCategoryDialog(category.name, category.id);
    };
  
    var deleteIcon = document.createElement("i");
    deleteIcon.classList.add("material-symbols-outlined");
    deleteIcon.textContent = "delete";
    deleteIcon.id = "deleteIcon";
    deleteIcon.setAttribute("title", "Delete Category");
  
    deleteIcon.onclick = function () {
      let dialogWindow = document.getElementById("dialogWindow");
      let divdeleteIcon = document.createElement("div");
      divdeleteIcon.id = "divdeleteIcon";
  
      let labeldeleteIcon = document.createElement("label");
      labeldeleteIcon.textContent =
        "You are deleting  '" + category.name + "'.\n\r Continue?";
      labeldeleteIcon.id = "labeldeleteIcon";
      divdeleteIcon.appendChild(labeldeleteIcon);
  
      let div = document.createElement("div");
      div.id = "dialogEditButtonsDiv";
  
      let buttonConfirm = document.createElement("button");
      buttonConfirm.textContent = "Confirm";
      buttonConfirm.classList.add("dialogButtons");
      div.appendChild(buttonConfirm);
  
      let buttonCancel = document.createElement("button");
      buttonCancel.textContent = "Cancel";
      buttonCancel.classList.add("dialogButtons");
      div.appendChild(buttonCancel);
  
      divdeleteIcon.appendChild(div);
  
      dialogWindow.appendChild(divdeleteIcon);
  
      dialogWindow.showModal();
  
      buttonConfirm.onclick = function () {
        deleteCategory(category.id);
        dialogWindow.removeChild(divdeleteIcon);
        dialogWindow.close();
      };
  
      buttonCancel.onclick = function () {
        dialogWindow.removeChild(divdeleteIcon);
        dialogWindow.close();
      };
    };
  
    buttonDiv.classList.add("buttonDiv");
    headerDiv.classList.add("headerDiv");
    buttonDiv.appendChild(subCategoryIcon);
    buttonDiv.appendChild(bookmarkIcon);
    buttonDiv.appendChild(deleteIcon);
  
    headerDiv.appendChild(title);
    headerDiv.appendChild(buttonDiv);
  
    newCategoryDiv.appendChild(headerDiv);
  
    var contentDiv = document.createElement("div");
    var subCatUl = document.createElement("ul");
    subCatUl.id = "subCatUl_" + category.id;
  
    var urlCatUl = document.createElement("ul");
    urlCatUl.id = "urlCatUl_" + category.id;
    contentDiv.appendChild(subCatUl);
    contentDiv.appendChild(urlCatUl);
    newCategoryDiv.appendChild(contentDiv);
  
    title.textContent = category.name;
    let parent = document.getElementById("contentDiv");
  
    let addCategoryDiv = document.getElementById("addCategoryDiv");
  
    parent.insertBefore(newCategoryDiv, addCategoryDiv);
  
    if (category.sub_ids.length > 0) {
      category.sub_ids.forEach((id) => {
        let cat = categoryJSON.filter((cat) => cat.id == id);
  
        addSubcategoryToHTML(category.id, cat[0]);
      });
    }
    if (category.urls.length > 0) {
  
      category.urls.forEach((url) => {
  
        addUrlToHTML(category.id, url);
  
      });
    }
  }
  
  function openAddCategoryDialog() {
    let dialogWindow = document.getElementById("dialogWindow");
    let divAddCatName = document.createElement("div");
    divAddCatName.id = "divAddCatName";
  
    let labelInsertCatName = document.createElement("label");
    labelInsertCatName.textContent = "Insert Category Name: ";
    labelInsertCatName.id = "labelInsertCatName";
    divAddCatName.appendChild(labelInsertCatName);
    divAddCatName.appendChild(document.createElement("br"));
  
    divAddCatName.appendChild(document.createElement("br"));
  
    let inputCatName = document.createElement("input");
    inputCatName.type = "text";
    //inputCatName.classList.add("editInput");
    divAddCatName.appendChild(inputCatName);
  
    let div = document.createElement("div");
    div.id = "dialogEditButtonsDiv";
  
    let buttonInsert = document.createElement("button");
    buttonInsert.textContent = "Insert";
    buttonInsert.classList.add("dialogButtons");
    div.appendChild(buttonInsert);
  
    let buttonCancel = document.createElement("button");
    buttonCancel.textContent = "Cancel";
    buttonCancel.classList.add("dialogButtons");
    div.appendChild(buttonCancel);
  
    divAddCatName.appendChild(div);
  
    dialogWindow.appendChild(divAddCatName);
  
    dialogWindow.showModal();
  
    buttonInsert.onclick = function () {
      let name = inputCatName.value;
      name = name[0].toUpperCase() + name.substring(1, name.length);
  
      dialogWindow.removeChild(divAddCatName);
      dialogWindow.close();
      if (name.length < 1) {
        let alertVoidName = document.createElement("div");
        alertVoidName.id = "alertVoidName";
  
        let messageVoidName = document.createElement("label");
        messageVoidName.textContent =
          "ERROR:" + "\n\rThe name must contain at least one character!";
        messageVoidName.id = "messageVoidName";
        alertVoidName.appendChild(messageVoidName);
  
        let divVoid = document.createElement("div");
        divVoid.id = "dialogVoidButtonsDiv";
  
        let buttonCloseVoid = document.createElement("button");
        buttonCloseVoid.textContent = "Close";
        buttonCloseVoid.classList.add("dialogButtons");
        divVoid.appendChild(buttonCloseVoid);
  
        alertVoidName.appendChild(divVoid);
        dialogWindow.appendChild(alertVoidName);
  
        dialogWindow.showModal();
  
        buttonCloseVoid.onclick = function () {
          dialogWindow.removeChild(alertVoidName);
          dialogWindow.close();
        };
      }  else addCategoryToJSON(name);
    };
  
    buttonCancel.onclick = function () {
      dialogWindow.removeChild(divAddCatName);
      dialogWindow.close();
    };
  }
  
  function addCategoryToJSON(name) {
    let foundCat = false;
    categoryJSON.forEach((category) => {
      if (categoryArray.includes(category.id)) {
        if (category.name.toLowerCase() === name.toLowerCase()) {
          let dialogWindow = document.getElementById("dialogWindow");
          let alertCat = document.createElement("div");
          alertCat.id = "alertCat";
  
          let messageCatExists = document.createElement("label");
          messageCatExists.textContent =
            "ERROR:" + "\n\rThe category already exists!";
          messageCatExists.id = "messageCatExists";
          alertCat.appendChild(messageCatExists);
  
          let divCatExists = document.createElement("div");
          divCatExists.id = "divCatExists";
  
          let buttonClose = document.createElement("button");
          buttonClose.textContent = "Close";
          buttonClose.classList.add("dialogButtons");
          divCatExists.appendChild(buttonClose);
  
          alertCat.appendChild(divCatExists);
          dialogWindow.appendChild(alertCat);
  
          dialogWindow.showModal();
  
          buttonClose.onclick = function () {
            dialogWindow.removeChild(alertCat);
            dialogWindow.close();
          };
          foundCat = true;
        }
      }
    });
    if (!foundCat) {
      
    let index;

    if(categoryJSON.length>0){
      let ids=categoryJSON.map(cat=>cat.id).sort(function(a, b) {
        return a - b;})
      index=ids[ids.length-1];
    }else{
      index=0
    }
      let newElement = {
        id: index + 1,
        name: name,
        urls: [],
        sub_ids: [],
        isMainCat: true,
      };
      categoryJSON.push(newElement);
      writeJSON();
      addCategoryToHTML(newElement);
    }
  }
  
  function deleteCategory(catId) {
    categoryArray = categoryArray.filter((id) => id !== catId);
    categoryJSON.forEach((cat) => {
      if (cat.id == catId) {
        cat.sub_ids.forEach((id) => {
          deleteSubcategory(catId, id);
        });
      }
      if (cat.id == catId) {
        cat.sub_ids = cat.sub_ids.filter((id) => id !== catId);
      }
    });
  
    categoryJSON = categoryJSON.filter((category) => category.id !== catId);
    writeJSON();
  
    let div = document.getElementById(catId);
    document.getElementById("contentDiv").removeChild(div);
  }
  
  function openAddSubcategoryDialog(categoryId) {
    let dialogWindow = document.getElementById("dialogWindow");
    let divAddSubcatName = document.createElement("div");
    divAddSubcatName.id = "divAddSubcatName";
  
    let labelInsertSubcatName = document.createElement("label");
    labelInsertSubcatName.textContent = "Insert Subcategory Name: ";
    labelInsertSubcatName.id = "labelInsertSubcatName";
    divAddSubcatName.appendChild(labelInsertSubcatName);
    divAddSubcatName.appendChild(document.createElement("br"));
  
    divAddSubcatName.appendChild(document.createElement("br"));
  
    let inputSubcatName = document.createElement("input");
    inputSubcatName.type = "text";
    //inputSubcatName.classList.add("editInput");
    divAddSubcatName.appendChild(inputSubcatName);
  
    let div = document.createElement("div");
    div.id = "dialogEditButtonsDiv";
  
    let buttonInsert = document.createElement("button");
    buttonInsert.textContent = "Insert";
    buttonInsert.classList.add("dialogButtons");
    div.appendChild(buttonInsert);
  
    let buttonCancel = document.createElement("button");
    buttonCancel.textContent = "Cancel";
    buttonCancel.classList.add("dialogButtons");
    div.appendChild(buttonCancel);
  
    divAddSubcatName.appendChild(div);
  
    dialogWindow.appendChild(divAddSubcatName);
  
    dialogWindow.showModal();
  
    buttonInsert.onclick = function () {
      let subName =
        inputSubcatName.value[0].toUpperCase() +
        inputSubcatName.value.substring(1, inputSubcatName.value.length);
      dialogWindow.removeChild(divAddSubcatName);
      dialogWindow.close();
  
      let sub_ids = [];
      let foundCat = false;
      categoryJSON.forEach((cat) => {
        if (cat.id == categoryId) {
          sub_ids = cat.sub_ids;
        }
      });
  
      if (subName.length < 1) {
        let dialogWindow = document.getElementById("dialogWindow");
        let alertVoidName = document.createElement("div");
        alertVoidName.id = "alertVoidName";
  
        let messageVoidName = document.createElement("label");
        messageVoidName.textContent =
          "ERROR:" + "\n\rThe name must contain at least one character!";
        messageVoidName.id = "messageVoidName";
        alertVoidName.appendChild(messageVoidName);
  
        let divVoid = document.createElement("div");
        divVoid.id = "dialogVoidButtonsDiv";
  
        let buttonCloseVoid = document.createElement("button");
        buttonCloseVoid.textContent = "Close";
        buttonCloseVoid.classList.add("dialogButtons");
        divVoid.appendChild(buttonCloseVoid);
  
        alertVoidName.appendChild(divVoid);
        dialogWindow.appendChild(alertVoidName);
  
        dialogWindow.showModal();
  
        buttonCloseVoid.onclick = function () {
          dialogWindow.removeChild(alertVoidName);
          dialogWindow.close();
        };
      } else if (sub_ids.length > 0) {
        categoryJSON.forEach((cat) => {
          if (sub_ids.includes(cat.id)) {
            if (cat.name.toLowerCase() == subName.toLowerCase()) {
              foundCat = true;
              let dialogWindow = document.getElementById("dialogWindow");
              let alertCat = document.createElement("div");
              alertCat.id = "alertCat";
  
              let messageCatExists = document.createElement("label");
              messageCatExists.textContent =
                "ERROR:" + "\n\rThe subcategory already exists!";
              messageCatExists.id = "messageCatExists";
              alertCat.appendChild(messageCatExists);
  
              let divCatExists = document.createElement("div");
              divCatExists.id = "divCatExists";
  
              let buttonClose = document.createElement("button");
              buttonClose.textContent = "Close";
              buttonClose.classList.add("dialogButtons");
              divCatExists.appendChild(buttonClose);
  
              alertCat.appendChild(divCatExists);
              dialogWindow.appendChild(alertCat);
  
              dialogWindow.showModal();
  
              buttonClose.onclick = function () {
                dialogWindow.removeChild(alertCat);
                dialogWindow.close();
              };
            }
          }
        });
        if (!foundCat) addSubcategoryToJSON(categoryId, subName);
      } else addSubcategoryToJSON(categoryId, subName);
    };
  
    buttonCancel.onclick = function () {
      dialogWindow.removeChild(divAddSubcatName);
      dialogWindow.close();
    };
  }

  
function addSubcategoryToJSON(categoryId, subName) {
  let ids=categoryJSON.map(cat=>cat.id).sort(function(a, b) {
    return a - b;})
  let index=ids[ids.length-1];
    let subId = index + 1;
    let subJSON = {
      id: subId,
      name: subName,
      urls: [],
      sub_ids: [],
      isMainCat: false,
    };
  
    categoryJSON.forEach((cat, index) => {
      if (cat.id == categoryId) {
        categoryJSON[index].sub_ids.push(subId);
      }
    });
  
    categoryJSON.push(subJSON);
    writeJSON();
  
    addSubcategoryToHTML(categoryId, subJSON);
  }
  
  function addSubcategoryToHTML(categoryId, subJSON) {
    let ul = document.getElementById("subCatUl_" + categoryId);
    let li = document.createElement("li");
    let subDiv = document.createElement("div");
    let subDiv1 = document.createElement("div");
    subDiv1.classList.add("liDiv1");
    let subCatId = subJSON.id;
    let subCatName = subJSON.name;
  
    li.id = "name_" + subCatId;
  
    let folderIcon = document.createElement("i");
    folderIcon.classList.add("material-symbols-outlined");
    folderIcon.textContent = "folder";
    folderIcon.setAttribute("title", subCatName);
  
    let label = document.createElement("label");
    label.textContent = subCatName;
    label.id = "name_" + subCatId;
    label.addEventListener("dblclick", function () {
      editName(label, false, subCatId);
    });
    label.setAttribute("title", subCatName);
  
    subDiv.classList.add("liDiv");
    subDiv.appendChild(subDiv1);
    subDiv1.appendChild(folderIcon);
    subDiv1.appendChild(label);
  
    let addSubToSubcatIcon = document.createElement("i");
    addSubToSubcatIcon.classList.add("material-symbols-outlined");
    addSubToSubcatIcon.textContent = "create_new_folder";
    addSubToSubcatIcon.setAttribute("title", "Add Subcategory to SubCategory");
    addSubToSubcatIcon.id = "addSubSubcatIcon";
    subDiv.appendChild(addSubToSubcatIcon);
  
    addSubToSubcatIcon.onclick = function () {
      openAddSubcategoryDialog(subCatId);
    };
  
    let addUrlSubcatIcon = document.createElement("i");
    addUrlSubcatIcon.classList.add("material-symbols-outlined");
    addUrlSubcatIcon.textContent = "bookmark_add";
    addUrlSubcatIcon.setAttribute("title", "Add Bookmark to SubCategory");
    addUrlSubcatIcon.id = "addUrlSubcatIcon";
    subDiv.appendChild(addUrlSubcatIcon);
  
    addUrlSubcatIcon.onclick = function () {
      selectBookmarkToAdd(categoryId, subCatId);
    };
  
    let deleteSubcatIcon = document.createElement("i");
    deleteSubcatIcon.classList.add("material-symbols-outlined");
    deleteSubcatIcon.textContent = "delete_forever";
    deleteSubcatIcon.setAttribute("title", "Delete SubCategory");
    deleteSubcatIcon.id = "deleteSubcatIcon";
    subDiv.appendChild(deleteSubcatIcon);
  
    deleteSubcatIcon.onclick = function () {
      let dialogWindow = document.getElementById("dialogWindow");
      let divdeleteSubIcon = document.createElement("div");
      divdeleteSubIcon.id = "divdeleteSubIcon";
  
      let labeldeleteSubIcon = document.createElement("label");
      labeldeleteSubIcon.textContent =
        "You are deleting  '" + subCatName + "'.\n\r Continue?";
      labeldeleteSubIcon.id = "labeldeleteSubIcon";
      divdeleteSubIcon.appendChild(labeldeleteSubIcon);
  
      let div = document.createElement("div");
      div.id = "dialogEditButtonsDiv";
  
      let buttonConfirm = document.createElement("button");
      buttonConfirm.textContent = "Confirm";
      buttonConfirm.classList.add("dialogButtons");
      div.appendChild(buttonConfirm);
  
      let buttonCancel = document.createElement("button");
      buttonCancel.textContent = "Cancel";
      buttonCancel.classList.add("dialogButtons");
      div.appendChild(buttonCancel);
  
      divdeleteSubIcon.appendChild(div);
  
      dialogWindow.appendChild(divdeleteSubIcon);
  
      dialogWindow.showModal();
  
      buttonConfirm.onclick = function () {
        deleteSubcategory(categoryId, subCatId);
        dialogWindow.removeChild(divdeleteSubIcon);
        dialogWindow.close();
      };
  
      buttonCancel.onclick = function () {
        dialogWindow.removeChild(divdeleteSubIcon);
        dialogWindow.close();
      };
    };
  
    var contentDiv = document.createElement("div");
    var subCatUl = document.createElement("ul");
    subCatUl.id = "subCatUl_" + subCatId;
    var urlCatUl = document.createElement("ul");
    urlCatUl.id = "urlCatUl_" + subCatId;
    contentDiv.appendChild(subCatUl);
    contentDiv.appendChild(urlCatUl);
  
    let divUrlSub = document.createElement("div");
    divUrlSub.classList.add("divUrlSub");
    divUrlSub.id = "divUrlSub_" + subCatId + "_" + categoryId;
    let ulUrlSub = document.createElement("ul");
    ulUrlSub.id = "urlCatUl_" + subCatId;
  
    divUrlSub.appendChild(contentDiv);
    divUrlSub.appendChild(ulUrlSub);
  
    li.appendChild(subDiv);
  
    li.appendChild(divUrlSub);
  
    let subOpened = false;
    folderIcon.addEventListener("click", () => {
      if (subOpened) {
        folderIcon.textContent = "folder";
        divUrlSub.style = "display:none";
      } else {
        folderIcon.textContent = "folder_open";
        divUrlSub.style = "display:block";
      }
      subOpened = !subOpened;
    });
  
    ul.appendChild(li);
  
    subJSON.sub_ids.forEach((id) => {
      let cat = categoryJSON.filter((cat) => cat.id == id);
      addSubcategoryToHTML(subCatId, cat[0]);
    });
  
    subJSON.urls.forEach((url) => {
      addUrlToSubHTML(subCatId, url);
    });
  }
  
  function deleteSubcategory(categoryId, subCatId) {
    categoryJSON.forEach((cat) => {
      if (cat.id == subCatId) {
        cat.sub_ids.forEach((id) => {
          deleteSubcategory(subCatId, id);
        });
      }
      if (cat.id == categoryId) {
        cat.sub_ids = cat.sub_ids.filter((id) => id !== subCatId);
      }
    });
    categoryJSON = categoryJSON.filter((category) => category.id !== subCatId);
  
    let li = document.getElementById("name_" + subCatId);
    document.getElementById("subCatUl_" + categoryId).removeChild(li);
  
    writeJSON();
  }
  function editName(el, isCat, id) {
    Array.from(document.getElementsByClassName("categoryDiv")).forEach((el) =>
      el.setAttribute("draggable", false)
    );
    Array.from(document.getElementsByClassName("categoryDiv")).forEach((el) =>
      el.removeEventListener("dragstart", onDragStart)
    );
    Array.from(document.getElementsByClassName("categoryDiv")).forEach((el) =>
      el.removeEventListener("dragover", onDragOver)
    );
    Array.from(document.getElementsByClassName("categoryDiv")).forEach((el) =>
      el.removeEventListener("drop", onDrop)
    );
    el.style = "display:none";
    let parent = el.parentNode;
    let entered = false;
  
    const input = document.createElement("input");
    input.type = "text";
    input.value = el.textContent;
  
    if (isCat) {
      input.style = `margin-block-start: 1.33em;
         margin-block-end: 1.33em;
         margin-inline-start: 0px;
         margin-inline-end: 0px;`;
    }
    input.classList.add("editInput");
    parent.insertBefore(input, el);
  
    input.addEventListener("keypress", function (event) {
      if (event.key === "Enter") {
        Array.from(document.getElementsByClassName("categoryDiv")).forEach((el) =>
          el.setAttribute("draggable", true)
        );
        Array.from(document.getElementsByClassName("categoryDiv")).forEach((el) =>
          el.addEventListener("dragstart", onDragStart)
        );
        Array.from(document.getElementsByClassName("categoryDiv")).forEach((el) =>
          el.addEventListener("dragover", onDragOver)
        );
        Array.from(document.getElementsByClassName("categoryDiv")).forEach((el) =>
          el.addEventListener("drop", onDrop)
        );
        entered = true;
        if (input.value.length < 1) {
          let alertVoidName = document.createElement("div");
          alertVoidName.id = "alertVoidName";
  
          let messageVoidName = document.createElement("label");
          messageVoidName.textContent =
            "ERROR:" + "\n\rThe name must contain at least one character!";
          messageVoidName.id = "messageVoidName";
          alertVoidName.appendChild(messageVoidName);
  
          let divVoid = document.createElement("div");
          divVoid.id = "dialogVoidButtonsDiv";
  
          let buttonCloseVoid = document.createElement("button");
          buttonCloseVoid.textContent = "Close";
          buttonCloseVoid.classList.add("dialogButtons");
          divVoid.appendChild(buttonCloseVoid);
  
          alertVoidName.appendChild(divVoid);
          dialogWindow.appendChild(alertVoidName);
  
          dialogWindow.showModal();
  
          buttonCloseVoid.onclick = function () {
            dialogWindow.removeChild(alertVoidName);
            dialogWindow.close();
          };
        } else {
          let foundCat = false;
          let sub_ids;
          if (!isCat) {
            let id_overCat;
            let parent = el;
            while (!(parent.tagName.toLowerCase() == "ul")) {
              parent = parent.parentNode;
            }
            id_overCat = parent.id.replace("subCatUl_", "");
            categoryJSON.forEach((cat) => {
              if (!isCat && cat.id == id_overCat) {
                sub_ids = cat.sub_ids.filter((cat) => cat !== id);
              }
            });
          }
          categoryJSON.forEach((cat) => {
            if (!isCat && sub_ids.includes(cat.id)) {
              if (cat.name.toLowerCase() == input.value.toLowerCase()) {
                foundCat = true;
                let dialogWindow = document.getElementById("dialogWindow");
                let alertCat = document.createElement("div");
                alertCat.id = "alertCat";
  
                let messageCatExists = document.createElement("label");
                messageCatExists.textContent =
                  "ERROR:" + "\n\rThe subcategory already exists!";
                messageCatExists.id = "messageCatExists";
                alertCat.appendChild(messageCatExists);
  
                let divCatExists = document.createElement("div");
                divCatExists.id = "divCatExists";
  
                let buttonClose = document.createElement("button");
                buttonClose.textContent = "Close";
                buttonClose.classList.add("dialogButtons");
                divCatExists.appendChild(buttonClose);
  
                alertCat.appendChild(divCatExists);
                dialogWindow.appendChild(alertCat);
  
                dialogWindow.showModal();
  
                buttonClose.onclick = function () {
                  dialogWindow.removeChild(alertCat);
                  dialogWindow.close();
                };
              }
            }
            if (
              isCat &&
              categoryArray.filter((cat) => cat !== id).includes(cat.id)
            ) {
              if (cat.name.toLowerCase() == input.value.toLowerCase()) {
                foundCat = true;
                let dialogWindow = document.getElementById("dialogWindow");
                let alertCat = document.createElement("div");
                alertCat.id = "alertCat";
  
                let messageCatExists = document.createElement("label");
                messageCatExists.textContent =
                  "ERROR:" + "\n\rThe category already exists!";
                messageCatExists.id = "messageCatExists";
                alertCat.appendChild(messageCatExists);
  
                let divCatExists = document.createElement("div");
                divCatExists.id = "divCatExists";
  
                let buttonClose = document.createElement("button");
                buttonClose.textContent = "Close";
                buttonClose.classList.add("dialogButtons");
                divCatExists.appendChild(buttonClose);
  
                alertCat.appendChild(divCatExists);
                dialogWindow.appendChild(alertCat);
  
                dialogWindow.showModal();
  
                buttonClose.onclick = function () {
                  dialogWindow.removeChild(alertCat);
                  dialogWindow.close();
                };
              }
            }
          });
          if (!foundCat) {
            categoryJSON.forEach((cat) => {
              if (cat.id == id) {
                input.value =
                  input.value[0].toUpperCase() +
                  input.value.substring(1, input.value.length);
                el.textContent = input.value;
                cat.name = input.value;
                writeJSON();
              }
            });
          }
        }
        if (!isCat) {
          el.style = "margin: 1% 15% 0px 6%;";
        }
        el.style.display = "inline";
  
        parent.removeChild(input);
      }
    });
  
    input.addEventListener("blur", function () {
      if (!entered) {
        Array.from(document.getElementsByClassName("categoryDiv")).forEach((el) =>
          el.setAttribute("draggable", true)
        );
        Array.from(document.getElementsByClassName("categoryDiv")).forEach((el) =>
          el.addEventListener("dragstart", onDragStart)
        );
        Array.from(document.getElementsByClassName("categoryDiv")).forEach((el) =>
          el.addEventListener("dragover", onDragOver)
        );
        Array.from(document.getElementsByClassName("categoryDiv")).forEach((el) =>
          el.addEventListener("drop", onDrop)
        );
        if (input.value.length < 1) {
          let alertVoidName = document.createElement("div");
          alertVoidName.id = "alertVoidName";
  
          let messageVoidName = document.createElement("label");
          messageVoidName.textContent =
            "ERROR:" + "\n\rThe name must contain at least one character!";
          messageVoidName.id = "messageVoidName";
          alertVoidName.appendChild(messageVoidName);
  
          let divVoid = document.createElement("div");
          divVoid.id = "dialogVoidButtonsDiv";
  
          let buttonCloseVoid = document.createElement("button");
          buttonCloseVoid.textContent = "Close";
          buttonCloseVoid.classList.add("dialogButtons");
          divVoid.appendChild(buttonCloseVoid);
  
          alertVoidName.appendChild(divVoid);
          dialogWindow.appendChild(alertVoidName);
  
          dialogWindow.showModal();
  
          buttonCloseVoid.onclick = function () {
            dialogWindow.removeChild(alertVoidName);
            dialogWindow.close();
          };
        } else {
          let foundCat = false;
          let sub_ids;
          if (!isCat) {
            let id_overCat;
            let parent = el;
            while (!(parent.tagName.toLowerCase() == "ul")) {
              parent = parent.parentNode;
            }
            id_overCat = parent.id.replace("subCatUl_", "");
            categoryJSON.forEach((cat) => {
              if (!isCat && cat.id == id_overCat) {
                sub_ids = cat.sub_ids.filter((cat) => cat !== id);
              }
            });
          }
          categoryJSON.forEach((cat) => {
            if (!isCat && sub_ids.includes(cat.id)) {
              if (cat.name.toLowerCase() == input.value.toLowerCase()) {
                foundCat = true;
                let dialogWindow = document.getElementById("dialogWindow");
                let alertCat = document.createElement("div");
                alertCat.id = "alertCat";
  
                let messageCatExists = document.createElement("label");
                messageCatExists.textContent =
                  "ERROR:" + "\n\rThe subcategory already exists!";
                messageCatExists.id = "messageCatExists";
                alertCat.appendChild(messageCatExists);
  
                let divCatExists = document.createElement("div");
                divCatExists.id = "divCatExists";
  
                let buttonClose = document.createElement("button");
                buttonClose.textContent = "Close";
                buttonClose.classList.add("dialogButtons");
                divCatExists.appendChild(buttonClose);
  
                alertCat.appendChild(divCatExists);
                dialogWindow.appendChild(alertCat);
  
                dialogWindow.showModal();
  
                buttonClose.onclick = function () {
                  dialogWindow.removeChild(alertCat);
                  dialogWindow.close();
                };
              }
            }
            if (
              isCat &&
              categoryArray.filter((cat) => cat !== id).includes(cat.id)
            ) {
              if (cat.name.toLowerCase() == input.value.toLowerCase()) {
                foundCat = true;
                let dialogWindow = document.getElementById("dialogWindow");
                let alertCat = document.createElement("div");
                alertCat.id = "alertCat";
  
                let messageCatExists = document.createElement("label");
                messageCatExists.textContent =
                  "ERROR:" + "\n\rThe category already exists!";
                messageCatExists.id = "messageCatExists";
                alertCat.appendChild(messageCatExists);
  
                let divCatExists = document.createElement("div");
                divCatExists.id = "divCatExists";
  
                let buttonClose = document.createElement("button");
                buttonClose.textContent = "Close";
                buttonClose.classList.add("dialogButtons");
                divCatExists.appendChild(buttonClose);
  
                alertCat.appendChild(divCatExists);
                dialogWindow.appendChild(alertCat);
  
                dialogWindow.showModal();
  
                buttonClose.onclick = function () {
                  dialogWindow.removeChild(alertCat);
                  dialogWindow.close();
                };
              }
            }
          });
          if (!foundCat) {
            categoryJSON.forEach((cat) => {
              if (cat.id == id) {
                input.value =
                  input.value[0].toUpperCase() +
                  input.value.substring(1, input.value.length);
                el.textContent = input.value;
                cat.name = input.value;
                writeJSON();
              }
            });
          }
        }
        if (!isCat) {
          el.style = "margin: 1% 15% 0px 6%;";
        }
        el.style.display = "inline";
  
        parent.removeChild(input);
      }
    });
  
    input.focus();
  }
    
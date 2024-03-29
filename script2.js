const apiUrl = "http://localhost:3000";
var categoryJSON;

var categoryArray = [];

initHTML();
readJSON();

function initHTML() {
  document.getElementById("searchbookmark").value = "";
  document.getElementById("searchcategory").value = "";
}

function readJSON() {
  fetch(apiUrl + "/get-json")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      categoryJSON = data;
      if (data.length > 0) {
        data.forEach((category) => {
          if (category.isMainCat) {
            addCategoryToHTML(category);
          }
        });
      }
      return data;
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

function writeJSON() {
  fetch(apiUrl + "/write-json", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(categoryJSON),
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (result) {})
    .catch(function (error) {
      console.log("Request failed", error);
    });
}

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
    } else if (name.length > 18) {
      let alertLongName = document.createElement("div");
      alertLongName.id = "alertLongName";

      let messageLongName = document.createElement("label");
      messageLongName.textContent = "ERROR:" + "\n\rThe name is too long!";
      messageLongName.id = "messageLongName";
      alertLongName.appendChild(messageLongName);

      let divLong = document.createElement("div");
      divLong.id = "dialogLongButtonsDiv";

      let buttonCloseLong = document.createElement("button");
      buttonCloseLong.textContent = "Close";
      buttonCloseLong.classList.add("dialogButtons");
      divLong.appendChild(buttonCloseLong);

      alertLongName.appendChild(divLong);
      dialogWindow.appendChild(alertLongName);

      dialogWindow.showModal();

      buttonCloseLong.onclick = function () {
        dialogWindow.removeChild(alertLongName);
        dialogWindow.close();
      };
    } else addCategoryToJSON(name);
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
    let newElement = {
      id: categoryJSON[categoryJSON.length - 1].id + 1,
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
    } else if (subName.length > 15) {
      let dialogWindow = document.getElementById("dialogWindow");
      let alertLongName = document.createElement("div");
      alertLongName.id = "alertLongName";

      let messageLongName = document.createElement("label");
      messageLongName.textContent = "ERROR:" + "\n\rThe name is too long!";
      messageLongName.id = "messageLongName";
      alertLongName.appendChild(messageLongName);

      let divLong = document.createElement("div");
      divLong.id = "dialogLongButtonsDiv";

      let buttonCloseLong = document.createElement("button");
      buttonCloseLong.textContent = "Close";
      buttonCloseLong.classList.add("dialogButtons");
      divLong.appendChild(buttonCloseLong);

      alertLongName.appendChild(divLong);
      dialogWindow.appendChild(alertLongName);

      dialogWindow.showModal();

      buttonCloseLong.onclick = function () {
        dialogWindow.removeChild(alertLongName);
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

function openAddUrlToCategoryDialog(categoryName, categoryId) {
  let dialogWindow = document.getElementById("dialogWindow");
  let divAddBookmark = document.createElement("div");
  divAddBookmark.id = "divAddBookmark";

  let labelInsertBookmark = document.createElement("label");
  labelInsertBookmark.textContent = "Insert Url: ";
  labelInsertBookmark.id = "labelInsertBookmark";
  divAddBookmark.appendChild(labelInsertBookmark);
  divAddBookmark.appendChild(document.createElement("br"));

  divAddBookmark.appendChild(document.createElement("br"));

  let inputBookmark = document.createElement("input");
  inputBookmark.type = "text";
  inputBookmark.classList.add("editBookmarkInput");
  divAddBookmark.appendChild(inputBookmark);

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

  divAddBookmark.appendChild(div);

  dialogWindow.appendChild(divAddBookmark);

  dialogWindow.showModal();

  buttonInsert.onclick = function () {
    let urlBookmark = inputBookmark.value;
    dialogWindow.removeChild(divAddBookmark);
    dialogWindow.close();

    verifyURL(urlBookmark).then((data) => {
      if (data) {
        addUrlToJSON(urlBookmark, categoryName, categoryId);
      } else {
        let alertVoidName = document.createElement("div");
        alertVoidName.id = "alertVoidName";

        let messageVoidName = document.createElement("label");
        messageVoidName.textContent = "ERROR:" + "\n\rUrl doesn't exist!";
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
      }
    });
  };

  buttonCancel.onclick = function () {
    dialogWindow.removeChild(divAddBookmark);
    dialogWindow.close();
  };
}

async function verifyURL(url) {
  try {
    const response = await fetch(apiUrl + "/verify-url?url=" + url);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return await response.json();
  } catch (error) {
    console.error("Error:", error);
  }
}

function addUrlToJSON(url, categoryName, categoryId) {
  let urlAlreadyIn = false;
  let title;
  let catNameUrl;
  let catIdUrl;
  categoryJSON.forEach((category) => {
    category.urls.forEach((el) => {
      if (el.url == url) {
        title = el.title;
        catNameUrl = category.name;
        catIdUrl = category.id;
        urlAlreadyIn = true;
      }
    });
  });
  if (urlAlreadyIn) {
    showAddExistingUrlDialog(
      catNameUrl,
      catIdUrl,
      categoryName,
      categoryId,
      url,
      title
    );
  } else {
    addUrlToCategory(categoryId, url);
  }
}

function showAddExistingUrlDialog(
  catNameUrl,
  catIdUrl,
  categoryName,
  categoryId,
  url,
  title
) {
  let dialogWindow = document.getElementById("dialogWindow");
  let divDialogWindow = document.createElement("div");
  divDialogWindow.id = "divDialogWindow";

  let labelSelection = document.createElement("label");
  labelSelection.textContent =
    "The url is already present in category  '" +
    catNameUrl +
    "'.\n\rWould you like to move it in  '" +
    categoryName +
    "'?";

  let div = document.createElement("div");
  div.id = "dialogButtonsDiv";

  let buttonYes = document.createElement("button");
  buttonYes.textContent = "Yes";
  buttonYes.classList.add("dialogButtons");

  let buttonNo = document.createElement("button");
  buttonNo.textContent = "No";
  buttonNo.classList.add("dialogButtons");

  divDialogWindow.appendChild(labelSelection);
  divDialogWindow.appendChild(div);
  div.appendChild(buttonYes);
  div.appendChild(buttonNo);
  dialogWindow.appendChild(divDialogWindow);
  dialogWindow.showModal();

  buttonYes.onclick = function () {
    addUrlToCategory(categoryId, url);
    deleteUrl(catIdUrl, url, title);
    dialogWindow.removeChild(divDialogWindow);
    dialogWindow.close();
  };

  buttonNo.onclick = function () {
    dialogWindow.removeChild(divDialogWindow);
    dialogWindow.close();
  };
}

let loading=false;
const loader = document.getElementById('loader');
const content = document.getElementById('content');

function showLoader() {
  loader.style.display = 'block';
}

function hideLoader() {
  loader.style.display = 'none';
}


async function addUrlToCategory(categoryId, url) {
  let title;

  await fetch(apiUrl + "/get-page-name?url=" + url)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      title = data.title;
    })
    .catch((error) => {
      console.error("Error:", error);
    })
  loading=flase;

  categoryJSON.forEach((cat, index) => {
    if (cat.id == categoryId) {
      categoryJSON[index].urls.push({ url: url, title: title });
    }
  });
  writeJSON();
  addUrlToHTML(categoryId, { url: url, title: title });
}

async function addUrlToHTML(categoryId, url) {
  bookmarkArray.push({ title: url.title, url: url.url, id: categoryId });
  let ul = document.getElementById("urlCatUl_" + categoryId);
  let divUrlsCat = document.createElement("div");
  divUrlsCat.classList.add("divUrlCat");

  let liUrlCat = document.createElement("li");
  let aUrlCat = document.createElement("a");
  liUrlCat.classList.add("liUrlCat");
  liUrlCat.id = url.url + "_" + categoryId;
  liUrlCat.addEventListener("mouseover", function () {
    this.classList.add("highlights");
  });
  liUrlCat.addEventListener("mouseout", function () {
    this.classList.remove("highlights");
  });
  aUrlCat.setAttribute("href", url.url);
  aUrlCat.setAttribute("target", "_blank");

  if(url.title==null ||url.title=="" ){
 
   await fetch(apiUrl + "/get-page-name?url=" + url.url)
     .then((response) => {
       if (!response.ok) {
         throw new Error("Network response was not ok");
       }
       return response.json();
     })
     .then((data) => {
       url.title = data.title;
     })
     .catch((error) => {
       console.error("Error:", error);
     })
   }

  aUrlCat.setAttribute("title", url.title);

  let editBookmark = document.createElement("i");
  editBookmark.classList.add("material-symbols-outlined");
  editBookmark.textContent = "edit";
  editBookmark.setAttribute("title", "Edit Bookmark");
  editBookmark.id = "editBookmark";

  editBookmark.onclick = function () {
    openEditBookmarkDialog(url.title, url.url, categoryId);
  };

  let deleteUrlIcon = document.createElement("i");
  deleteUrlIcon.classList.add("material-symbols-outlined");
  deleteUrlIcon.textContent = "close";
  deleteUrlIcon.setAttribute("title", "Delete Bookmark");
  deleteUrlIcon.id = "deleteUrlIcon";

  deleteUrlIcon.onclick = function () {
    let dialogWindow = document.getElementById("dialogWindow");
    let divdeleteUrlIcon = document.createElement("div");
    divdeleteUrlIcon.id = "divdeleteUrlIcon";

    let labeldeleteUrlIcon = document.createElement("label");
    labeldeleteUrlIcon.textContent =
      "You are deleting  '" + url.title + "'.\n\r Continue?";
    labeldeleteUrlIcon.id = "labeldeleteUrlIcon";
    divdeleteUrlIcon.appendChild(labeldeleteUrlIcon);

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

    divdeleteUrlIcon.appendChild(div);

    dialogWindow.appendChild(divdeleteUrlIcon);

    dialogWindow.showModal();

    buttonConfirm.onclick = function () {
      deleteUrl(categoryId, url.url, url.title);
      dialogWindow.removeChild(divdeleteUrlIcon);
      dialogWindow.close();
    };

    buttonCancel.onclick = function () {
      dialogWindow.removeChild(divdeleteUrlIcon);
      dialogWindow.close();
    };
  };

  let imgElement = document.createElement("img");
  imgElement.classList.add("icon_img");
  liUrlCat.appendChild(imgElement);

  fetch(apiUrl + "/get-favicon?url=" + url.url)
    .then((response) => response.arrayBuffer())
    .then((buffer) => {
      const im = new Blob([buffer], { type: "image/jpeg" });
      const icon = URL.createObjectURL(im);
      imgElement.src = icon;
    });

  aUrlCat.textContent = url.title;

  liUrlCat.appendChild(aUrlCat);
  ul.appendChild(liUrlCat);
  liUrlCat.appendChild(editBookmark);
  liUrlCat.appendChild(deleteUrlIcon);
  writeJSON();
}

function deleteUrl(categoryId, urlToRemove, title, flag = false) {
  if (!flag) bookmarkArray = bookmarkArray.filter((el) => el.title !== title);
  categoryJSON.forEach((cat, index) => {
    if (cat.id == categoryId) {
      categoryJSON[index].urls = categoryJSON[index].urls.filter(
        (url) => url.url !== urlToRemove
      );
    }
  });

  writeJSON();

  let li = document.getElementById(urlToRemove + "_" + categoryId);
  document.getElementById("urlCatUl_" + categoryId).removeChild(li);
}

function addSubcategoryToJSON(categoryId, subName) {
  let subId = categoryJSON[categoryJSON.length - 1].id + 1;
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
  label.style = "margin: 1% 15% 0 6%";
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

function selectBookmarkToAdd(categoryId, subcatId) {
  let dialogWindow = document.getElementById("dialogWindow");
  let divDialogWindow = document.createElement("div");
  divDialogWindow.id = "divDialogWindow";
  let labelSelection = document.createElement("label");
  labelSelection.textContent = "Choose bookmarks to add: ";
  labelSelection.id = "labelSelection";

  let checkboxContainer = document.createElement("div");
  checkboxContainer.style = "margin-top: 3%";

  categoryJSON.forEach((category) => {
    if (category.id == categoryId) {
      category.urls.forEach((url) => {
        let checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.value = url.url;
        checkbox.id = "checkbox_" + url.url;

        let label = document.createElement("label");
        label.textContent = url.title;
        label.setAttribute("for", "checkbox_" + url.url);

        checkboxContainer.appendChild(checkbox);
        checkboxContainer.appendChild(label);
        checkboxContainer.appendChild(document.createElement("br"));
      });
    }
  });

  let div = document.createElement("div");
  div.id = "dialogButtonsDiv";
  let buttonAdd = document.createElement("button");
  buttonAdd.textContent = "Add";
  buttonAdd.classList.add("dialogButtons");

  let buttonClose = document.createElement("button");
  buttonClose.textContent = "Close";
  buttonClose.classList.add("dialogButtons");

  divDialogWindow.appendChild(labelSelection);
  divDialogWindow.appendChild(checkboxContainer);
  divDialogWindow.appendChild(div);
  div.appendChild(buttonAdd);
  div.appendChild(buttonClose);
  dialogWindow.appendChild(divDialogWindow);

  dialogWindow.showModal();

  buttonAdd.onclick = function () {
    let selectedBookmarks = [];
    let checkboxes = document.querySelectorAll(
      "input[type='checkbox']:checked"
    );

    checkboxes.forEach((checkbox) => {
      selectedBookmarks.push(checkbox.value);
    });

    dialogWindow.removeChild(divDialogWindow);
    dialogWindow.close();
    addUrlToSubJSON(categoryId, subcatId, selectedBookmarks);
  };

  buttonClose.onclick = function () {
    dialogWindow.removeChild(divDialogWindow);
    dialogWindow.close();
  };
}

function addUrlToSubJSON(categoryId, subCatId, selectedBookmarks) {
  selectedBookmarks.forEach((url) => {
    let title;

    categoryJSON.forEach((category) => {
      if (category.id === categoryId) {
        title = category.urls.filter((el) => el.url == url)[0].title;
        category.urls = category.urls.filter((el) => el.url !== url);
      }
    });

    categoryJSON.forEach((category) => {
      if (category.id == subCatId) {
        category.urls.push({ url: url, title: title });
        addUrlToSubHTML(subCatId, { url: url, title: title });
      }
    });
    deleteUrl(categoryId, url, title, true);
  });
  writeJSON();
}

async function addUrlToSubHTML(categoryId, url) {
  let flag = false;
  bookmarkArray.forEach((el) => {
    if (el.title == url.title) {
      el.id = categoryId;
      flag = true;
    }
  });
  if (!flag)
    bookmarkArray.push({ title: url.title, url: url.url, id: categoryId });
  let ulUrlSub = document.getElementById("urlCatUl_" + categoryId);

  let liUrlSub = document.createElement("li");
  liUrlSub.id = url.url + "_" + categoryId;

  liUrlSub.addEventListener("mouseover", function () {
    this.classList.add("highlights");
  });
  liUrlSub.addEventListener("mouseout", function () {
    this.classList.remove("highlights");
  });
  let aUrlSubcat = document.createElement("a");

  let imgElement = document.createElement("img");
  imgElement.classList.add("icon_img");
  liUrlSub.appendChild(imgElement);


  if(url.title==null ||url.title=="" ){
    await fetch(apiUrl + "/get-page-name?url=" + url.url)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        url.title = data.title;
      })
      .catch((error) => {
        console.error("Error:", error);
      })
    }

  fetch(apiUrl + "/get-favicon?url=" + url.url)
    .then((response) => response.arrayBuffer())
    .then((buffer) => {
      const im = new Blob([buffer], { type: "image/jpeg" });
      const image = URL.createObjectURL(im);
      imgElement.src = image;
    });

  aUrlSubcat.textContent = url.title;

  liUrlSub.classList.add("liUrlCat");
  aUrlSubcat.setAttribute("href", url.url);
  aUrlSubcat.setAttribute("target", "_blank");
  aUrlSubcat.setAttribute("title", url.title);
  liUrlSub.appendChild(aUrlSubcat);

  let editBookmarkFromSub = document.createElement("i");
  editBookmarkFromSub.classList.add("material-symbols-outlined");
  editBookmarkFromSub.textContent = "edit";
  editBookmarkFromSub.setAttribute("title", "Edit Bookmark");
  editBookmarkFromSub.id = "editBookmarkFromSub";

  editBookmarkFromSub.onclick = function () {
    openEditBookmarkDialog(url.title, url.url, categoryId);
  };

  let deleteUrlFromSubIcon = document.createElement("i");
  deleteUrlFromSubIcon.classList.add("material-symbols-outlined");
  deleteUrlFromSubIcon.textContent = "close";
  deleteUrlFromSubIcon.setAttribute("title", "Remove Bookmark");
  deleteUrlFromSubIcon.id = "deleteUrlIcon";
  ulUrlSub.appendChild(liUrlSub);
  liUrlSub.appendChild(editBookmarkFromSub);
  liUrlSub.appendChild(deleteUrlFromSubIcon);

  deleteUrlFromSubIcon.onclick = function () {
    let dialogWindow = document.getElementById("dialogWindow");
    let divdeleteUrlIcon = document.createElement("div");
    divdeleteUrlIcon.id = "divdeleteUrlIcon";

    let labeldeleteUrlIcon = document.createElement("label");
    labeldeleteUrlIcon.textContent =
      "You are deleting  '" + url.title + "'.\n\r Continue?";
    labeldeleteUrlIcon.id = "labeldeleteUrlIcon";
    divdeleteUrlIcon.appendChild(labeldeleteUrlIcon);

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

    divdeleteUrlIcon.appendChild(div);

    dialogWindow.appendChild(divdeleteUrlIcon);

    dialogWindow.showModal();

    buttonConfirm.onclick = function () {
      deleteUrl(categoryId, url.url, url.title);
      dialogWindow.removeChild(divdeleteUrlIcon);
      dialogWindow.close();
    };

    buttonCancel.onclick = function () {
      dialogWindow.removeChild(divdeleteUrlIcon);
      dialogWindow.close();
    };
  };
}

function searchCategory(str) {
  let catNames = categoryJSON.map(function (el) {
    return { name: el.name, id: el.id, sub_ids: el.sub_ids };
  });
  let names = catNames
    .filter((category) =>
      category.name.toLowerCase().includes(str.toLowerCase())
    )
    .map((el) => el.id);

  Array.from(document.getElementsByClassName("categoryDiv")).forEach(
    (el) => (el.style = "display:none")
  );

  Array.from(document.getElementsByClassName("divUrlSub")).forEach(
    (el) => (el.style = "display:none")
  );

  document
    .querySelectorAll("h3")
    .forEach((h3Element) => (h3Element.style = "backgroundColor:transparent"));

  Array.from(document.getElementsByClassName("liDiv")).forEach(
    (el) => (el.style = "backgroundColor:transparent")
  );

  if (str !== "") {
    names.forEach((id) => {
      let title = document.getElementById("name_" + id);
      parent = title.parentNode;
      while (!parent.classList.contains("categoryDiv")) {
        if (parent.classList.contains("divUrlSub")) {
          parent.style = "display:block";
        }
        parent = parent.parentNode;
      }
      parent.style = "display: inline-block";
      if (title.tagName.toLowerCase() == "h3")
        title.style = "background-color: #c4c1e0";
      else title.firstChild.style = "background-color: #c4c1e0";
    });
  } else {
    Array.from(document.getElementsByClassName("categoryDiv")).forEach(
      (el) => (el.style = "display:inline-block")
    );
  }
}

var bookmarkArray = [];

function searchBookmark(str) {
  let bookmarks = bookmarkArray.filter((url) =>
    url.title.toLowerCase().includes(str.toLowerCase())
  );

  Array.from(document.getElementsByClassName("categoryDiv")).forEach(
    (el) => (el.style = "display:none")
  );
  Array.from(document.getElementsByClassName("divUrlSub")).forEach(
    (el) => (el.style = "display:none")
  );
  document
    .querySelectorAll("li")
    .forEach((liElement) => (liElement.style = "backgroundColor:transparent"));

  if (str !== "") {
    bookmarks.forEach((el) => {
      let li = document.getElementById(el.url + "_" + el.id);
      parent = li.parentNode;
      while (!parent.classList.contains("categoryDiv")) {
        if (parent.classList.contains("divUrlSub")) {
          parent.style = "display:block";
        }
        parent = parent.parentNode;
      }
      parent.style = "display: inline-block";
      li.style = "background-color: #c4c1e0";
    });
  } else {
    Array.from(document.getElementsByClassName("categoryDiv")).forEach(
      (el) => (el.style = "display:inline-block")
    );
  }
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
      } else if (input.value.length > 18) {
        let alertLongName = document.createElement("div");
        alertLongName.id = "alertLongName";

        let messageLongName = document.createElement("label");
        messageLongName.textContent = "ERROR:" + "\n\rThe name is too long!";
        messageLongName.id = "messageLongName";
        alertLongName.appendChild(messageLongName);

        let divLong = document.createElement("div");
        divLong.id = "dialogLongButtonsDiv";

        let buttonCloseLong = document.createElement("button");
        buttonCloseLong.textContent = "Close";
        buttonCloseLong.classList.add("dialogButtons");
        divLong.appendChild(buttonCloseLong);

        alertLongName.appendChild(divLong);
        dialogWindow.appendChild(alertLongName);

        dialogWindow.showModal();

        buttonCloseLong.onclick = function () {
          dialogWindow.removeChild(alertLongName);
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
      } else if (input.value.length > 18) {
        let alertLongName = document.createElement("div");
        alertLongName.id = "alertLongName";

        let messageLongName = document.createElement("label");
        messageLongName.textContent = "ERROR:" + "\n\rThe name is too long!";
        messageLongName.id = "messageLongName";
        alertLongName.appendChild(messageLongName);

        let divLong = document.createElement("div");
        divLong.id = "dialogLongButtonsDiv";

        let buttonCloseLong = document.createElement("button");
        buttonCloseLong.textContent = "Close";
        buttonCloseLong.classList.add("dialogButtons");
        divLong.appendChild(buttonCloseLong);

        alertLongName.appendChild(divLong);
        dialogWindow.appendChild(alertLongName);

        dialogWindow.showModal();

        buttonCloseLong.onclick = function () {
          dialogWindow.removeChild(alertLongName);
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

function openEditBookmarkDialog(title, url, categoryId) {
  let dialogWindow = document.getElementById("dialogWindow");
  let divEditBookDialogWindow = document.createElement("div");
  divEditBookDialogWindow.id = "divEditBookDialogWindow";

  let labelTitle = document.createElement("label");
  labelTitle.textContent = "Edit Bookmark Name: ";
  labelTitle.id = "labelTitle";
  divEditBookDialogWindow.appendChild(labelTitle);
  divEditBookDialogWindow.appendChild(document.createElement("br"));

  let inputTitle = document.createElement("input");
  inputTitle.type = "text";
  inputTitle.value = title;
  inputTitle.id = "inputTitle" + title;
  inputTitle.classList.add("editBookmarkInput");
  inputTitle.addEventListener("dblclick", function () {
    this.select();
  });
  divEditBookDialogWindow.appendChild(inputTitle);
  divEditBookDialogWindow.appendChild(document.createElement("br"));
  divEditBookDialogWindow.appendChild(document.createElement("br"));

  let labelUrl = document.createElement("label");
  labelUrl.textContent = "Edit Bookmark Url: ";
  labelUrl.id = "labelUrl";
  divEditBookDialogWindow.appendChild(labelUrl);
  divEditBookDialogWindow.appendChild(document.createElement("br"));

  let inputUrl = document.createElement("input");
  inputUrl.type = "text";
  inputUrl.value = url;
  inputUrl.id = "inputTitle" + url;
  inputUrl.classList.add("editBookmarkInput");
  inputUrl.addEventListener("dblclick", function () {
    this.select();
  });
  divEditBookDialogWindow.appendChild(inputUrl);

  let div = document.createElement("div");
  div.id = "dialogEditButtonsDiv";

  let buttonEdit = document.createElement("button");
  buttonEdit.textContent = "Edit";
  buttonEdit.classList.add("dialogButtons");
  div.appendChild(buttonEdit);

  let buttonCancel = document.createElement("button");
  buttonCancel.textContent = "Cancel";
  buttonCancel.classList.add("dialogButtons");
  div.appendChild(buttonCancel);

  divEditBookDialogWindow.appendChild(div);

  dialogWindow.appendChild(divEditBookDialogWindow);

  dialogWindow.showModal();

  buttonEdit.onclick = function () {
    let newTitle = inputTitle.value;
    let newUrl = inputUrl.value;

    if (newTitle.length > 0) {
      verifyURL(newUrl).then((data) => {
        if (data) {
          categoryJSON.forEach((cat) => {
            if (cat.id == categoryId) {
              cat.urls.forEach((oldUrl) => {
                if (oldUrl.url == url) {
                  oldUrl.title = newTitle;
                  oldUrl.url = newUrl;

                  let li = document.getElementById(url + "_" + categoryId);
                  let a = li.children[1];
                  a.setAttribute("href", newUrl);
                  a.setAttribute("title", newTitle);
                  a.textContent = newTitle;
                  li.id = newUrl + "_" + categoryId;
                  dialogWindow.removeChild(divEditBookDialogWindow);
                  dialogWindow.close();
                  writeJSON();
                  fetch(apiUrl + "/get-favicon?url=" + newUrl)
                    .then((response) => response.arrayBuffer())
                    .then((buffer) => {
                      const im = new Blob([buffer], { type: "image/jpeg" });
                      const icon = URL.createObjectURL(im);
                      li.children[0].src = icon;
                    });
                }
              });
            }
          });
        } else {
          dialogWindow.removeChild(divEditBookDialogWindow);
          dialogWindow.close();
          let alertVoidName = document.createElement("div");
          alertVoidName.id = "alertVoidName";

          let messageVoidName = document.createElement("label");
          messageVoidName.textContent = "ERROR:" + "\n\rUrl doesn't exist!";
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
        }
      });
    } else {
      dialogWindow.removeChild(divEditBookDialogWindow);
      dialogWindow.close();
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
    }
  };

  buttonCancel.onclick = function () {
    dialogWindow.removeChild(divEditBookDialogWindow);
    dialogWindow.close();
  };
}

var draggedEl = null;
var release = null;
var id_cat_start = null;
var id_cat_end = null;

function onDragStart(event) {
  draggedEl = event.target;
  id_cat_start = draggedEl.firstChild.firstChild.id.replace("name_", "");
  event.dataTransfer.setData("text/html", draggedEl.innerHTML);
}

function onDragOver(event) {
  event.preventDefault();
}

function onDrop(event) {
  event.preventDefault();
  release = event.target;
  if (!release.classList.contains("categoryDiv")) {
    while (!release.classList.contains("categoryDiv")) {
      release = release.parentNode;
    }
  }

  id_cat_end = release.firstChild.firstChild.id.replace("name_", "");
  draggedEl.parentNode.insertBefore(draggedEl, release);

  let elToMove = null,
    indexToMove = null;

  categoryJSON.forEach((el, index) => {
    if (el.id == id_cat_start) {
      elToMove = el;
    }
    if (el.id == id_cat_end) {
      indexToMove = index;
    }
  });
  categoryJSON = categoryJSON.filter((el) => el !== elToMove);

  categoryJSON = [
    ...categoryJSON.slice(0, indexToMove),
    elToMove,
    ...categoryJSON.slice(indexToMove),
  ];
  writeJSON();
}

function openImportBookmarksDialog() {
  let dialogWindow = document.getElementById("dialogWindow");

  let divImport = document.createElement("div");
  divImport.id = "divImport";

  let labelImport = document.createElement("label");
  labelImport.textContent = "Select file to import:";
  labelImport.id = "labelImport";
  divImport.appendChild(labelImport);

  let closeImportIcon = document.createElement("i");
  closeImportIcon.classList.add("material-symbols-outlined");
  closeImportIcon.textContent = "close";
  closeImportIcon.setAttribute("title", "Close");
  closeImportIcon.id = "closeImportIcon";
  divImport.appendChild(closeImportIcon);

  let divInputImport = document.createElement("div");
  divInputImport.id = "divInputImport";

  let inputFile = document.createElement("input");
  inputFile.type = "file";
  inputFile.accept = ".html";
  inputFile.lang = "en";
  inputFile.id = "inputFile";
  divInputImport.appendChild(inputFile);

  let divButtonImport = document.createElement("div");
  divButtonImport.id = "divButtonImport";

  let confirmImportButton = document.createElement("button");
  confirmImportButton.textContent = "Import";
  confirmImportButton.classList.add("dialogButtons");
  divButtonImport.appendChild(confirmImportButton);

  dialogWindow.appendChild(divImport);
  dialogWindow.appendChild(divInputImport);
  dialogWindow.appendChild(divButtonImport);
  dialogWindow.showModal();

  closeImportIcon.onclick = function () {
    dialogWindow.removeChild(divImport);
    dialogWindow.removeChild(divInputImport);
    dialogWindow.removeChild(divButtonImport);
    dialogWindow.close();
  };

  let fileContent;
  inputFile.addEventListener('change', function(event) {
    fileContent = event.target.files[0];
});

  confirmImportButton.onclick = async function () {
    dialogWindow.removeChild(divImport);
    dialogWindow.removeChild(divInputImport);
    dialogWindow.removeChild(divButtonImport);
    dialogWindow.close();

    const file = inputFile.files[0];

    if (!file) {
        console.error('Nessun file selezionato.');
        return;
    }

    const compressedFile = await compressFile(file);
    await uploadFile(compressedFile);
  };
}

async function compressFile(file) {
  return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = async function () {
          try {
              const compressedData = pako.gzip(reader.result);
              const compressedBlob = new Blob([compressedData], { type: 'application/octet-stream' });
              const compressedFile = new File([compressedBlob], file.name + '.gz', { type: 'application/gzip' });
              resolve(compressedFile);
          } catch (error) {
              reject(error);
          }
      };
      reader.readAsArrayBuffer(file);
  });
}


async function uploadFile(file) {
  const formData = new FormData();
  formData.append('file', file);

  try {
      const response = await fetch(apiUrl+'/send-file', {
          method: 'POST',
          body: formData
      });

      if (response.ok) {
        window.location.reload();
        //  console.log('File inviato con successo!');
      } else {
          console.error('Errore durante l\'invio del file:', response.statusText);
      }
  } catch (error) {
      console.error('Errore durante la richiesta fetch:', error);
  }
}



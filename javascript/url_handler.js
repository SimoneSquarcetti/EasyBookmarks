
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
    });

  categoryJSON.forEach((cat, index) => {
    if (cat.id == categoryId) {
      categoryJSON[index].urls.push({ url: url, title: title });
    }
  });

  writeJSON();  
  addUrlToHTML(categoryId, { url: url, title: title });
  
}

async function addUrlToHTML(categoryId, url) { 
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

  if (url.title == null || url.title == "") {
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
      });
  }
  bookmarkArray.push({ title: url.title, url: url.url, id: categoryId });

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

  if (url.title == null || url.title == "") {
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
      });
  }
  bookmarkArray.forEach((el) => {
    if (el.title == url.title) {
      el.id = categoryId;
      flag = true;
    }
  });
  if (!flag)
    bookmarkArray.push({ title: url.title, url: url.url, id: categoryId });

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

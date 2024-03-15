const apiUrl = "http://localhost:3000";
var categoryJSON;

readJSON();

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
          category["visited"] = false;
        });
        data.forEach((category) => {
          if (!category.visited) {
            addCategoryToHTML(category);
          }
          category["visited"] = true;
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
  var newCategoryDiv = document.createElement("div");
  newCategoryDiv.classList.add("categoryDiv");

  newCategoryDiv.id = category.id;

  var headerDiv = document.createElement("div");
  var title = document.createElement("h3");
  var buttonDiv = document.createElement("div");

  var subCategoryIcon = document.createElement("i");
  subCategoryIcon.classList.add("material-symbols-outlined");
  subCategoryIcon.textContent = "create_new_folder";
  subCategoryIcon.id = "subCategoryIcon";
  subCategoryIcon.setAttribute("title", "Add SubCategory");
  subCategoryIcon.onclick = function () {
    openAddSubcategoryDialog(category.id); //FATTO
  };
  var bookmarkIcon = document.createElement("i");
  bookmarkIcon.classList.add("material-symbols-outlined");
  bookmarkIcon.textContent = "bookmark_add";
  bookmarkIcon.id = "bookmarkIcon";
  bookmarkIcon.setAttribute("title", "Add Bookmark");
  bookmarkIcon.onclick = function () {
    openAddUrlToCategoryDialog(category.name, category.id); //FATTO
  };

  var deleteIcon = document.createElement("i");
  deleteIcon.classList.add("material-symbols-outlined");
  deleteIcon.textContent = "delete";
  deleteIcon.id = "deleteIcon";
  deleteIcon.setAttribute("title", "Delete Category");

  deleteIcon.onclick = function () {
    if (confirm("You are deleting " + category.name + ".\n\r Continue?")) {
      deleteCategory(category.id); //FATTO
    }
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
  var divEsistente = document
    .getElementById("contentDiv")
    .getElementsByTagName("div")[0];

  document
    .getElementById("contentDiv")
    .insertBefore(newCategoryDiv, divEsistente);

  if (category.sub_ids.length > 0) {
    category.sub_ids.forEach((id) => {
      /*subcatArray.push({
        name: categoryJSON[id].name,
        category: category.name,
      });*/

      let cat = categoryJSON.filter((cat) => cat.id == id);

      addSubcategoryToHTML(category.id, cat[0]);
    });
  }
  if (category.urls.length > 0) {
    category.urls.forEach((url) => {
      //bookmarkArray.push({ bookmark: url, category: category.name });
      addUrlToHTML(category.id, url); //FATTO
    });
  }
}

function openAddCategoryDialog() {
  let name = prompt("Insert Category Name");
  if (name.length < 1) alert("The name must contain at least one character");
  else if (name.length > 18) alert("The name is too long");
  else addCategoryToJSON(name);
}

function addCategoryToJSON(name) {
  let foundCat = false;
  categoryJSON.forEach((category) => {
    if (category.name === name) {
      alert("The category already exists!");
      foundCat = true;
    }
  });
  if (!foundCat) {
    let newElement = {
      id: categoryJSON[categoryJSON.length - 1].id + 1,
      name: name,
      urls: [],
      sub_ids: [],
    };
    categoryJSON.push(newElement);
    writeJSON();
    addCategoryToHTML(newElement);
  }
}

function deleteCategory(catId) {
  categoryJSON = categoryJSON.filter((category) => category.id !== catId);
  writeJSON();

  let div = document.getElementById(catId);
  document.getElementById("contentDiv").removeChild(div);
}

function openAddSubcategoryDialog(categoryId) {
  let subName = prompt("Insert Subcategory Name");
  if (subName.length < 1) alert("The name must contain at least one character");
  else if (subName.length > 15) alert("The name is too long");
  else addSubcategoryToJSON(categoryId, subName);
}

function openAddUrlToCategoryDialog(categoryName, categoryId) {
  var urlBookmark = prompt("Insert Bookmark URL");

  verifyURL(urlBookmark).then((data) => {
    console.log(data);
    if (data) {
      addUrlToJSON(urlBookmark, categoryName, categoryId);
    } else {
      alert("L'URL non esiste.");
    }
  });
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
  let categoryIndex;
  let catNameUrl;
  let catIdUrl;
  categoryJSON.forEach((category) => {
    category.urls.forEach((el) => {
      if (el.url == url) {
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
      url
    );
  } else {
    // bookmarkArray.push({ bookmark: url, category: categoryName });
    addUrlToCategory(categoryId, url);
  }
}

function showAddExistingUrlDialog(
  catNameUrl,
  catIdUrl,
  categoryName,
  categoryId,
  url
) {
  let dialogWindow = document.getElementById("dialogWindow");
  let divDialogWindow = document.createElement("div");
  divDialogWindow.id = "divDialogWindow";

  let labelSelection = document.createElement("label");
  labelSelection.textContent =
    "The url is already present in category " +
    catNameUrl +
    "\n\rWould you like to move it in " +
    categoryName +
    "?";

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
    deleteUrl(catIdUrl, url);
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

    console.log(title)

  categoryJSON.forEach((cat, index) => {
    if (cat.id == categoryId) {
      categoryJSON[index].urls.push({ url: url, title: title });
    }
  });
  //categoryJSON[categoryId].urls.push({url:url, title:title})
  writeJSON();
  addUrlToHTML(categoryId, { url: url, title: title });
}

function addUrlToHTML(categoryId, url) {
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

  let deleteUrlIcon = document.createElement("i");
  deleteUrlIcon.classList.add("material-symbols-outlined");
  deleteUrlIcon.textContent = "close";
  deleteUrlIcon.setAttribute("title", "Delete Bookmark");
  deleteUrlIcon.id = "deleteUrlIcon";

  deleteUrlIcon.onclick = function () {
    if (confirm("You are deleting " + url.title + ".\n\rContinue?")) {
      deleteUrl(categoryId, url.url);
    }
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
  liUrlCat.appendChild(deleteUrlIcon);
}

function deleteUrl(categoryId, urlToRemove) {
  categoryJSON.forEach((cat, index) => {
    if ((cat.id == categoryId)) {
      categoryJSON[index].urls = categoryJSON[index].urls.filter(
        (url) => url.url !== urlToRemove
      );
    }
  });

  console.log( categoryJSON);
  writeJSON();

  console.log(urlToRemove + "_" + categoryId)
  let li = document.getElementById(urlToRemove + "_" + categoryId);
  console.log("urlCatUl_" + categoryId)
  document.getElementById("urlCatUl_" + categoryId).removeChild(li);
}


function addSubcategoryToJSON(categoryId, subName) {
  let subId = categoryJSON[categoryJSON.length - 1].id + 1;
  let subJSON = { id: subId, name: subName, urls: [], sub_ids: [] };

  categoryJSON.forEach((cat, index) => {
    if ((cat.id == categoryId)) {
      categoryJSON[index].sub_ids.push(subId);
    }
  });

  categoryJSON.push(subJSON);
  console.log("Added subcat:" + categoryJSON);
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

  li.id = subCatId + "_" + categoryId;

  let folderIcon = document.createElement("i");
  folderIcon.classList.add("material-symbols-outlined");
  folderIcon.textContent = "folder";
  folderIcon.setAttribute("title", subCatName);

  let label = document.createElement("label");
  label.textContent = subCatName;
  label.style = "margin: 1% 15% 0 6%";
  label.setAttribute("title", subCatName);

  subDiv.classList.add("liDiv");
  subDiv.appendChild(subDiv1);
  subDiv1.appendChild(folderIcon);
  subDiv1.appendChild(label);

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
    if (confirm("You are deleting " + subCatName + ".\n\r Continue?")) {
      deleteSubcategory(categoryId, subCatId);
    }
  };
  let divUrlSub = document.createElement("div");
  divUrlSub.classList.add("divUrlSub");
  divUrlSub.id = "divUrlSub_" + subCatId + "_" + categoryId;
  let ulUrlSub = document.createElement("ul");
  ulUrlSub.id = "urlCatUl_" + subCatId 
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

  var contentDiv = document.createElement("div");
  var subCatUl = document.createElement("ul");
  subCatUl.id = "subCatUl_" + subCatId;
  var urlCatUl = document.createElement("ul");
  urlCatUl.id = "urlCatUl_" + subCatId;
  contentDiv.appendChild(subCatUl);
  contentDiv.appendChild(urlCatUl);
  divUrlSub.appendChild(contentDiv);

  subJSON.sub_ids.forEach((id) => {
    let cat = categoryJSON.filter((cat) => cat.id == id);
    addSubcategoryToHTML(subCatId, cat[0]);
  });

  subJSON.visited = true;
  subJSON.urls.forEach((url) => {
    /* subBookmarkArray.push({
      bookmark: url,
      subcategory: subcatName,
      category: categoryId,
    });*/
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
    if (cat.id == categoryId){
        cat.sub_ids = cat.sub_ids.filter((id) => id !== subCatId);
    }
  });
  categoryJSON = categoryJSON.filter((category) => category.id !== subCatId);


  let li = document.getElementById(subCatId + "_" + categoryId);
  document.getElementById("subCatUl_" + categoryId).removeChild(li);

  writeJSON();
}

function selectBookmarkToAdd(categoryId, subcatId) {
    let dialogWindow = document.getElementById("dialogWindow");
    let divDialogWindow = document.createElement("div");
    divDialogWindow.id = "divDialogWindow";
    let labelSelection = document.createElement("label");
    labelSelection.textContent =
      "Choose bookmarks to add: ";
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

    console.log(selectedBookmarks)
    selectedBookmarks.forEach((url) => {
        let title;

      categoryJSON.forEach((category) => {
        if (category.id === categoryId) {
            title = category.urls.filter(el=> el.url==url)[0].title
            category.urls=category.urls.filter(el=> el.url!==url)
        }
      }); 
      
     
      console.log(title)

      categoryJSON.forEach((category) => {
        console.log(category.id, subCatId)
        if (category.id == subCatId) {  
            console.log("entrato")      
            category.urls.push({url:url, title:title})
            addUrlToSubHTML(subCatId, {url:url, title:title})
        }
      }); 
       deleteUrl(categoryId,url)

        /*subBookmarkArray.push({
          bookmark: urlToAdd,
          subcategory: subcatName,
          category: categoryName,
        });*/
    });
    writeJSON();
  }

  
function addUrlToSubHTML(categoryId, url) {

    let ulUrlSub = document.getElementById(
      "urlCatUl_" + categoryId 
    );
  
    let liUrlSub = document.createElement("li");
    liUrlSub.id = url.url +  "_" + categoryId;
  
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

    console.log(url.url)
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
    liUrlSub.appendChild(aUrlSubcat);
  
    let deleteUrlFromSubIcon = document.createElement("i");
    deleteUrlFromSubIcon.classList.add("material-symbols-outlined");
    deleteUrlFromSubIcon.textContent = "close";
    deleteUrlFromSubIcon.setAttribute(
      "title",
      "Remove Bookmark"
    );
    deleteUrlFromSubIcon.id = "deleteUrlIcon";
    ulUrlSub.appendChild(liUrlSub);
    liUrlSub.appendChild(deleteUrlFromSubIcon);
  
    deleteUrlFromSubIcon.onclick = function () {
      if (confirm("Are you sure to remove the url?")) {
        deleteUrl(categoryId,url.url);
      }
    };
  }


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
          addCategoryToHTML(category.name);
          if (category.subcategories.length > 0) {
            category.subcategories.forEach((sub) => {
              subcatArray.push({ name: sub.name, category: category.name });
              addSubcategoryToHTML(category.name, sub);
            });
          }
          if (category.urls.length > 0) {
            category.urls.forEach((url) => {
              /*var urlToSplit = url;
              var urlParts = urlToSplit.split("/"); 
              urlParts.pop(); 
              var newUrl = urlParts.join("/"); */
              bookmarkArray.push({ bookmark: url, category: category.name });
              addUrlToHTML(category.name, url);
            });
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
      name: name,
      urls: [],
      subcategories: [],
    };
    categoryJSON.push(newElement);
    writeJSON();
    addCategoryToHTML(name);
  }
}

function addCategoryToHTML(name) {
  var newCategoryDiv = document.createElement("div");
  newCategoryDiv.classList.add("categoryDiv");
  newCategoryDiv.id = name;

  var headerDiv = document.createElement("div");
  var title = document.createElement("h3");
  var buttonDiv = document.createElement("div");

  var subCategoryIcon = document.createElement("i");
  subCategoryIcon.classList.add("material-symbols-outlined");
  subCategoryIcon.textContent = "create_new_folder";
  subCategoryIcon.id = "subCategoryIcon";
  subCategoryIcon.setAttribute("title", "Add SubCategory");
  subCategoryIcon.onclick = function () {
    openAddSubcategoryDialog(name);
  };
  var bookmarkIcon = document.createElement("i");
  bookmarkIcon.classList.add("material-symbols-outlined");
  bookmarkIcon.textContent = "bookmark_add";
  bookmarkIcon.id = "bookmarkIcon";
  bookmarkIcon.setAttribute("title", "Add Bookmark");
  bookmarkIcon.onclick = function () {
    openAddUrlToCategoryDialog(name);
  };

  var deleteIcon = document.createElement("i");
  deleteIcon.classList.add("material-symbols-outlined");
  deleteIcon.textContent = "delete";
  deleteIcon.id = "deleteIcon";
  deleteIcon.setAttribute("title", "Delete Category");

  deleteIcon.onclick = function () {
    if (confirm("You are deleting " + name + ".\n\r Continue?")) {
      deleteCategory(name);
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
  subCatUl.id = "subCatUl_" + name;
  var urlCatUl = document.createElement("ul");
  urlCatUl.id = "urlCatUl_" + name;
  contentDiv.appendChild(subCatUl);
  contentDiv.appendChild(urlCatUl);
  newCategoryDiv.appendChild(contentDiv);

  title.textContent = name;
  var divEsistente = document
    .getElementById("contentDiv")
    .getElementsByTagName("div")[0];

  document
    .getElementById("contentDiv")
    .insertBefore(newCategoryDiv, divEsistente);
}

function deleteCategory(name) {
  let elementToRemove;
  categoryJSON.forEach((category) => {
    if (category.name == name) elementToRemove = category;
  });
  categoryJSON = categoryJSON.filter(
    (category) => category !== elementToRemove
  );
  writeJSON();
  let div = document.getElementById(name);
  document.getElementById("contentDiv").removeChild(div);
}

function openAddSubcategoryDialog(categoryName) {
  let subName = prompt("Insert Subcategory Name");
  if (subName.length < 1) alert("The name must contain at least one character");
  else if (subName.length > 15) alert("The name is too long");
  else addSubcategoryToJSON(categoryName, subName);
}

function openAddUrlToCategoryDialog(categoryName) {
  var urlBookmark = prompt("Insert Bookmark URL");
  verifyURL(categoryName, urlBookmark);
}

function verifyURL(categoryName, url) {
  fetch(apiUrl + "/verify-url?url=" + url)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      if (data) {
        addUrlToJSON(categoryName, url);
      } else {
        alert("L'URL non esiste.");
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

function addSubcategoryToJSON(categoryName, subName) {
  let subJSON = { name: subName, urls: [] };
  categoryJSON.forEach((category) => {
    if (category.name == categoryName) {
      subcatArray.push({ name: subName, category: categoryName });
      category.subcategories.push(subJSON);
    }
  });
  writeJSON();
  addSubcategoryToHTML(categoryName, subJSON, subName);
}

function addUrlToJSON(categoryName, url) {
  let urlAlreadyIn = false;
  let categoryIndex;
  categoryJSON.forEach((category, index) => {
    if (category.name == categoryName) {
      categoryIndex = index;
      category.urls.forEach((el) => {
        if (el == url) {
          urlAlreadyIn = true;
        }
      });
    }
  });

  if (urlAlreadyIn)
    alert("The url is already present in category " + categoryName);
  else {
    bookmarkArray.push({ bookmark: url, category: categoryName });
    categoryJSON[categoryIndex].urls.push(url);

    writeJSON();
    addUrlToHTML(categoryName, url);
  }
}

function addSubcategoryToHTML(categoryName, subJSON) {
  let ul = document.getElementById("subCatUl_" + categoryName);
  let li = document.createElement("li");
  let subDiv = document.createElement("div");
  let subDiv1 = document.createElement("div");
  subDiv1.classList.add("liDiv1");
  let subcatName = subJSON.name;
  li.id = subcatName + "_" + categoryName;
  let folderIcon = document.createElement("i");
  folderIcon.classList.add("material-symbols-outlined");
  folderIcon.textContent = "folder";
  folderIcon.setAttribute("title", "SubCategory");

  let label = document.createElement("label");
  label.textContent = subJSON.name;
  label.style = "margin: 1% 15% 0 6%";
  label.setAttribute("title", subcatName);
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
    selectBookmarkToAdd(categoryName, subcatName);
  };

  let deleteSubcatIcon = document.createElement("i");
  deleteSubcatIcon.classList.add("material-symbols-outlined");
  deleteSubcatIcon.textContent = "delete_forever";
  deleteSubcatIcon.setAttribute("title", "Delete SubCategory");
  deleteSubcatIcon.id = "deleteSubcatIcon";
  subDiv.appendChild(deleteSubcatIcon);

  deleteSubcatIcon.onclick = function () {
    if (confirm("You are deleting " + subcatName + ".\n\r Continue?")) {
      deleteSubcategory(categoryName, subcatName);
    }
  };
  let divUrlSub = document.createElement("div");
  divUrlSub.classList.add("divUrlSub");
  divUrlSub.id = "divUrlSub_" + subcatName + "_" + categoryName;
  let ulUrlSub = document.createElement("ul");
  ulUrlSub.id = "ulUrlSub_" + subcatName + "_" + categoryName;
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

  subJSON.urls.forEach((url) => {
    subBookmarkArray.push({
      bookmark: url,
      subcategory: subcatName,
      category: categoryName,
    });
    addUrlToSubHTML(categoryName, subcatName, url);
  });
}

function deleteSubcategory(categoryName, subcatName) {
  let categorySub;
  let elementToRemove;
  categoryJSON.forEach((category) => {
    if (category.name == categoryName) {
      categorySub = category.subcategories;
      categorySub.forEach((subcategories) => {
        if (subcategories.name == subcatName) {
          elementToRemove = subcategories;
        }
      });
    }
  });

  const categoryIndex = categoryJSON.findIndex(
    (category) => category.name === categoryName
  );
  categoryJSON[categoryIndex].subcategories = categoryJSON[
    categoryIndex
  ].subcategories.filter((subcategory) => subcategory !== elementToRemove);

  subcatArray = subcatArray.filter(
    (subcategory) =>
      subcategory.category !== categoryName || subcategory.name !== subcatName
  );

  writeJSON();
  let li = document.getElementById(subcatName + "_" + categoryName);
  document.getElementById("subCatUl_" + categoryName).removeChild(li);
}

function addUrlToHTML(categoryName, url) {
  let ul = document.getElementById("urlCatUl_" + categoryName);
  let divUrlsCat = document.createElement("div");
  divUrlsCat.classList.add("divUrlCat");

  let liUrlCat = document.createElement("li");
  let aUrlCat = document.createElement("a");
  liUrlCat.classList.add("liUrlCat");
  liUrlCat.id = url + "_" + categoryName;
  liUrlCat.addEventListener("mouseover", function () {
    this.classList.add("highlights");
  });
  liUrlCat.addEventListener("mouseout", function () {
    this.classList.remove("highlights");
  });
  aUrlCat.setAttribute("href", url);
  aUrlCat.setAttribute("target", "_blank");

  let deleteUrlIcon = document.createElement("i");
  deleteUrlIcon.classList.add("material-symbols-outlined");
  deleteUrlIcon.textContent = "close";
  deleteUrlIcon.setAttribute("title", "Delete Bookmark");
  deleteUrlIcon.id = "deleteUrlIcon";

  deleteUrlIcon.onclick = function () {
    if (confirm("You are deleting " + url + ".\n\rContinue?")) {
      deleteUrl(categoryName, url);
    }
  };

  let imgElement = document.createElement("img");
  imgElement.classList.add("icon_img");
  liUrlCat.appendChild(imgElement);

  fetch(apiUrl + "/get-favicon?url=" + url)
    .then((response) => response.arrayBuffer())
    .then((buffer) => {
      const im = new Blob([buffer], { type: "image/jpeg" });
      const image = URL.createObjectURL(im);

      imgElement.src = image;
    });

  fetch(apiUrl + "/get-page-name?url=" + url)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      aUrlCat.textContent = data.title;
    })
    .catch((error) => {
      console.error("Error:", error);
    });

  liUrlCat.appendChild(aUrlCat);
  ul.appendChild(liUrlCat);
  liUrlCat.appendChild(deleteUrlIcon);
}

function deleteUrl(categoryName, urlToRemove) {
  let categoryUrl;
  let elementToRemove;

  categoryJSON.forEach((category) => {
    if (category.name == categoryName) {
      categoryUrl = category.urls;

      categoryUrl.forEach((url) => {
        if (url == urlToRemove) {
          elementToRemove = url;
        }
      });
    }
  });

  const categoryIndex = categoryJSON.findIndex(
    (category) => category.name === categoryName
  );

  categoryJSON[categoryIndex].urls = categoryJSON[categoryIndex].urls.filter(
    (url) => url !== elementToRemove
  );

  writeJSON();

  let li = document.getElementById(urlToRemove + "_" + categoryName);
  document.getElementById("urlCatUl_" + categoryName).removeChild(li);
}

function deleteUrlFromSubcategory(categoryName, subcatName, urlToRemove) {
  let categorySub;
  let subcategoryUrl;
  let elementToRemove;
  categoryJSON.forEach((category) => {
    if (category.name == categoryName) {
      categorySub = category.subcategories;
      categorySub.forEach((subcategories) => {
        if (subcategories.name == subcatName) {
          subcategoryUrl = subcategories.urls;
          subcategoryUrl.forEach((url) => {
            if (url == urlToRemove) {
              elementToRemove = url;
            }
          });
        }
      });
    }
  });

  const categoryIndex = categoryJSON.findIndex(
    (category) => category.name === categoryName
  );
  const subCategoryIndex = categoryJSON[categoryIndex].subcategories.findIndex(
    (subcategories) => subcategories.name === subcatName
  );
  categoryJSON[categoryIndex].subcategories[subCategoryIndex].urls =
    categoryJSON[categoryIndex].subcategories[subCategoryIndex].urls.filter(
      (url) => url !== elementToRemove
    );

  const arrayIndex = subBookmarkArray.findIndex(
    (url) => url.bookmark == elementToRemove && url.category == categoryName
  );
  subBookmarkArray = subBookmarkArray.filter(
    (el) => el !== subBookmarkArray[arrayIndex]
  );

  writeJSON();

  addUrlToJSON(categoryName, urlToRemove);

  let li = document.getElementById(
    urlToRemove + "_" + subcatName + "_" + categoryName
  );
  document
    .getElementById("ulUrlSub_" + subcatName + "_" + categoryName)
    .removeChild(li);
}

function selectBookmarkToAdd(categoryName, subcatName) {
  let dialogWindow = document.getElementById("dialogWindow");
  let divDialogWindow = document.createElement("div");
  divDialogWindow.id = "divDialogWindow";
  let labelSelection = document.createElement("label");
  labelSelection.textContent =
    "Choose bookmarks to add to " + subcatName + ": ";
  labelSelection.id = "labelSelection";

  let checkboxContainer = document.createElement("div");
  checkboxContainer.style = "margin-top: 3%";
  let categoryUrls;
  categoryJSON.forEach((category) => {
    if (category.name == categoryName) {
      categoryUrls = category.urls;

      categoryUrls.forEach((url) => {
        let checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.value = url;
        checkbox.id = "checkbox_" + url;

        let label = document.createElement("label");

        fetch(apiUrl + "/get-page-name?url=" + url)
          .then((response) => {
            if (!response.ok) {
              throw new Error("Network response was not ok");
            }
            return response.json();
          })
          .then((data) => {
            label.textContent = data.title;
          })
          .catch((error) => {
            console.error("Error:", error);
          });

        label.setAttribute("for", "checkbox_" + url);

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
    addUrlToSubJSON(categoryName, subcatName, selectedBookmarks);
  };

  buttonClose.onclick = function () {
    dialogWindow.removeChild(divDialogWindow);
    dialogWindow.close();
  };
}

function addUrlToSubJSON(categoryName, subcatName, selectedBookmarks) {
  let urlAlreadyIn = false;
  let categorySub;
  let subcategoryUrl;
  let categoryIndex;
  let subcategoryIndex;
  let urlToAdd;
  selectedBookmarks.forEach((url) => {
    categoryJSON.forEach((category, index) => {
      if (category.name == categoryName) {
        categoryIndex = index;

        categorySub = category.subcategories;

        categorySub.forEach((subcategories, index) => {
          if (subcategories.name == subcatName) {
            subcategoryIndex = index;

            subcategoryUrl = subcategories.urls;
            urlToAdd = url;

            subcategoryUrl.forEach((el) => {
              if (el == url) {
                urlAlreadyIn = true;
              }
            });
          }
        });
      }
    });

    if (urlAlreadyIn)
      alert("The bookmark is already present in subcategory " + subcatName);
    else {
      subBookmarkArray.push({
        bookmark: urlToAdd,
        subcategory: subcatName,
        category: categoryName,
      });
      categoryJSON[categoryIndex].subcategories[subcategoryIndex].urls.push(
        urlToAdd
      );

      writeJSON();
      deleteUrl(categoryName, urlToAdd);
      addUrlToSubHTML(categoryName, subcatName, urlToAdd);
    }
  });
}

function addUrlToSubHTML(categoryName, subcatName, url) {
  let ulUrlSub = document.getElementById(
    "ulUrlSub_" + subcatName + "_" + categoryName
  );

  let liUrlSub = document.createElement("li");
  liUrlSub.id = url + "_" + subcatName + "_" + categoryName;

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
  fetch(apiUrl + "/get-favicon?url=" + url)
    .then((response) => response.arrayBuffer())
    .then((buffer) => {
      const im = new Blob([buffer], { type: "image/jpeg" });
      const image = URL.createObjectURL(im);

      imgElement.src = image;
    });

  fetch(apiUrl + "/get-page-name?url=" + url)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      aUrlSubcat.textContent = data.title;
    })
    .catch((error) => {
      console.error("Error:", error);
    });
  liUrlSub.classList.add("liUrlCat");
  aUrlSubcat.setAttribute("href", url);
  aUrlSubcat.setAttribute("target", "_blank");
  liUrlSub.appendChild(aUrlSubcat);

  let deleteUrlFromSubIcon = document.createElement("i");
  deleteUrlFromSubIcon.classList.add("material-symbols-outlined");
  deleteUrlFromSubIcon.textContent = "close";
  deleteUrlFromSubIcon.setAttribute(
    "title",
    "Remove Bookmark from " + subcatName
  );
  deleteUrlFromSubIcon.id = "deleteUrlIcon";
  ulUrlSub.appendChild(liUrlSub);
  liUrlSub.appendChild(deleteUrlFromSubIcon);

  deleteUrlFromSubIcon.onclick = function () {
    if (confirm("Remove from " + subcatName + ".\n\r Continue?")) {
      deleteUrlFromSubcategory(categoryName, subcatName, url);
    }
  };
}

var subcatArray = [];

function searchCategory(str) {
  let catNames = categoryJSON.map((el) => el.name);
  let names = catNames.filter((category) =>
    category.toLowerCase().includes(str.toLowerCase())
  );
  let subcatNames = subcatArray.filter((subcat) =>
    subcat.name.toLowerCase().includes(str.toLowerCase())
  );
  let noNames = catNames.filter(
    (category) => !category.toLowerCase().includes(str.toLowerCase())
  );
  let catSubcatNames = subcatNames.map((el) => el.category);

  noNames.forEach((category) => {
    catSubcatNames.forEach((catSubcat) => {
      if (category === catSubcat) {
        noNames = noNames.filter((el) => el !== category);
      }
    });
  });

  Array.from(document.getElementsByClassName("categoryDiv")).forEach(
    (el) => (el.style = "display:inline-block")
  );
  document
    .querySelectorAll("h3")
    .forEach((h3Element) => (h3Element.style = "backgroundColor:transparent"));
  document
    .querySelectorAll("li")
    .forEach((liElement) => (liElement.style = "backgroundColor:transparent"));
  if (str !== "") {
    names.forEach((name) => {
      let div = document.getElementById(name);
      div.querySelector("h3").style = "background-color: #c4c1e0";
    });
    noNames.forEach((name) => {
      document.getElementById(name).style = "display:none";
    });

    subcatNames.forEach((subcat) => {
      let li = document.getElementById(subcat.name + "_" + subcat.category);
      li.style = "background-color: #c4c1e0";
    });
  }
}

var bookmarkArray = [];
var subBookmarkArray = [];

function searchBookmark(str) {
  let bookmarks = bookmarkArray.filter((url) =>
    url.bookmark
      .replace("https", "")
      .replace("www", "")
      .replace("://", "")
      .replace(".it", "")
      .replace(".com", "")
      .includes(str.toLowerCase())
  );

  let subBookmarks = subBookmarkArray.filter((url) =>
    url.bookmark
      .replace("https", "")
      .replace("www", "")
      .replace("://", "")
      .replace(".it", "")
      .replace(".com", "")
      .includes(str.toLowerCase())
  );

  let names = bookmarks.map((el) => el.category);
  let names2 = subBookmarks.map((el) => el.category);
  let noNames = categoryJSON
    .map((el) => el.name)
    .filter((cat) => !names.includes(cat))
    .filter((cat) => !names2.includes(cat));

  Array.from(document.getElementsByClassName("categoryDiv")).forEach(
    (el) => (el.style = "display:inline-block")
  );
  Array.from(document.getElementsByClassName("divUrlSub")).forEach(
    (el) => (el.style = "display:none")
  );
  document
    .querySelectorAll("li")
    .forEach((liElement) => (liElement.style = "backgroundColor:transparent"));
  if (str !== "") {
    bookmarks.forEach((url) => {
      let li = document.getElementById(url.bookmark + "_" + url.category);
      li.style = "background-color: #c4c1e0";
    });

    subBookmarks.forEach((url) => {
      let li = document.getElementById(
        url.bookmark + "_" + url.subcategory + "_" + url.category
      );
      li.style = "background-color: #c4c1e0";
      document.getElementById(
        "divUrlSub_" + url.subcategory + "_" + url.category
      ).style = "display:block";
    });

    noNames.forEach((name) => {
      document.getElementById(name).style = "display:none";
    });
  }
}

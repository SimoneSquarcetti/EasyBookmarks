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
              addSubcategoryToHTML(category.name, sub);
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
    //function per aggiunger url
  };

  var settingIcon = document.createElement("i");
  settingIcon.classList.add("material-symbols-outlined");
  settingIcon.textContent = "manufacturing";
  settingIcon.id = "settingIcon";
  settingIcon.setAttribute("title", "Settings");

  settingIcon.onclick = function(){
    deleteCategory(name);
  }

  buttonDiv.classList.add("buttonDiv");
  headerDiv.classList.add("headerDiv");
  buttonDiv.appendChild(subCategoryIcon);
  buttonDiv.appendChild(bookmarkIcon);
  buttonDiv.appendChild(settingIcon);

  headerDiv.appendChild(title);
  headerDiv.appendChild(buttonDiv);

  newCategoryDiv.appendChild(headerDiv);

  var contentDiv = document.createElement("div");
  var subCatUl = document.createElement("ul");
  subCatUl.id = "subCatUl_" + name;
  contentDiv.appendChild(subCatUl);
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
    writeJSON()
  let div = document.getElementById(name);
  document.getElementById("contentDiv").removeChild(div);
}

function openAddSubcategoryDialog(categoryName) {
  let subName = prompt("Insert Subcategory Name");
  if (subName.length < 1) alert("The name must contain at least one character");
  else if (subName.length > 18) alert("The name is too long");
  else addSubcategoryToJSON(categoryName, subName);
}

function addSubcategoryToJSON(categoryName, subName) {
  console.log(categoryName, subName);

  let subJSON = { name: subName, urls: [] };
  categoryJSON.forEach((category) => {
    if (category.name == categoryName) {
      category.subcategories.push(subJSON);
    }
  });
  writeJSON();
  addSubcategoryToHTML(categoryName, subJSON);
}

function addSubcategoryToHTML(categoryName, subJSON) {
  let ul = document.getElementById("subCatUl_" + categoryName);
  let li = document.createElement("li");
  let div = document.createElement("div");
  let icon = document.createElement("i");
  icon.classList.add("material-symbols-outlined");
  icon.textContent = "folder";
  icon.setAttribute("title", "SubCategory");

  let label = document.createElement("label");
  label.textContent = subJSON.name;
  label.style = "margin-left:5%";
  div.classList.add("liDiv");
  div.appendChild(icon);
  div.appendChild(label);

  let divUrlSub = document.createElement("div");
  divUrlSub.classList.add("divUrlSub");
  let ulUrlSub = document.createElement("ul");
  subJSON.urls.forEach((url) => {
    let liUrlSub = document.createElement("li");
    liUrlSub.textContent = url;
    ulUrlSub.appendChild(liUrlSub);
  });

  divUrlSub.appendChild(ulUrlSub);

  li.appendChild(div);

  li.appendChild(divUrlSub);
  //li.textContent= subName;

  let flag = false;
  li.addEventListener("click", () => {
    flag = !flag;
    if (flag) {
      icon.textContent = "folder_open";
      divUrlSub.style = "display:block";
    } else {
      icon.textContent = "folder";
      divUrlSub.style = "display:none";
    }
  });
  ul.appendChild(li);
}

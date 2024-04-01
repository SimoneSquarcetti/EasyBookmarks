

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







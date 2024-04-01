

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
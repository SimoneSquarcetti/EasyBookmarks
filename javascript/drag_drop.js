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
  console.log(draggedEl)
  console.log(release)
  if (!release.classList.contains("categoryDiv")) {
    while (!release.classList.contains("categoryDiv")) {
      release = release.parentNode;
    }
  }

  id_cat_end = release.firstChild.firstChild.id.replace("name_", "");
  draggedEl.parentNode.insertBefore(draggedEl, release);

  let elToMove = null,
    indexToMove = null, indexStart=null;

  categoryJSON.forEach((el, index) => {
    if (el.id == id_cat_start) {
      elToMove = el;
      indexStart=index
    }
    if (el.id == id_cat_end) {
      indexToMove = index;
    }
  });
  categoryJSON = categoryJSON.filter((el) => el !== elToMove);

  
console.log(indexStart, indexToMove)


  if(indexStart>indexToMove){
    categoryJSON = [
        ...categoryJSON.slice(0, indexToMove),
        elToMove,
        ...categoryJSON.slice(indexToMove),
      ];
  }else{
    categoryJSON = [
        ...categoryJSON.slice(0, indexToMove-1),
        elToMove,
        ...categoryJSON.slice(indexToMove-1),
      ];
  }
 
  writeJSON();
}
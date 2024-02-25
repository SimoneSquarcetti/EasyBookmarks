/*fetch('C:/Users/simos/Desktop/EasyBookmarks/categories.json', {
    method: 'GET',
    headers: {
    'Access-Control-Allow-Origin': '*',
 }})
    .then((response) => response.json())
    .then((json) => console.log(json))
    .catch(err => console.error(err));

*/
function addCategory(name){
   var newCategoryDiv = document.createElement("div");
   newCategoryDiv.classList.add("categoryDiv");

   newCategoryDiv.textContent = name;
   var divEsistente = document.getElementById("contentDiv").getElementsByTagName("div")[0];

   document.getElementById("contentDiv").insertBefore(newCategoryDiv, divEsistente);

}

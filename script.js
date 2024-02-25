fetch('C:/Users/simos/Desktop/EasyBookmarks/categories.json', {
    method: 'GET',
    headers: {
    'Access-Control-Allow-Origin': '*',
 }})
    .then((response) => response.json())
    .then((json) => console.log(json))
    .catch(err => console.error(err));




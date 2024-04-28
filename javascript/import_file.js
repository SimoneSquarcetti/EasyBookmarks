let loading=false;
const loader = document.querySelector(".loader");


function showLoader() {
  loader.style.display = 'block';
}

function hideLoader() {
  loader.style.display = 'none';
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
        showLoader()
        const response = await fetch(apiUrl+'/send-file', {
            method: 'POST',
            body: formData
        });
  
        if (response.ok) {
            hideLoader()
          window.location.reload();
         
        } else {
            console.error('Errore durante l\'invio del file:', response.statusText);
        }
    } catch (error) {
        console.error('Errore durante la richiesta fetch:', error);
    }
  }
  
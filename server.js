const express = require('express');
const fs = require('fs');
const app = express();
const port = 3000;

/*app.get('/get-json', (req, res) => {
    // Percorso del file JSON
    const filePath = './EasyBookmarks/categories.json';

    // Leggi il file JSON in modo asincrono
    fs.readFile(filePath, 'utf-8', (err, data) => {
        if (err) {
            console.error('Errore nella lettura del file JSON', err);
            res.status(500).send('Errore interno del server');
            //return;
        }

        // Invia il contenuto del file JSON come risposta
        res.json(JSON.parse(data));
    });
});*/

function readJSON(){
    const path = "/categories.json";
    fs.readFile(path, 'utf-8', (err, data) => {
        if (err) {
            console.error('Errore nella lettura del file JSON', err);
            res.status(500).send('Errore interno del server');
            //return;
        }
        console.log(JSON.parse(data));
        return JSON.parse(data);
        // Invia il contenuto del file JSON come risposta
        //res.json(JSON.parse(data));
})

};

app.listen(port, () => {
    console.log(`Server in ascolto su http://localhost:${port}`);
});

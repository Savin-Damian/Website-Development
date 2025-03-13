
class Produs {
    constructor(nume, cantitate) {
        this.nume = nume;
        this.cantitate = cantitate;
    }
}
var work = new Worker('js/worker.js')

let id=0;
function adauga_produs(){
    
    let a=document.getElementById("name").value;
    let b=document.getElementById("cantitate").value;
    let p=new Produs(a,b);
    id = id+ 1;
    //localStorage.setItem(" "+id,JSON.stringify(p)); //folosit pentru lab8 Tema1
    work.postMessage('Butonul Adaugă a fost apăsat!');
}

work.onmessage = function(event) {
    console.log("Mesaj primit de la worker: " + event.data);
    let a = document.getElementById("name").value;
    let b = document.getElementById("cantitate").value;
    if(a.trim() === '')
    {
        alert("Completați câmpul Nume Produs!");
        return;
    }
    else if (b.trim() === '')
    {
        alert("Completați câmpul Cantitate!");
        return;
    }
    else if (a.trim() === '' && b.trim() === '')
    {
        alert("Completați ambele câmpuri!");
        return;
    }
    else if(a=="Clăpari pentru" || a=="Clăpari" ||a=="Ochelari pentru" ||a=="Ochelari" || a=="Mască"|| a=="Geacă"|| a=="Pantaloni"|| a=="Sanie pentru" || a=="Colac pentru" || a=="Colac" )
    {
        alert("Introduceți întreaga denumire!")
        return;
    }
    else if( a !=="Skiuri" && a!=="Clăpari pentru ski" && a!=="Ochelari pentru ski"&& a!=="Mască cu ochelari"&& a!=="Geacă protecție"&& a!=="Pantaloni protecție"&& a!=="Snowboard"&& a!=="Sanie"&& a!=="Sanie pentru copii" && a!=="Colac pentru zăpadă")
    {
        alert("Produsul nu există pe site!")
        return;
    } 
    else{ 
        let p = new Produs(a, b);
        const cumparaturi = alegere_mod_salvare();
        //adaugare_tabel(id, p); //folosit la lab8 tema2
        cumparaturi.adaugaProdus(p);
    }
};
/*  Folosit la tema2 Lab8
function adaugare_tabel(id, produs) {
    var table = document.getElementById("tabel_cumparaturi");
    var row = table.insertRow(); 
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    var cell3 = row.insertCell(2);
    cell1.innerHTML = id;
    cell2.innerHTML = produs.nume;
    cell3.innerHTML = produs.cantitate;
}
*/

let id_ls=0
let id_idb=0
class salvare_cumparaturi {
    constructor() {}

    adaugaProdus(produs) {
        throw new Error('Suprascriem Metoda');
    }
}

class salvare_localStorage extends salvare_cumparaturi {
    constructor() {
        super();
    }

    adaugaProdus(produs) {
        id_ls+=1;
        let cumparaturi = JSON.parse(localStorage.getItem('listaCumparaturi')) || [];
        cumparaturi.push(produs);
        localStorage.setItem('listaCumparaturi', JSON.stringify(cumparaturi));

        var table = document.getElementById("tabel_cumparaturi");
        var row = table.insertRow(); 
        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        var cell3 = row.insertCell(2);
        cell1.innerHTML = id_ls;
        cell2.innerHTML = produs.nume;
        cell3.innerHTML = produs.cantitate;
    }
}

class salvare_indexedDB extends salvare_cumparaturi { 
    constructor() {
        super();
        this.dbName = 'cumparaturiDB';
        this.dbVersion = 1;
        this.dbRequest = indexedDB.open(this.dbName, this.dbVersion);
    }

    adaugaProdus(produs) {
        id_idb+=1;
        var table = document.getElementById("tabel_cumparaturi2");
        var row = table.insertRow(); 
        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        var cell3 = row.insertCell(2);
        cell1.innerHTML = id_idb;
        cell2.innerHTML = produs.nume;
        cell3.innerHTML = produs.cantitate;

        let tr = this.dbRequest.result.transaction(['cumparaturiDB'], 'readwrite');
        let salvare = tr.objectStore('cumparaturiDB');
        salvare.add(produs); 
    }
}

function alegere_mod_salvare() {
    var tip_stocare = document.getElementById("salvare").value;
    if (tip_stocare  === 'localStorage') {
        return new salvare_localStorage();
    } else if (tip_stocare  === 'IndexDB') {
        return new salvare_indexedDB();
    }
}
 

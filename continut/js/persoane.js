function incarcaPersoane(){
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function(){
        if(xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            afiseazaTabel(this.responseXML)
        }
    };
    xmlhttp.open("GET", "resurse/persoane.xml", true);
    xmlhttp.send()
}

function afiseazaTabel(xml) {
    var tabel = "<table border='1'>";
    tabel += "<tr><th>Nume</th><th>Prenume</th><th>Vârstă</th><th>Adresă</th><th>Educație</th><th>Experiență</th></tr>";
    var persoane = xml.getElementsByTagName("persoana");
    for (var i = 0; i < persoane.length; i++) {
        tabel += "<tr>";
        tabel += "<td>" + persoane[i].getElementsByTagName("nume")[0].childNodes[0].nodeValue + "</td>";
        tabel += "<td>" + persoane[i].getElementsByTagName("prenume")[0].childNodes[0].nodeValue + "</td>";
        tabel += "<td>" + persoane[i].getElementsByTagName("varsta")[0].childNodes[0].nodeValue + "</td>";
        tabel += "<td>" + 
                  persoane[i].getElementsByTagName("adresa")[0].getElementsByTagName("strada")[0].childNodes[0].nodeValue + ", " +
                  persoane[i].getElementsByTagName("adresa")[0].getElementsByTagName("numar")[0].childNodes[0].nodeValue + ", " +
                  persoane[i].getElementsByTagName("adresa")[0].getElementsByTagName("localitate")[0].childNodes[0].nodeValue + ", " +
                  persoane[i].getElementsByTagName("adresa")[0].getElementsByTagName("judet")[0].childNodes[0].nodeValue + ", " +
                  persoane[i].getElementsByTagName("adresa")[0].getElementsByTagName("tara")[0].childNodes[0].nodeValue +
                  "</td>";
        tabel += "<td>" + 
                  persoane[i].getElementsByTagName("educatia")[0].getElementsByTagName("liceu")[0].getElementsByTagName("nume")[0].childNodes[0].nodeValue + ", " +
                  persoane[i].getElementsByTagName("educatia")[0].getElementsByTagName("liceu")[0].getElementsByTagName("profil")[0].childNodes[0].nodeValue + ", " +
                  persoane[i].getElementsByTagName("educatia")[0].getElementsByTagName("facultate")[0].getElementsByTagName("nume")[0].childNodes[0].nodeValue +
                  "</td>";
        tabel += "<td>" + 
                  persoane[i].getElementsByTagName("experienta")[0].getElementsByTagName("companie_nume")[0].getElementsByTagName("nume")[0].childNodes[0].nodeValue + ", " +
                  persoane[i].getElementsByTagName("experienta")[0].getElementsByTagName("companie_nume")[0].getElementsByTagName("perioada")[0].childNodes[0].nodeValue +
                  "</td>";
        tabel += "</tr>";
    }
    tabel += "</table>";
    document.getElementById("tabel-persoane").innerHTML = tabel;
}

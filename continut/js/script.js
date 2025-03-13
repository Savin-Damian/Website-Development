function informatii() {
    data_ora();
    setInterval(data_ora,1000);
    url();
    locatie();
    Browser();
    So();

};

function data_ora() {
    var data = new Date();
    document.getElementById("data_ora").innerHTML = data.toLocaleString();
}

function url()
{
    document.getElementById("url").innerHTML = window.location.href;
}

function locatie() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
      } 
      else { 
        document.getElementById("loc").innerHTML ="Geolocation is not supported by this browser.";
    }
}

function Browser() {
    document.getElementById("browser").innerHTML = window.navigator.appCodeName + window.navigator.appVersion;

}

function So()
{
    document.getElementById("so").innerHTML = navigator.platform;
}
 
function showPosition(position) {
    document.getElementById("loc").innerHTML =
    "Latitude: " + position.coords.latitude + " Longitude: " + position.coords.longitude;
}


var canvas = document.getElementById("canva");
var ctx = canvas.getContext("2d");
var p1= false;
var p =null;

function pozitii_mouse(can, e)
{
    var rect = can.getBoundingClientRect()
    return {
        x:e.clientX - rect.left,
        y:e.clientY- rect.top
    };
}

function desenCanvas(e)
{
    var pos = pozitii_mouse(canvas, event);
    if(p1==false)
    {
        p1=true;
        p=pos;
    }
    else{
        var lungime = pos.x -p.x;
        var inaltime = pos.y -p.y;
        ctx.beginPath(); 
        ctx.rect(p.x,p.y,lungime,inaltime);
        ctx.lineWidth=4;
        ctx.strokeStyle = document.getElementById("stroke").value;
        ctx.stroke();
        ctx.fillStyle = document.getElementById("fill").value;
        ctx.fill();
        p1= false;
        
    }   
}

function inserareLinie() {
    var tabel = document.getElementById('tabel');
    var linie = document.getElementById('linie/coloana').value;
    var culoare = document.getElementById('culoare').value;

    if (linie < 1 || linie >  5) {
        alert("Valoarea liniei trebuie să fie între 1 și 5!");
        return; 
    }

    var nouaLinie = tabel.insertRow(linie);

    for (var i = 0; i < tabel.rows[0].cells.length; i++) {
        var celula = nouaLinie.insertCell(i);
        celula.style.backgroundColor = culoare;
        celula.innerHTML = "Celulă nouă";
    }
}

function inserareColoana() {
    var tabel = document.getElementById('tabel');
    var coloana = document.getElementById('linie/coloana').value;
    var culoare = document.getElementById('culoare').value;

    if(coloana<1 || coloana >4)
    {
        alert("Valoarea coloanei trebuie să fie între 1 și 4!");
        return; 
    }

    for (var i = 0; i < tabel.rows.length; i++) {
        var nouaCelula = tabel.rows[i].insertCell(coloana);
        nouaCelula.style.backgroundColor = culoare;
        nouaCelula.innerHTML = "Celulă nouă";
    }
}

window.addEventListener('scroll', function() {
    var menu = document.getElementById('menu');
    var scrollPosition = window.scrollY;
    
    if (scrollPosition > 100) {  
        menu.style.position = 'fixed';
        menu.style.top = '0';
        menu.style.left = '0';
        menu.style.right = '0'; 
    } else { 
        menu.style.position = 'relative';
        menu.style.top = 'auto';
        menu.style.left = 'auto';
        menu.style.right = 'auto';
    } 
    
});


function schimbaContinut(resursa,jsFisier, jsFunctie) {
    var xhttp = new XMLHttpRequest();    
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            document.getElementById("continut").innerHTML = this.responseText;
            
            const animation = document.querySelector('.animation');
            animation.classList.remove('start-acasa', 'start-despre', 'start-inregistreaza', 'start-video', 'start-desen', 'start-invat', 'start-persoane', 'start-verifica', 'start-cumparaturi');
            animation.classList.add('start-' + resursa);
            if (jsFisier) {
                    var elementScript = document.createElement('script');
                    elementScript.onload = function () {
                        console.log("hello");
                        if (jsFunctie) {
                            window[jsFunctie]();
                        }
                    };
                    elementScript.src = jsFisier;
                    document.head.appendChild(elementScript);
                } else {
                    if (jsFunctie) {
                        window[jsFunctie]();
                    }
                }
        }
    }
    xhttp.open("GET", resursa + ".html", true);
    xhttp.send();
}



function validare(){
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function(){
        if(xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            let user=document.getElementById("user").value;
            let password=document.getElementById("password").value;
            var obiect = JSON.parse(xmlhttp.responseText);
            var contor=0;
            for(var i=0;i<obiect.length;i++){
                if(obiect[i].utilizator == user && obiect[i].parola == password){
                    var x=document.getElementById("valid");
                    x.value="true";
                    x.style.backgroundColor="green";
                    contor=1;
                    break
                }
            }
            if(contor==0){
                var x=document.getElementById("valid");
                x.value="false";
                x.style.backgroundColor="red";
            }
        }
    };
    xmlhttp.open("GET", "resurse/utilizatori.json", true);
    xmlhttp.send()
}

function inregistreaza(){
    var obiect = {};
    var data;
    var nume_user= document.getElementById("uname").value;
    var parola = document.getElementById("password").value;
    
    var xhttp = new XMLHttpRequest();
   
    obiect['utilizator'] = nume_user;
    obiect['parola'] = parola;
        
    data = JSON.stringify(obiect)
  
    xhttp.open("POST", "/api/utilizatori", true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send(data);
}





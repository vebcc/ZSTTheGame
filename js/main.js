//Tablice odwołujące do canvas
const c = document.querySelector("canvas");
const ctx = c.getContext("2d");

//ustawianie wielkosci canvas
c.width = 1000;
c.height = 700;
const cw = c.width;
const ch = c.height;

const ma = 50; //piksele o ile porusza sie gracz na krok;   Pole[20/14]
const ps = 1; //ilosc krokow na raz playera;
const pk = 5; //na ile przejsc ma byc podzielony 1 krok.
const tpk = 10; //czas na 1 klatke przejscia gracza // tpk*pk daje laczny czas 1 pelnego kroku gracza

const wait = 100; // czas ktory czeka po zaladowaniu obrazkow a przed uruchomieniem funkcji main();

const fps = 30; //ilosc fpsow

const deflvl = 1; // Lvl ktory rozpoczyna sie po zaladowaniu gry

//pozycja dialogow wzgledem postaci
const dialx = 20;
const dialy = -30;

const dialfont = "15px Comic Sans MS"; // wielkosc oraz czcionka dialogow
const dialcol = "white"; // kolor kwadratu pod dialogiem
const dialtcol = "black"; // kolor tekst'u dialogu

const dialpx = 8 //pixele na literke (do wyswietlania kwadratu pod dialogiem)

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// tablica przechowywuje nazwy zdjec do wczytania
const imgNames = [
    'steve.png',
    'creeper.png',

    'jacek.jpg',
    'kuba.jpg',
    'maslo.jpg',
    'samuel.jpg',
    'jacek.jpg',

    'menu.png',
    'kornel.png',
    'kornel.png',
    'kornel.png',
    'kornel.png',

    'szafa.png'
];

//NOTE Jacek musi zrobic jakas ladna mapke kornela
//NOTE Trzeba zrobic jakies scenariusze!
// tablica przechowywujaca nazwy cial postaci (body)
// nazwa ciala (body) // x, y wielkosc ciala // przesuniecie ciala od lewej
const body = [["steve", 50, 50, 0],
              ["creeper", 30, 50, 10]];

// tablica przechowywujaca dane postaci
// nazwa postaci // nazwa ciala(body) // x, y wielkosc glowy // xt, yt przesuniecie glowy postaci wzgledem body
const persons =[["Jacek" , "steve", 30, 30, 10, -17],
                ["Kornel" , "creeper", 30, 30, 10, -15],
                ["Dyrektor" , "steve", 30, 30, 10, -17],
				["Lampert" , "steve", 30, 30, 10, -17],
				["Olek" , "steve", 30, 30, 10, -17]];

// tablica przechowywujaca levele
// nr lvl // tytul lvl'a // glowny bohater // x, y defaultowy postaci(2) // w, n, e, s granice mapy
const level = [[0, "Menu", "Jacek", 6, 5, 1, 2, 1, 2],
               [1, "Szkolni palacze", "Dyrektor", 6, 6, 4, 3, 1, 3],
               [2, "Jedynkowy challenge", "Kornel",2,2, 0, 0, 0, 0],
               [3, "Dziecko choc do tablicy", "Lampert",2,2, 0, 0, 0, 0],
               [4, "Usprawiedliwiam godziny", "Olek",2,2, 0, 0, 0, 0]];

// nazwa // x,y wielkosc przedmiotu // przesuniecie od dolu
const obiekty = [["szafa", 50, 80, 25]]; // przechowywuje nazwy i wymiary zdjec przedmiotow

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// tablica przechoywujaca postacie w lvlach wraz z defaultowa pozycja
// nazwa postaci // x, y pozycja postaci
const dmapchamp = [[], // lvl )

                [["Kornel", 18,3], // LVL 1
                 ["Jacek", 7, 6],
                 ["Lampert", 13, 6],
                 ["Olek", 15, 7]],

                [["Dyrektor", 12, 12], // LVL 2/
                 ["Lampert", 4, 3]]];

// tablica przechowywuje obiekty w danych lvl'ach
// nazwa/x/y/funkcja przedmiotu
// Funkcje:
// 1-Obiekt przesuwany przez gracza
const dmapobj = [[],
                [["szafa", 6, 8, 1]]];

// tablica przechowywujaca scenariusz gry
// nazwa postaci ktora mowi // tekst ktory mowi // czas wysw tekstu // postac na ktora ruch reaguje // miejsce postaci gdzie reaguje x,y // postac ktora przenosi // x,y gdzie przenosi
// dialogi moga sie wyswietlac tylko nad postaciami glownymi i pobocznymi
// na zdarzenia moga reagowac takze obiekty (przedmioty)

// FUTURE: stworzyc funkcje ktora animuje powolne przejscie obiektow
// TODO: stworzyc pare akcji wiecej by lepiej pokazac logike
const scenariusz =[[],
                   [["Dyrektor", "Przynieślismy panu szafę!", 2000, "szafa", 6, 5, "Kornel", "N", 9],
                    ["Kornel", "Co jaka szafę?!", 2000, "Kornel", 18, 8, "Kornel", 11, "N"],
                    ["Lampert", "Fajnie jest 3", 2000, "Dyrektor", 15, 9, "Dyrektor", "N", "N"]]];

// tablica przechowywujaca zdarzenia [lvl][y][x]
// "ta" - stol - brak mozliwosci wejscia na niego
// "l00" - przejscie do konkretnego lvl'a z funkcja setlvl() - "l" nie moze byc wykorzystywane w 1 literze innych zdarzen
const zdarzenia =[[[0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   ], // menu
                   [0   ,"l01", 0   ,"l02", 0   ,"l03", 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   ],
                   [0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , "ta", "ta", 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   ],
                   [0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   ,"l01","l01", 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   ],
                   [0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   ],
                   [0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   ],
                   [0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   ],
                   [0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   ],
                   [0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   ],
                   [0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   ],
                   [0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   ],
                   [0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   ],
                   [0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   ],
                   [0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   ]],

                  [[0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   ], // LVL 1 sala Kornel'a
                   [0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   ],
                   [0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   ],
                   [0   , 0   , 0   , 0   , "ta", "ta", "ta", "ta", "ta", "ta", "ta", "ta", "ta", "ta", "ta", "ta", "ta", 0   , 0   , 0   ],
                   [0   , 0   , 0   , 0   , "ta", 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , "ta", "ta", 0   , 0   ],
                   [0   , 0   , 0   , 0   , "ta", 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   ],
                   [0   , 0   , 0   , 0   , "ta", 0   , 0   , 0   , "ta", 0   , "ta", 0   , "ta", 0   , "ta", 0   , "ta", 0   , 0   , 0   ],
                   [0   , 0   , 0   , 0   , "ta", 0   , 0   , 0   , "ta", 0   , "ta", 0   , "ta", 0   , "ta", 0   , "ta", 0   , 0   , 0   ],
                   [0   , 0   , 0   , 0   , "ta", 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   ],
                   [0   , 0   , 0   , 0   , "ta", 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   ],
                   [0   , 0   , 0   , 0   , 0   , 0   , 0   , "ta", "ta", "ta", "ta", "ta", "ta", "ta", "ta", "ta", "ta", 0   , 0   , 0   ],
                   [0   , 0   , 0   , 0   , 0   , 0   ,"l00", 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   ],
                   [0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   ],
                   [0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   ]],

                  [[0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   ],
                   [0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   ],
                   [0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   ],
                   [0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   ],
                   [0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   ],
                   [0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   ],
                   [0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   ],
                   [0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   ],
                   [0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   ],
                   [0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   ],
                   [0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   ],
                   [0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   ],
                   [0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   ],
                   [0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   , 0   ]]];

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//pozycja glownej postaci
var chx=0;
var chy=0;

var krok = 0; //nie pozwala ruszyc sie graczowi do momentu az skonczy sie krok (zapobiega stackowaniu sie krokow)

var alvl = 0; // aktualny lvl

var ifact = 0 // dlugosc scenariusza w danym lvl'u

var akcja = 0; // aktualna oczekujaca akcja scenariusza

var dtext = 0; // decyduje o wyswietlaniu dialogu zdarzenia

var nextop = 0; //przechowywuje informacje ile zdjec zostało przetworzonych przez poprzednai funckje informujac kolejna od ktorej ma zaczac.

var ob = new Array; // tablica przechowywujaca obiekty typu szafa

var bd = new Array; // tablica przechowywujaca zdjecia body

var pp = new Array; // tablica przechowywujaca obiekty postaci

var lvl = new Array; // tablica przechowywujaca obiekty lvl'i

var pchamp = new Array; // tablica przechowywuajca kolejno nazwy postaci na aktualnym lvl'u wzgledem mapchamp

var mapchamp = new Array; // tablica przechowywuje polozenie postaci

var mapobj = new Array; // tablica przechowywuje polozenie przedmiotow i ich typ

// tablice przechowywuja polozenie przedmiotow na mapie do zdarzen                   //nie aktualizuje sie // tylko po setlvl do poprawki!
var zdrx = new Array(5);
var zdry = new Array(5);

var images = []; //tablica będzie zawierała obiekty Image

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//////////////////////////////
/// Funkcja Ładowania Gry ///
/////////////////////////////

function loading(){
    //tablica z nazwami obrazków do załadowania
    var loaded = 0;
    var howLoaded = 0; //ile obiektów Images już załadowano do pamięci
    var loadingStep = (100 / imgNames.length); //szerokość oznaczająca % paska po załadowaniu 1 obrazka
    var loadingBarBg = null; //zmienna pod którą utworzymy dynamicznie div zawierającego div-pasek postępu
    var loadingBar = null; //zmienna pod którą utworzymy dynamicznie div-pasek postępu

    //funkcja odpalana dla każdego obiektu Image, które wcześniej stworzyliśmy.
    //Sprawdza ile obiektów zostało załadowanych i ustawia odpowiednią szerokość paska.
    function setLoadingBar() {
        howLoaded++;
        loadingBar.style.width = howLoaded * loadingStep + "%"; //zmianiamy szerokość paska (podaną w %)

        if (howLoaded >= imgNames.length) {
            setTimeout(function() {
                main(); // po zaladowaniu wszystkich obrazkow i uplywie deklarowanego czasu uruchamia glowna funkcje main
            }, wait);
        }
    }

    //funkcja rozpoczynająca ładowanie obrazków
    function startLoading() {
        var div = document.querySelector('#progressCnt');

        loadingBarBg = document.createElement('div');
        loadingBarBg.className = 'loading-bg';    //dzięki temu skorzystamy ze zdefiniowanych styli

        loadingBar = document.createElement('div');
        loadingBar.className = 'progress';

        loadingBarBg.appendChild(loadingBar);

        div.appendChild(loadingBarBg);

        for (var x=0; x<imgNames.length; x++) { //pętla po nazwach obrazków...
            images[x] = new Image();
            images[x].onload = setLoadingBar;    //dla każdego obiektu ustawiamy zdarzenie onload
            images[x].src = "img/"+imgNames[x];
        }
    }

    document.addEventListener("DOMContentLoaded", function(event) {
        startLoading();
    });
}

//////////////////////////////
///// TWORZENIE POSTACI /////
/////////////////////////////

function newPerson(name, head, body, nex, hx, hy, xt, xy) {
    this.name = name;
    this.body = body;

    // wyswietlanie postaci (head + body)
    this.draw = function(x,y){
        ctx.drawImage(bd[body][0], x*ma+bd[body][3], y*ma, bd[body][1], bd[body][2]);
        ctx.drawImage(images[head+nex], x*ma+xt, y*ma+xy, hx, hy);
    }
}

//////////////////////////////
///// TWORZENIE LEVELI //////
/////////////////////////////

function newLevel(nr, nm, champ, x, y, bg, w, n, e, s, nex) {
    this.nr = nr;
    this.nm = nm;
    this.champ = champ;

    this.max = [w,n,e,s];

    // Defaultowa pozycja gracza na mapie
    this.x = x;
    this.y = y;

    // wyswietlanie tla lvl'a
    this.drawbg = function(){
        ctx.drawImage(images[bg+nex], 0,0);
    }
}

//////////////////////////////
//// Rysowanie lini krat ////  // PS. gowno nie funkcja. tworzy gre z wymaganiami niczym GTA V
/////////////////////////////

function drawGrid(){
    for(i=0;i<=cw;i+=ma){
        ctx.moveTo(i,0);
        ctx.lineTo(i,ch);
        ctx.strokeStyle = "#fff";
        ctx.stroke();
    }
    for(i=0;i<=ch;i+=ma){
        ctx.moveTo(0,i);
        ctx.lineTo(cw,i);
        ctx.strokeStyle = "#fff";
        ctx.stroke();
    }
}

//////////////////////////////
/// Aktualna kratka akcji ///
/////////////////////////////

function drawwhereaction(){
    if(ifact>0){ // czy lvl ma scenariusz
        ctx.strokeStyle="#00FFFF"; //aqua
        ctx.strokeRect(scenariusz[alvl][akcja][4]*ma,scenariusz[alvl][akcja][5]*ma,ma,ma);
    }
}

//////////////////////////////
//// Wykrywanie buttonow ////
/////////////////////////////

document.addEventListener('keydown', function(event) {
    if(krok==0){
        let zd;
        switch(event.keyCode){
            case 37: //Left
                    zd = zdarzenia[alvl][chy][chx-1];
                    if(zd==0){ // Kiedy brak zdarzenia tablicowego
                        if(chx>lvl["l"+alvl].max[0]){ // zdarzenie wyjscia za mape
                            if(pitem(-ps,0)){ //przesuwane przedmiotu i sprawdzanie czy przedmiot moze sie poruszyc w danym kierunku
                                perkrok(-ps,0);
                            }
                        }
                    }else if(zd.charAt(0)== "l"){
                        if(dtext==0){
                            let nr = parseInt(zd.substring(1,3));
                            setlvl(nr);
                        }
                    }
                break;
            case 38: //Up
                    zd = zdarzenia[alvl][chy-1][chx];
                    if(zd==0){ // Kiedy brak zdarzenia tablicowego
                        if(chy>lvl["l"+alvl].max[1]){ // zdarzenie wyjscia za mape
                            if(pitem(0,-ps)){ //przesuwane przedmiotu i sprawdzanie czy przedmiot moze sie poruszyc w danym kierunku
                                perkrok(0,-ps);
                            }
                        }
                    }else if(zd.charAt(0)== "l"){
                        if(dtext==0){
                            let nr = parseInt(zd.substring(1,3));
                            setlvl(nr);
                        }
                    }
                break;
            case 39: //Right
                    zd = zdarzenia[alvl][chy][chx+1];
                    if(zd==0){ // Kiedy brak zdarzenia tablicowego
                        if(chx+1<cw/ma-(lvl["l"+alvl].max[2])){ // zdarzenie wyjscia za mape
                            if(pitem(ps,0)){ //przesuwane przedmiotu i sprawdzanie czy przedmiot moze sie poruszyc w danym kierunku
                                perkrok(ps,0);
                            }
                        }
                    }else if(zd.charAt(0)== "l"){
                        if(dtext==0){
                            let nr = parseInt(zd.substring(1,3));
                            setlvl(nr);
                        }
                    }
                break;
            case 40: //Down
                    zd = zdarzenia[alvl][chy+1][chx];
                    if(zd==0){ // Kiedy brak zdarzenia tablicowego
                        if(chy+1<ch/ma-(lvl["l"+alvl].max[3])){ // zdarzenie wyjscia za mape
                            if(pitem(0,ps)){ //przesuwane przedmiotu i sprawdzanie czy przedmiot moze sie poruszyc w danym kierunku
                                perkrok(0,ps);
                            }
                        }
                    }else if(zd.charAt(0)== "l"){
                        if(dtext==0){
                            let nr = parseInt(zd.substring(1,3));
                            setlvl(nr);
                        }
                    }
                break;
        }
    }
});

//////////////////////////////
/// Ruch gracza / Animcja ///
/////////////////////////////

function perkrok(x, y){
    krok=1;
    let tpx = x/pk;
    let tpy = y/pk;
    for(i=1;i<=pk;i++){
        let tem = i;
        setTimeout(function(){
            chx+=tpx;
            chy+=tpy;
            if(tem==pk){
                chx = Math.round(chx);
                chy = Math.round(chy);
                krok = 0;
            }
        }, tpk*i);
    }
}

//////////////////////////////
// Ruch pobocznej postaci ///
/////////////////////////////

function charkrok(x, y){
    let tpx = x/pk;
    let tpy = y/pk;
    for(i=1;i<=pk;i++){
        let tem = i;
        setTimeout(function(){
            mapchamp[pchamp[scenariusz[alvl][akcja][6]]][1]+=tpx;
            mapchamp[pchamp[scenariusz[alvl][akcja][6]]][2]+=tpy;
            if(tem==pk){
                mapchamp[pchamp[scenariusz[alvl][akcja][6]]][1] = Math.round(mapchamp[pchamp[scenariusz[alvl][akcja][6]]][1]);
                mapchamp[pchamp[scenariusz[alvl][akcja][6]]][2] = Math.round(mapchamp[pchamp[scenariusz[alvl][akcja][6]]][2]);
            }
        }, tpk*i);
    }
}

//////////////////////////////
/////// Przebieg gry ////////
/////////////////////////////

function przebieggry(){
     if(ifact>0){ // czy lvl ma scenariusz
        if(level[alvl][2]==scenariusz[alvl][akcja][3]){ // czy akcja dotyczy glownej postaci czy pobocznych
            if(chx==scenariusz[alvl][akcja][4] && chy==scenariusz[alvl][akcja][5]){ //czy glowna postac znajduje sie na polu zdarzenia
                if(dtext==0){ //jezeli tekst sie nie wyswietla
                    dtext=1; // ustaw na wyswietlanie
                    setTimeout(function(){dtext=0; akcja++}, scenariusz[alvl][akcja][2]); // ustawia po jakim czasie ma sie przestac wyswietlac tekst
                    eventmove();
                }
            }
        }else{
            let cont=0;
            for(i=0;i<mapobj.length;i++){
                if(mapobj[i][0]==scenariusz[alvl][akcja][3]){ // czy ten obiekt jest do tej akcji
                    if(mapobj[i][1]==scenariusz[alvl][akcja][4] && mapobj[i][2]==scenariusz[alvl][akcja][5]){ //czy obiekt znajduej sie na polu zdarzenia
                        if(dtext==0){ //jezeli tekst sie nie wyswietla
                            dtext=1; // ustaw na wyswietlanie
                            setTimeout(function(){dtext=0; akcja++}, scenariusz[alvl][akcja][2]); // ustawia po jakim czasie ma sie przestac wyswietlac tekst
                            eventmove();
                        }
                    }
                    cont = 1;
                }
            }
            if(cont!=1){
                let obc = pchamp[scenariusz[alvl][akcja][3]]; // pobiera id postaci ktorej szuka do zdarzenia
                let obcx = mapchamp[obc][1]; // pobiera x postaci
                let obcy = mapchamp[obc][2]; // pobiera y postaci

                if(obcx==scenariusz[alvl][akcja][4] && obcy==scenariusz[alvl][akcja][5]){ // czy dana poboczna postac znajduje sie na polu zdarzenia
                    if(dtext==0){ //jezeli tekst sie nie wyswietla
                        dtext=1; // ustaw na wyswietlanie
                        setTimeout(function(){dtext=0; akcja++}, scenariusz[alvl][akcja][2]); // ustawia po jakim czasie ma sie przestac wyswietlac tekst
                        eventmove();
                    }
                }
            }
        }
    }
}

//////////////////////////////
/// Przesuwanie z zdarzen ///
/////////////////////////////

function eventmove(){
    let achamp = scenariusz[alvl][akcja][6]; // nazwa postaci ktora ma przeniesc
    if(achamp!="N"){ // jezeli jest zadeklarowana postac
        let ile, obcx, obcy, glowny; // ile krokow musi zrobic postac
        // przechowywuje w ktora strone porusza sie bohater
        let onex = 0;
        let oney = 0;
        let box = scenariusz[alvl][akcja][7]; // x gdzie ma przeniesc gracza
        let boy = scenariusz[alvl][akcja][8] // y gdzie ma przeniesc gracza
        if(level[alvl][2]==achamp){ // jezeli postac jest glownym bohaterem
            obcx = chx;
            obcy = chy;
            glowny = true;
        }else{
            obc = pchamp[achamp]; // pobiera id postaci ktorej szuka do zdarzenia
            obcx = mapchamp[obc][1]; // pobiera x postaci
            obcy = mapchamp[obc][2]; // pobiera y postaci
            glowny = false;
        }
        if(boy=="N"){ // Czy porusza sie po osi x
            if(obcx>box){ // czy porusza sie w lewo czy w prawo
                ile = obcx-box
                onex = -1;
            }else{
                ile = box-obcx
                onex = 1;
            }
        }else{
            if(obcy>boy){ // czy porusza sie w w gore czy w dol
                ile = obcy-boy
                oney = -1;
            }else{
                ile = boy-obcy
                oney = 1;
            }
        }
        for(ti=1;ti<=ile;ti++){ // wykonuje sie tyle razy ile jest krokow
            if(glowny){
                setTimeout(perkrok(onex, oney), tpk*pk*ti); // pojedynczy krok glownego bohatera
            }else{
                setTimeout(charkrok(onex, oney), tpk*pk*ti); // pojedynczy krok pobocznego bohatera
            }
        }
    }
}

//////////////////////////////
// Przesuwanie przedmiotow //
/////////////////////////////

function pitem(x,y){
    for(i=0;i<mapobj.length;i++){
        if(mapobj[i][3]==1){ //sprawdzanie czy dany przedmiot powinien sie poruszyc
            if(chx+x==mapobj[i][1] && chy+y==mapobj[i][2]){ //sprawdzanie czy grasz wszedl na przedmiot
                let zd = zdarzenia[alvl][mapobj[i][2]+y][mapobj[i][1]+x];
                if(zd!="ta"){ // zdarzenia tablicowe
                    //przesuniecie przedmiotu w odpowiednim kierunku
                    mapobj[i][1]+=x;
                    mapobj[i][2]+=y;
                }else{
                    return false; // zabrania przesuniecia sie bohaterowi
                }
            }
        }
    }
    return true; // zezwala bohaterowi na przesuniecie sie
}

//////////////////////////////
/// Wyswietlanie tekstu /////
/////////////////////////////

function drawtext(){
    if(ifact>0){ // czy lvl ma scenariusz
        if(dtext==1){ // czy tekst ma sie wyswielac
            ctx.font = dialfont;
            ctx.textAlign = "center";
            ctx.fillStyle = dialcol;
            let bgdialx = scenariusz[alvl][akcja][1].length*dialpx/2 //sprawdza dlugosc tekstu mnozy razy dialpx by odpowiednio wyswietlic tlo pod tekstem
            //console.log(bgdialx);

            if(level[alvl][2]==scenariusz[alvl][akcja][0]){ // czy tekst wyswietla sie nad glowna postacia czy pobocznymi
                ctx.fillRect(chx*ma+dialx-bgdialx, chy*ma-17+dialy, bgdialx*2, 23); // wyswietlanie tla dialogu
                ctx.fillStyle = dialtcol;
                ctx.fillText(scenariusz[alvl][akcja][1], chx*ma+dialx, chy*ma+dialy);  // wyswietlanie tekstu dialogu
            }else{
                let obc = pchamp[scenariusz[alvl][akcja][0]]; // pobiera id postaci ktorej szuka do zdarzenia
                let obcx = mapchamp[obc][1]; // pobiera x postaci
                let obcy = mapchamp[obc][2]; // pobiera y postaci

                ctx.fillRect(obcx*ma+dialx-bgdialx, obcy*ma-17+dialy, bgdialx*2, 23); // wyswietlanie tla dialogu
                ctx.fillStyle = dialtcol;
                ctx.fillText(scenariusz[alvl][akcja][1], obcx*ma+dialx, obcy*ma+dialy);  // wyswietlanie tekstu dialogu
            }
        }
    }
}

//////////////////////////////
/// Wyswietlanie postaci /////
/////////////////////////////

function drawcharacters(){
    for(i=0;i<mapchamp.length;i++){
        pp[mapchamp[i][0]].draw(mapchamp[i][1],mapchamp[i][2]);
        pchamp[mapchamp[i][0]] = i;
    }
}

//////////////////////////////
// Wyswietlanie przedmiotow //
/////////////////////////////

function drawobjects(){
    for(i=0;i<mapobj.length;i++){
        ctx.drawImage(ob[mapobj[i][0]][0], mapobj[i][1]*ma, (mapobj[i][2]*ma)-ob[mapobj[i][0]][3], ob[mapobj[i][0]][1],ob[mapobj[i][0]][2]);

    }
}

//////////////////////////////
// Generowanie i reset obj //
/////////////////////////////

function refobj(){
    mapobj = [];
    for(fi=0;fi<dmapobj[alvl].length;fi++){
        mapobj[fi] = [dmapobj[alvl][fi][0], dmapobj[alvl][fi][1], dmapobj[alvl][fi][2], dmapobj[alvl][fi][3]];
    }
    mapchamp = [];
    for(fi=0;fi<dmapchamp[alvl].length;fi++){
        mapchamp[fi] = [dmapchamp[alvl][fi][0], dmapchamp[alvl][fi][1], dmapchamp[alvl][fi][2]];
    }
}

//////////////////////////////
///// Ustawianie levela /////
/////////////////////////////

function setlvl(nr){
    alvl = nr;
    chx = lvl["l"+alvl].x;
    chy = lvl["l"+alvl].y;

    refobj();

    ifact = scenariusz[alvl].length;

    krok = 0;
    akcja = 0;
    dtext = 0;

    for(i=0;i<mapobj.length;i++){
        zdrx[i] = mapobj[i][1];
        zdry[i] = mapobj[i][2];
    }
}

//////////////////////////////
/// Funkcja po zaladowaniu ///
/////////////////////////////

function main(){

    for(i=0;i<body.length;i++){
        bd[body[i][0]] = [images[i], body[i][1], body[i][2], body[i][3]];
        nextop++;
    }
    var nextw = nextop;
    // petla generujaca obiekty pp (Person)
    for(i=0;i<persons.length;i++){
        pp[persons[i][0]] = new newPerson(persons[i][0], i, persons[i][1], nextw, persons[i][2], persons[i][3], persons[i][4], persons[i][5]);
        nextop++;
    }
    nextw = nextop;
    //Petla generujaca levele w tablicy lvl
    for(i=0;i<level.length;i++){
        lvl["l"+level[i][0]] = new newLevel(level[i][0], level[i][1], pp[level[i][2]], level[i][3], level[i][4], i, level[i][5], level[i][6], level[i][7], level[i][8], nextw);
        nextop++;
    }
    nextw = nextop;
    // petla generujaca obiekty przedmiotow
    for(i=0;i<obiekty.length;i++){
        ob[obiekty[i][0]] = [images[i+nextw], obiekty[i][1], obiekty[i][2], obiekty[i][3]];
        nextop++;
    }

    setlvl(deflvl);

    setInterval(loop, 1000/fps);
}

//////////////////////////////
//// Głowna funkcja loop /////
/////////////////////////////

function loop(){
    lvl["l"+alvl].drawbg(); // wyswietla mape
    drawwhereaction() // zaznacza kratke gdzie oczekuje na akcje
    drawcharacters(); // wyswietla postacie
    drawobjects(); // wyswietlanie przedmiotow
    lvl["l"+alvl].champ.draw(chx, chy); // wyswietla glowna postac
    drawtext(); // wyswietlanie tekstu - dialogow
    przebieggry(); // sprawdzanie przebiegu scenariusza
}

loading(); // wywolanie funkcji ladowania obrazkow

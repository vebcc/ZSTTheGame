var images = []; //tablica będzie zawierała obiekty Image

//Funkcja generująca pasek ładowania i ładowanie
function loading(){
    //tablica z nazwami obrazków do załadowania
    var imgNames = [
        'jacek.jpg',
        'kuba.jpg',
        'maslo.jpg',
        'samuel.jpg'
    ];
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
                alert("Udało się!");
            }, 100);
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

loading();

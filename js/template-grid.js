var templateGrid = document.getElementById("template_frame");
var template_button = document.getElementById("template_button");
templateGrid.width = 0;
templateGrid.height = 0;

template_button.onclick = function (event) {
    templateGrid.width = window.innerWidth - 10;
    templateGrid.height = window.innerHeight- 10;
};

function closeWin () {
    templateGrid.width = 0;
    templateGrid.height = 0;
}

document.onkeyup = function (e){
    if(e.keyCode == 27){
        templateGrid.width = 0;
        templateGrid.height = 0;
    }
}

document.onmouse = function (e){
    if(e.keyCode == 27){
        templateGrid.width = 0;
        templateGrid.height = 0;
    }
}

document.onclick = function (e) { 
    var x = event.clientX, y = event.clientY,
    elementMouseIsOver = document.elementFromPoint(x, y);
    
    if(elementMouseIsOver.id == "template_frame"){

    }
    else{
        templateGrid.width = 0;
        templateGrid.height = 0;
    }

}

//Template is Choosen
function setStandardTemplate(url){
    templateGrid.width = 0;
    templateGrid.height = 0;
    templateChoosen(url);
}


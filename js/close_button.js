document.onclick = function (e) { 
    var x = event.clientX, y = event.clientY,
    elementMouseIsOver = document.elementFromPoint(x, y);
    if(elementMouseIsOver.className == "templateClip"){
        window.parent.setStandardTemplate(elementMouseIsOver.src);
        
    }   
}
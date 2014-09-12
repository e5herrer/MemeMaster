//Binding upload_button
var fileInput = document.getElementById('upload_img');
var canvasIsPainted = 0; //flag to not draw text when img not set
//  Grab the image
var img = document.getElementById('uploaded-img');

//Meme Title
var titleText = document.getElementById('title-text');

//Download Img
var downloadImage = document.getElementById('downloadImg');
function prepareDownload() {
    if(canvasIsPainted == 1){
        downloadImage.download = titleText.value; //setting download title
        downloadImage.href = canvas.toDataURL(); //canvs.toDataURL
    }
    else{
        alert("Please select an image first");
    }
}
downloadImage.addEventListener('click', prepareDownload, false);

//save Img currenlty hardcoded to index change later
var saveButton = document.getElementById('saveImg');
function saveImage() {
    if(canvasIsPainted == 1){
        var imageObject = canvas.toDataURL(); //canvs.toDataURL
        var ref = new Firebase('http://blinding-fire-4174.firebaseio.com').child('myimgs');
        ref.push({ folder: "index", src: imageObject, name: titleText.value, rating: 0}, 
                 function(error){ 
                     if(error){
                         alert("Failed to connect to server");
                     } else{ 
                        alert("Image saved sucessfully");
                     }
                 });
    }
    else{
        alert("Please select an image first");
    }
}
saveButton.addEventListener('click', saveImage, false);

//paint img from selected file
fileInput.onchange = function (event) {
    var fileList = fileInput.files;
    var reader = new window.FileReader();
    reader.onload = function (event) {
        img.onload = function () {
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            canvasIsPainted = 1;
        };
        img.src = reader.result;
    };
    reader.readAsDataURL(fileList[0]);
}

//Seting up Canvas Dimensions
var canvas = document.getElementById('memecanvas');
var ctx = canvas.getContext('2d');
var deviceWidth = window.innerWidth;
var canvasWidth = Math.min(600, deviceWidth - 20);
var canvasHeight = Math.min(600, deviceWidth - 20);

// Top text format
var topText;
topTextSection = document.getElementById('top-text');
topText = topTextSection.value;
topText.font = '40pt Impact';
topText.maxWidth = canvas.width * .9;
topText.toUpperCase;

//Bottom Text format
var bottomText;
bottomTextSection = document.getElementById('bottom-text');
bottomText = topTextSection.value;
bottomText.font = '35pt Impact';
bottomText.maxWidth = canvas.width * .9;
bottomText.toUpperCase;

//Handlers needed for copy and pasting text into field
topTextSection.onchange = function (event) {
    topText = topTextSection.value;
    rePaint();
}

bottomTextSection.onchange = function (event) {
    bottomText = bottomTextSection.value;
    rePaint();
}

//Handles typing and painting letters
topTextSection.onkeyup = function (event) {
    topText = topTextSection.value;
    rePaint();
}

bottomTextSection.onkeyup = function (event) {
    bottomText = bottomTextSection.value;
    rePaint();
}

//Repaint Canvas
function rePaint (){
    if(canvasIsPainted == 1){
        canvas.style.height = canvas.clientWidth*(img.height/img.width) + "px";
        canvas.height = canvas.clientWidth*(img.height/img.width);
        canvas.width = canvas.clientWidth;
        
        // Canvas Text Style have to reset because when resized properties are dropped
        ctx.strokeStyle = 'black';
        ctx.fillStyle = 'white';
        ctx.textAlign = 'center';
        ctx.lineWidth = 5;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);  
        x = canvas.width/2;
        y = canvas.height * 3/20;
        ctx.font = '40pt Impact';
        
        var lines = getLines(ctx, topText, canvas.width*.95, "Impact");
        var lineNumber = 0;
        //sets up multiple lines
        lines.forEach( function(entry) {
           ctx.strokeText(entry, x, lineNumber * 50 + y );
            ctx.fillText(entry, x, lineNumber * 50 + y); 
            lineNumber = lineNumber + 1;
        });
        
        var lines = getLines(ctx, bottomText, canvas.width*.95, "Impact");
        var lineNumber = 0;
        
        y = canvas.height * 4/5;
        ctx.font = '30pt Impact';
        
        //sets up multiple lines
        lines.forEach( function(entry) {
           ctx.strokeText(entry, x, lineNumber * 45 + y );
            ctx.fillText(entry, x, lineNumber * 45 + y); 
            lineNumber = lineNumber + 1;
        });
    }
}

//Template is Choosen
function templateChoosen( url ){
    img.src = url;
    canvasIsPainted = 1;
    rePaint();
}


//used to text wrap text
function getLines(ctx, phrase, maxPxLength, textStyle) {
    var wa=phrase.split(" "),
        phraseArray=[],
        lastPhrase=wa[0],
        l=maxPxLength,
        measure=0;
    ctx.font = textStyle;
    for (var i=1;i<wa.length;i++) {
        var w=wa[i];
        measure=ctx.measureText(lastPhrase+w).width;
        if (measure<l) {
            lastPhrase+=(" "+w);
        }else {
            phraseArray.push(lastPhrase);
            lastPhrase=w;
        }
        if (i===wa.length-1) {
            phraseArray.push(lastPhrase);
            break;
        }
    }
    return phraseArray;
}
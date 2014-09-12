
gMeme = {
    fs      : window.requestFileSystem,
    fsurl   : window.webkitResolveFileSystemURL,
    currentTab : null
}


gMeme.allowDrop = function(item) {
    item.preventDefault();
}

gMeme.init = function() {

    gMeme.memeList;
    gMeme.memeCounter = 0;
    gMeme.folder;
    var mainarea = document.getElementById('mainarea');
    var dragAndDropArea = document.getElementById('dragAndDrop');
    var imglist = document.getElementById('imglist');

    dragAndDropArea.addEventListener("drop", function(item) {
        gMeme.drop(item);
    });
    dragAndDropArea.addEventListener("dragover", function(item) {
        gMeme.allowDrop(item);
    });
    // dragAndDropArea.addEventListener("change", function(item) {
    //     gMeme.drop(item);
    // });
    dragAndDropArea.addEventListener('paste', function() {
        setTimeout(gMeme.paste,10);
    });

    gMeme.getImages(gMeme.currentTab);

}

gMeme.drop = function(e) {
    e.preventDefault();
    e.stopPropagation();
    gMeme.getImages(e.dataTransfer.getData("Text"));
}

gMeme.paste = function() {
    var txt = document.getElementById('dragAndDrop').value
    gMeme.getImages(txt)
    document.getElementById('dragAndDrop').value = '';
}

gMeme.getImages = function(e){
    //console.log(encodeURI(e));
    try{
        document.getElementById('nf').remove();
    }catch(e){}
    var url = 'http://ec2-54-191-166-196.us-west-2.compute.amazonaws.com/index.php?murl=' + encodeURI(e);
    $.ajax({
        url: url,
        //dataType: 'html',
        //data: 'murl=' + encodeURI(e),
    })
    .done((function(url){

        return function(data) {
            var segments = url.split('/');
            segments.pop();
            url = segments.join('/');
            url += '/';
   
            var images = [];
            try{
                var images = data.split(",");
                //console.log(images);
            }catch(e){

            }
            var image;
            var imgurls = [];
            for (var i = 0; i < images.length; i++){
                image = images[i];
                if (image.indexOf('http') > -1){
                    imgurls.push(image);
                }
                else{
                    imgurls.push(url+image);
                }
            }
            console.log(imgurls);
            if (imgurls.length > 0){
                console.log(imgurls);
                gMeme.attachImages(imgurls);
            }

    }})(e))
    .fail(function() {
        console.log("error");
    })
    .always(function() {
        console.log("complete");
    });
    
}
gMeme.attachImages = function(imgurls){
    for (var i = 0; i < imgurls.length; i++) {
        var img = document.createElement('img');
        try{
            img.src = imgurls[i];
        }catch(e){}

        var button = document.createElement('button');
        button.innerHTML = "Add Meme";
        button.className = 'imgbutton notMemed';
        button.innerHTML = "Meme me";
        var filename = imgurls[i];
        if (isFavorite(encodeURI(filename))){
            button.innerHTML = "Memed!";
            button.className = 'imgbutton memed';
        }
        button.addEventListener("click", (function(filename, button){
            return function(){
                var meme = encodeURI(filename);
                if (this.saved){
                    return;
                }
                this.saved = true;
                var meme = encodeURI(filename);
                button.innerHTML = "Memed!";
                button.className = 'imgbutton memed';
                uploadImage(meme);

            }
        })(imgurls[i], button));


        var imgdiv = document.createElement('div');
        imgdiv.className = 'imgdiv';
        imgdiv.appendChild(img);
        imgdiv.appendChild(button);


        document.body.appendChild(imgdiv);
        img.onerror = function(){
            this.parentNode.remove();
        }
        setTimeout(function(){
            if(!document.querySelectorAll(".imgdiv").length){
                var nf = document.createElement('h2');
                nf.id = 'nf';
                nf.innerHTML = 'Sorry, no images from this site could be loaded.';
                document.getElementById('mainarea').appendChild(nf);
            }
    }, 1000);
  }
}

function set_cookie(name, value, days) {
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + 30 * 24 * 60 * 60 * 1000); // ) removed
        var expires = "; expires=" + date.toGMTString(); // + added
    } else
        var expires = "";
    document.cookie = name + "=" + value + expires + ";path=/"+ ";domain=" + 'http://cse134-135-2014.github.io/'; // + and " added
}

function get_cookie(cookie_name) {
    var results = document.cookie.match('(^|;) ?' + cookie_name + '=([^;]*)(;|$)');

    if (results)
        return (unescape(results[2]));
    else
        return null;
}

function setAsFavorite(memeID, val) {
    var cookie = get_cookie('favorites');
    try{
        var favorites = cookie.split(',');
    }catch (e){
        favorites = [];
    }
    if (val){
        if(favorites.indexOf(memeID) == -1){ //memeID needs to be added
            favorites.push(''+memeID);
            set_cookie('favorites', favorites.join(','), 120);
        }else{
            //already in as favorite, no problem
        }
    }else{
        //remove favorite
        if(favorites.indexOf(memeID) != -1){ //memeID needs to be removed
            favorites.splice(favorites.indexOf(memeID), 1);
            set_cookie('favorites', favorites.join(','), 120);
        }
    }
}

function isFavorite(memeID) {
    var cookie = get_cookie('favorites');
    try{
        var favorites = cookie.split(',');
    }catch (e){
        favorites = [];
    }
    if (favorites.indexOf(memeID) == -1){
        return false
    }

    return true;
}


document.addEventListener('DOMContentLoaded', function() {
    setTimeout(gMeme.init, 500);

    chrome.tabs.query({active: true, lastFocusedWindow: true}, function(tab) {
    gMeme.currentTab = tab[0].url;
    });
});

function uploadImage(source){
    file = 'index';
    name = source.hashCode();
    rating = 0;
    var ref = new Firebase('http://blinding-fire-4174.firebaseio.com').child('myimgs');

    ref.push( 
        {   file: file,
            src: source,
            name: name,
            rating: rating 
        });
}
String.prototype.hashCode = function() {
  var hash = 0, i, chr, len;
  if (this.length == 0) return hash;
  for (i = 0, len = this.length; i < len; i++) {
    chr   = this.charCodeAt(i);
    hash  = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};
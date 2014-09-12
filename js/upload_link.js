/*
 *  UL_G is the UpLoadGlobal wraper. This will prevent namespae polution.
 */


UL_G = {
    fs      : window.requestFileSystem,
    fsurl   : window.webkitResolveFileSystemURL,
}


UL_G.uploadToggle = function() {
    var ubox = document.getElementById("upload-dialogue-box");
    if (ubox.style.display == "none") {
        ubox.style.display = "block";
    } else {
        ubox.style.display = "none";
        // if (document.URL == 'http://cse134-135-2014.github.io/cse134_group16/home.html#'){
        //     location.reload();
        // }
    }
}

UL_G.allowDrop = function(item) {
    item.preventDefault();
}

UL_G.init = function() {
    
    var box = document.createElement("div");
    box.className = "hover-border top upload-dialogue";
    box.id = "upload-dialogue-box";
    box.style.display = "none";

    var list = document.createElement("ul");
    list.id = "upload-items";
    var li1 = document.createElement("li");
    var li2 = document.createElement("li");
    var ul2 = document.createElement("ul2");
    ul2.id = "dynamicMemeArea";
    li2.appendChild(ul2);
    list.appendChild(li1);
    list.appendChild(li2);


    var urlField = document.createElement("input");
    urlField.type = "text";
    urlField.setAttribute('placeholder',  "Paste URL or drag link here");
    urlField.id = "urlField";


    li1.appendChild(urlField);

    var ortext = document.createElement("span");
    ortext.innerHTML = " -or- ";
    li1.appendChild(ortext);

    var browseButton = document.createElement("input");
    browseButton.className += " rounded";
    browseButton.innerHTML = "Browse";
    browseButton.type = "file";
    browseButton.id='ulbrowsebutton';

    //TODO add eventlistener to browse button on change to upload file
    li1.appendChild(browseButton);
    box.appendChild(list);

    //changed this line because it wasn't working at all changed arg was originally "top"
    document.getElementById("upload_link").appendChild(box);
    document.getElementById("upload_link").onclick = UL_G.uploadToggle;

    UL_G.memeList;
    UL_G.memeCounter = 0;
    UL_G.folder;
    var mainarea = document.getElementById('upload-items');
    //var dragAndDropArea = document.getElementById('urlField');
    //var imglist = document.getElementById('imglist');

    urlField.addEventListener("drop", function(item) {
        UL_G.drop(item);
    });
    urlField.addEventListener("dragover", function(item) {
        UL_G.allowDrop(item);
    });
    // dragAndDropArea.addEventListener("change", function(item) {
    //     UL_G.drop(item);
    // });
    urlField.addEventListener('paste', function() {
        setTimeout(UL_G.paste,10);
    });


}

UL_G.drop = function(e) {
    e.preventDefault();
    e.stopPropagation();
    UL_G.getImages(e.dataTransfer.getData("Text"));
}

UL_G.paste = function() {
    var txt = document.getElementById('urlField').value
    UL_G.getImages(txt)
    document.getElementById('urlField').value = '';
}

UL_G.getImages = function(e){
    //console.log(encodeURI(e));
    try{
        document.getElementById('nf').remove();
    }catch(e){}
    try{
        var divs = document.querySelectorAll(".imgdiv");
        for (var i = 0; i < divs.length; i++){
            div.parentNode.remove();
        }
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
                UL_G.attachImages(imgurls);
            }

    }})(e))
    .fail(function() {
        console.log("error");
    })
    .always(function() {
        console.log("complete");
    });
    
}
UL_G.attachImages = function(imgurls){
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
        // if (isFavorite(encodeURI(filename))){
        //     button.innerHTML = "Memed!";
        //     button.className = 'imgbutton memed';
        // }
        button.addEventListener("click", (function(filename, button){
            return function(){
                if (this.saved){
                    return;
                }
                this.saved = true;
                var meme = encodeURI(filename);
                button.innerHTML = "Memed!";
                button.className = 'imgbutton memed';
                //console.log(meme);
                uploadImage(meme);

                //     setAsFavorite(meme, true);
                //     button.className = "imgbutton memed";

                // if (!isFavorite(meme)){
                //     button.innerHTML = "Memed!";
                //     setAsFavorite(meme, true);
                //     button.className = "imgbutton memed";
                // }else{
                //     button.innerHTML = "Meme me";
                //     button.className = 'imgbutton notMemed';
                //     setAsFavorite(meme, false);
                // }
            }
        })(imgurls[i], button));

        var imgdiv = document.createElement('div');
        imgdiv.className = 'imgdiv';
        imgdiv.appendChild(img);
        imgdiv.appendChild(button);


        document.getElementById("dynamicMemeArea").appendChild(imgdiv);
        img.onerror = function(){
            this.parentNode.remove();
        }
        setTimeout(function(){
            if(!document.querySelectorAll(".imgdiv").length){
                var nf = document.createElement('h2');
                nf.id = 'nf';
                nf.innerHTML = 'Sorry, no images from this site could be loaded.';
                document.getElementById('upload-items').appendChild(nf);
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
UL_G.getJQuery = function() {
    var url = "http://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js";
    var scriptTag = document.createElement("script");
    scriptTag.src = url;

    scriptTag.type = 'text/javascript';
    scriptTag.src = url;

    var head = document.getElementsByTagName('head')[0];
    head.appendChild(scriptTag);
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
function uploadImage(source){
    //console.log('test');
    //console.log(source);
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

UL_G.getJQuery();

document.addEventListener('DOMContentLoaded', function() {
    setTimeout(UL_G.init, 500);

});

var myFirebaseRef = new Firebase('http://blinding-fire-4174.firebaseio.com').child("myimgs");
var fileSystem = document.getElementById("file_system");
var trash = document.getElementById("trash");
var sel = document.getElementById("sel");

sel.onchange = function(){
    clearPage();
    new Firebase('http://blinding-fire-4174.firebaseio.com').child("myimgs").on('child_added', function (snapshot) {
            if(sel.value == 0){
                populate(snapshot);
            }
            else if( sel.value == 1){
                filterByFavorite(snapshot);
            }
            else if( sel.value == 2){
                filterByStars(snapshot, 5);
            }
            else if( sel.value == 3){
                filterByStars(snapshot, 4);                    
            }
            else if( sel.value == 4){
                filterByStars(snapshot, 3);
            }
            else if( sel.value == 5){
                filterByStars(snapshot, 2);
            }
            else if( sel.value == 6){
                filterByStars(snapshot, 1);
            }
            else{
                filterByStars(snapshot, 0);
            }
    });
}



//Function to store WEB image/gif store by url 
function saveImage(file, source, name, rating){
    var ref = new Firebase('http://blinding-fire-4174.firebaseio.com').child('myimgs');

    myFirebaseRef.push( 
        { file: file,
          src: source,
          name: name,
         rating: rating  
         }
    );
}


//deletes selected Img from database
function deleteImage(key){
    var ref = new Firebase('http://blinding-fire-4174.firebaseio.com').child('myimgs');
    ref.child(key).remove(onComplete);    
}

//promts error if trouble with database
var onComplete = function(error) {
  if (error) {
    alert('Failed to process request');
  } else {
    console.log('Requet Complete!');
  }
};

function openFileImages(fileName){
    var ref = new Firebase('http://blinding-fire-4174.firebaseio.com').child('myimgs');
    clearPage();
    ref.on('child_added', function(snap){
        var record = snap.val();
        if(record.file == fileName){
            //append to tree
        }
    });
}

//dropes all the nodes of the filesystem "clears canvas"
function clearPage(){
    while (fileSystem.firstChild) {
        fileSystem.removeChild(fileSystem.firstChild);  
    }
}

//Updates rating of image
function addRating(imageName, rating){
    var ref = new Firebase('http://blinding-fire-4174.firebaseio.com/myimgs');
    ref.on('child_added', function(snap){
        var file = snap.val();
        if(file.name == imageName){
            ref.child(snap.name()).update({rating: rating});
        }
    });
}

//prints all images
myFirebaseRef.on('child_added', function(snapshot){ 
    clearPage();
            if(sel.value == 0){
                populate(snapshot);
            }
            else if( sel.value == 1){
                filterByFavorite(snapshot);
            }
            else if( sel.value == 2){
                filterByStars(snapshot, 5);
            }
            else if( sel.value == 3){
                filterByStars(snapshot, 4);                    
            }
            else if( sel.value == 4){
                filterByStars(snapshot, 3);
            }
            else if( sel.value == 5){
                filterByStars(snapshot, 2);
            }
            else if( sel.value == 6){
                filterByStars(snapshot, 1);
            }
            else{
                filterByStars(snapshot, 0);
            }
});

              
function populate(snapshot){
        //create link
    var record = snapshot.val();
    if(typeof(record.name) != "undefined"){
        var link = document.createElement('a');
        var img = document.createElement('img');
        link.setAttribute('href', 'selectedScreen.html?node=' + snapshot.name()); 
        img.setAttribute('class', 'context-menu-one');
        img.setAttribute('padding', '10px');
        img.setAttribute('node', snapshot.name());
        img.setAttribute('height', '200');
        img.setAttribute('width', '200');
        link.appendChild(img);
        img.setAttribute('src', record.src);
        img.onload = function(){
            document.getElementById("loadScreen").setAttribute('height', '0');
            fileSystem.appendChild(link);
        };
    }
}

var loadScreen = document.getElementById("loadScreen");
loadScreen.setAttribute("display","block");
loadScreen.setAttribute("height",window.innerHeight);
loadScreen.setAttribute("width",innerWidth);
      
function filterByStars(snapshot, rating){
        //create link
    var record = snapshot.val();
    if(typeof(record.name) != "undefined"){
        if(record.rating == rating){
            var link = document.createElement('a');
            var img = document.createElement('img');
            link.setAttribute('href', 'selectedScreen.html?node=' + snapshot.name()); 
            img.setAttribute('class', 'context-menu-one');
            img.setAttribute('height', '200');
            img.setAttribute('width', '200');            
            img.setAttribute('padding', '20px');
            img.setAttribute('node', snapshot.name());
            link.appendChild(img);
            img.setAttribute('src', record.src);
            img.onload = function(){
                document.getElementById("loadScreen").setAttribute('height', '0');
                fileSystem.appendChild(link);
            };
        }
    }
}

function filterByFavorite(snapshot){
        //create link
    var record = snapshot.val();
    if(typeof(record.name) != "undefined"){
        if(record.favorite == 1){
            var link = document.createElement('a');
            var img = document.createElement('img');
            link.setAttribute('href', 'selectedScreen.html?node=' + snapshot.name()); 
            img.setAttribute('class', 'context-menu-one');
        img.setAttribute('height', '200');
        img.setAttribute('width', '200');
            img.setAttribute('padding', '20px');
            img.setAttribute('node', snapshot.name());
            link.appendChild(img);
            img.setAttribute('src', record.src);
            img.onload = function(){
                document.getElementById("loadScreen").setAttribute('height', '0');
                fileSystem.appendChild(link);
            };
        }
    }
}

window.onload = function(){
    if(fileSystem.childElementCount != 0){
        fileSystem.appendChild(link);
    }
}

//testing below
$(function(){
    $.contextMenu({
        selector: '.context-menu-one', 
        callback: function(key, options) {
            var m = "clicked: " + key;
            window.console && console.log(m) || alert(m); 

        },
        items: {
            "delete": {name: "Delete", callback: function(){deleteImage(this.attr("node")); this.remove()}},
        }
    });
    
    $('.context-menu-one').on('click', function(e){
        console.log('clicked', this);
    })
});



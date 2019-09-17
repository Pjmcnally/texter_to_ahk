function startRead() {
    // obtain input element through DOM

    var file = document.getElementById('texter_file').files[0];
    if(file){
        var reader = new FileReader();
        reader.readAsText(file, "UTF-8");

        reader.onload = loaded;
    }
}

function loaded(evt) {
    // Obtain the read file data
    var fileString = evt.target.result;

    var domParser = new DOMParser();
    var doc = domParser.parseFromString(fileString, "text/html")

    var allItems = [];
    allItems = Array.prototype.concat.apply(allItems, doc.getElementsByClassName("row0"));
    allItems = Array.prototype.concat.apply(allItems, doc.getElementsByClassName("row1"));

    allItems.forEach(function(element) {
        // TODO: Change send to sendInput (check loop section)
        // TODO: Change hotstring ending keys
        // TODO: Remove script tags
        // TODO: Convert %ds --> %A_MM%/%A_DD%/%A_YYYY%
        // TODO: Convert %td --> This might be time but I am not sure what the "d" is
        // TODO: Convert %c --> ^v
        // TODO: Convert %| --> Return cursor to here after replacement
        console.log("Hotstring: ", element.childNodes[0].innerText, "Text: ", element.childNodes[1].innerText);
    });
}

/* For reference:
Texter Instructions: https://lifehacker.com/lifehacker-code-texter-windows-238306
AHK Hotstring instructions: https://www.autohotkey.com/docs/Hotstrings.htm
*/

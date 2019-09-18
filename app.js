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

    // Add header to set standard settings and change hotstring ending keys
    var header = `; Auto-Execute Section
; Please do not edit this section unless you know what you are doing.
; ==============================================================================
#SingleInstance, Force              ; Automatically replaces old script with new if the same script file is rune twice
#NoEnv                              ; Avoids checking empty variables to see if they are environment variables (recommended for all new scripts).
#Warn                               ; Enable warnings to assist with detecting common errors. (More explicit)
#Hotstring EndChars \`n \`t           ; Limits hotstring ending characters to {Enter}{Tab}{Space}
SendMode Input                      ; Recommended for new scripts due to its superior speed and reliability.
SetWorkingDir, %A_ScriptDir%\\..     ; Ensures a consistent starting directory. Relative path to AHK folder from core.ahk.
SetTitleMatchMode, 2                ; 2: A window's title can contain WinTitle anywhere inside it to be a match.

Return
; ================================= ; End of Auto-Execute Section

; Personal Hotstring Section.
; Add your hotstrings here. For more information see: https://www.autohotkey.com/docs/Hotstrings.htm
; ==============================================================================`

    var output = [];
    output.push(header)
    output.push("^!r::Reload  ; ctrl-alt-r Reload all scripts.")
    allItems.forEach(function(element) {
        var hotString = element.childNodes[0].innerText.trim()
        var resultText = element.childNodes[1].innerText.trim()

        // Convert %| --> Return cursor to here after replacement
        if (resultText.includes("%|")) {
            var tmp = resultText.split("%|")
            resultText = tmp.join("")
            resultText += `{left ${tmp[1].length}}`
        }

        if (resultText.includes("%ds")) {
            var tempString = `:co:${ hotString }::\n\tSendInput ${ resultText }\nreturn`
        } else {
            var tempString = `:co:${ hotString }::${ resultText }`
        }

        tempString = tempString.replace("::scr::", "")  // Remove script tags
        tempString = tempString.replace("%c", "^v")  // Convert %c --> ^v
        tempString = tempString.replace("!", "{!}")  // Fix ! issue in raw ahk string
        tempString = tempString.replace("%ds", "%A_MM%/%A_DD%/%A_YYYY%")  // Convert %ds to ahk date
        tempString = tempString.replace("%td", "%A_MM%/%A_DD%/%A_YYYY%")  // Convert %td to ahk date

        output.push(tempString)
    });

    document.getElementById("ui").hidden = "true"
    document.getElementById("resultsBox").textContent = output.join('\n')
}

/* For reference:
Texter Instructions: https://lifehacker.com/lifehacker-code-texter-windows-238306
AHK Hotstring instructions: https://www.autohotkey.com/docs/Hotstrings.htm
*/

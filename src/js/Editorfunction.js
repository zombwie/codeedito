// Initialize Ace Editor instances and set theme and mode
var htmlEditor = ace.edit("html-editor");
htmlEditor.setTheme("ace/theme/solarized_dark");
htmlEditor.session.setMode("ace/mode/html");
htmlEditor.session.on('change', function() {
    updateOutput();
});

var cssEditor = ace.edit("css-editor");
cssEditor.setTheme("ace/theme/solarized_dark");
cssEditor.session.setMode("ace/mode/css");
cssEditor.session.on('change', function() {
    updateOutput();
});

var jsEditor = ace.edit("js-editor");
jsEditor.setTheme("ace/theme/solarized_dark");
jsEditor.session.setMode("ace/mode/javascript");
jsEditor.session.on('change', function() {
    updateOutput();
});


// Function to update the output based on the editors' content
function updateOutput() {
    var htmlCode = htmlEditor.getValue();
    var cssCode = "<style>" + cssEditor.getValue() + "</style>";
    var jsCode = "<script>" + jsEditor.getValue() + "</script>";
    var outputFrame = document.getElementById("output");
    outputFrame;
    outputFrame.contentWindow.document.open();
    outputFrame.contentWindow.document.write(htmlCode + cssCode + jsCode);
    outputFrame.contentWindow.document.close();

    // Save project
    var url_string = window.location.href;
    var url = new URL(url_string);
    var id = url.searchParams.get("id");

    async function saveproject() {
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: id, html: htmlEditor.getValue(), css: cssEditor.getValue(), js: jsEditor.getValue() })
        };
        const response = await fetch('/api/saveproject', options);
        const json = await response.json();
    }
    saveproject();
}


// load project fra database via id
var url_string = window.location.href;
var url = new URL(url_string);
var id = url.searchParams.get("id");

async function loadproject() {
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: id })
    };
    const response = await fetch('/api/loadproject', options);
    const json = await response.json();
    if (json.error) {
        console.log(json);
        window.location.href = '/dashboard';
    } else {
        htmlEditor.setValue(json.html);
        cssEditor.setValue(json.css);
        jsEditor.setValue(json.js);
        updateOutput();
    }
}
loadproject();
var pkg;

function getTextFile(src, callback) {
  var http = new XMLHttpRequest();
  http.open("GET", src);
  http.onreadystatechange = function() {
    if (http.readyState === 4) {
      callback(http.responseText);
    }
  };
  http.send();
}

getTextFile('devizr/package.json', function(file_content) {
  pkg = JSON.parse(file_content);
  document.querySelector('header span#version').innerHTML = 'v' + pkg.version;
});


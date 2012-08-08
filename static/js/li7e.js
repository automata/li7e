$(function () {
  // some editor settings using codemirror
  editor = CodeMirror.fromTextArea(document.getElementById("code"), {
    lineNumbers: true,
    gutter: true,
    fixedGutter: true,
    matchBrackets: true,
    onChange: function () { 
      run_code(); 
    }
  });

  var slider = $('#slider');
  slider.slider();
  slider.css('visibility', 'hidden'); 
  // show the slider while the mouse is over numbers
  $("#editor").click(function(e) { 
    var cursorCoords = editor.cursorCoords(); //{x: e.pageX, y: e.pageY};
    var charPosition = editor.coordsChar(cursorCoords);
    var token = editor.getTokenAt(charPosition);
    $("#status").html(token.string + token.className); 

    if (token.className === "number") {
      slider.css('visibility', 'visible'); 
      slider.slider('option', 'max', 20);
      slider.slider('option', 'min', -20);
      slider.slider('option', 'step', 1);
      slider.slider('option', 'value', token.string);
      slider.offset({top: e.pageY-30, left: e.pageX-60});
    } else {
      slider.css('visibility', 'hidden'); 
    }
  });
  
  run_code = function() {
    //eval(editor.getValue());
    var previewFrame = document.getElementById('preview_iframe');
    var preview =  previewFrame.contentDocument || 
      previewFrame.contentWindow.document;

    preview.open();
    if (editor.getValue() !== "") {
      preview.write(editor.getValue());
    }
    preview.close();
  }

  $('#publish').click(function() {
    var v = editor.getValue();
    $.get('/publish', {code: v}, function(result) {
      $('#status').html('Retornou:' + result);
    })
  });
});
$(function () {
  var delay;
  // some editor settings using codemirror
  editor = CodeMirror.fromTextArea(document.getElementById("code"), {
    mode: "htmlmixed",
    tabMode: "indent",
    electricChars: true,
    indentWithTabs: false,
    indentUnit: 2,
    tabSize: 2,
    smartIndent: true,
    lineNumbers: true,
    gutter: true,
    fixedGutter: true,
    matchBrackets: true,
    theme: "lesser-dark"
  });

});
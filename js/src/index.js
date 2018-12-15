import CodeMirror from 'codemirror';
import CSSMode from 'codemirror/mode/css/css';
import JSMode from 'codemirror/mode/javascript/javascript';
import postcss from 'postcss';
import Topdoc from 'postcss-topdoc';



document.addEventListener('DOMContentLoaded', function() {
  const editorTextarea = document.getElementById('editor__textarea');
  const resultsTextarea = document.getElementById('results__textarea');
  const editorCodeMirror = CodeMirror((elt) => {
    editorTextarea.parentNode.replaceChild(elt, editorTextarea);
  }, {
    mode: "css",
    value: editorTextarea.value.trim(),
    lineNumbers: true,
    lineWrapping: true
  });
  const resultsCodeMirror = CodeMirror((elt) => {
    resultsTextarea.parentNode.replaceChild(elt, resultsTextarea);
  }, {
    mode: "javascript",
    readOnly: true,
    lineWrapping: true
  });
  editorCodeMirror.setSize("100%", "100%");
  resultsCodeMirror.setSize("100%", "100%");
  editorCodeMirror.on('change', (cm)=>{
    const output = postcss(Topdoc).process(editorCodeMirror.getValue())
    .then(result => {
      const displayResults = JSON.stringify(result.topdoc, null, "  ");
      resultsCodeMirror.setValue(displayResults);
    })
    .catch(error => {
      delete error.source;
      delete error.input;
      const displayResults = JSON.stringify(error, null, "  ");
      resultsCodeMirror.setValue(displayResults);
    });
  });
  const output = postcss(Topdoc).process(editorCodeMirror.getValue())
  .then((result) => {
    const displayResults = JSON.stringify(result.topdoc, null, "  ");
    resultsCodeMirror.setValue(displayResults);
  });
}, false);

#!/usr/bin/env node
/*
  Build.js (v0.0.1)
*/
var fs = require('fs');
var fileOutput = __dirname+"/thepb.html";
var js = [
    __dirname+'/js/placeholder.js',
    __dirname+'/js/Langs.js',
    __dirname+'/js/ThePB.js',
];
var html = [
    __dirname+'/html/ThePB.html',
];
var css = [
    __dirname+'/css/ThePB.css',
];
(function(js, html, css) {
   var output = [];
   function concat (files, callback) {
            var ret = [];
            files.forEach(function (file, idx) {
                  if (fs.existsSync(file)) {
                     var data = null;
                     if ((data = fs.readFileSync(file,{encoding:'utf-8'}))) {
                        ret.push(data);
                     };
                   } else {
                     console.log('File '+file+' does not exist, skipping.');
                  };
            });
            return (ret.length>0?ret.join("\n"):null);
   };
   if ((css = concat(css))) {
      output.push('<style type="text/css">\n'+css+'</style>\n');
   };
   if ((js = concat(js))) {
      var wrapped = '(function(global,undefined){'+js+'})(window);';
      output.push('<script type="text/javascript">\n'+wrapped+'\n</script>\n');
   };
   if ((html = concat(html))) {
      output.push(html);
   };
   fs.writeFileSync(fileOutput,output.join('').trim());
   if (fs.existsSync(fileOutput)) {
      console.log('Saved file as '+fileOutput);
    } else {
      console.log('Error saving to '+fileOutput);
   };
})(js,html,css);

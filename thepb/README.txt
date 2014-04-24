This is a plugin for TheP(aste)B.in (http://thepb.in/) by Louis T.

To compress everything into a single file, run: node build.js

add "thepb.html" to conf.client_plugins

Example:
conf.client_plugins = [
     "kiwi/assets/plugins/filepicker.html",
     "kiwi/assets/plugins/thepb/thepb.html",
];

You must run build.js each time you edit any of the files.

This plugin adds 3 commands: /thepb, /paste and /pastebin.
There will be an "edit" image added to the input area on the far right.
This plugin also adds a mediaMessage to automatically embed pastes so they can be viewed without leaving the client.

This README needs to be improved!

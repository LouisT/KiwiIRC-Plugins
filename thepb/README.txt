This is a plugin for TheP(aste)B.in (http://thepb.in/) by Louis T.

For now, the plugin MUST be stored in: KiwiIRC/client/kiwi/assets/plugins/thepb/
The reason for this is because (for now, until I can find a better way) the paths are hardcoded in index.html.

Example:
conf.client_plugins = [
     "kiwi/assets/plugins/filepicker.html",
     "kiwi/assets/plugins/thepb/index.html",
     "kiwi/assets/plugins/lastfm.html",
];

This plugin adds 3 commands: /thepb, /paste and /pastebin.
There will be an "edit" image added to the input area on the far right.
This plugin also adds a mediaMessage to automatically embed pastes so you they can be viewed without leaving the client.

This README needs to be improved!

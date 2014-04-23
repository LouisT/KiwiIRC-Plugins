kiwi.addMediaMessageType(function(url) {
     return /^https?:\/\/((.+)\.)?thepb\.in(\/private)?\/[a-z0-9]+\/?$/i.test(url);
 },function (url) {
     if ((exe = /^https?:\/\/(?:(?:.+)\.)?thepb\.in(?:\/private)?\/([a-z0-9]+)\/?$/i.exec(url))) {
        var id = exe[1]+"-"+new Date().getTime();
     };
     $el = $("<iframe id=\""+id+"\" width=\"100%\" height=\"100%\" frameBorder=\"0\" src=\""+url+".kiwi?div="+id+"\"></iframe>");
     if (!("postMessage" in window)) {
        $el.load(function () {
            $el.parent().css({width:"90%", height: "432px", overflow: "hidden", padding: "0", "box-sizing":"border-box"});
        });
     };
     return $el;
});
if (("postMessage" in window)) {
   window.addEventListener("message",function (e) {
          if (/^(https?:\/\/)(.*\.)?thepb\.in/i.test(e.origin)) {
             if (("i" in e.data && document.getElementById(e.data["i"]))) {
                $("#"+e.data.i).parent().css({
                     width: "90%", height: e.data["h"]+"px", "max-height": "432px",
                     overflow: "hidden", padding: "0", "box-sizing": "border-box"
                });
             };
          };
   },true);
 } else {
   console.log("Your browser does not support ThePB's auto resize!");
};
var LightBox = function (content) {
         if (!(this instanceof LightBox)) {
            return new LightBox(content);
         };
         this.box = document.createElement("div");
         this.box.setAttribute("id","ThePB-LB");
         this.shadow = document.createElement("div");
         this.shadow.setAttribute("id","ThePB-LBS");
         document.getElementsByTagName("body")[0].appendChild(this.box);
         document.getElementsByTagName("body")[0].appendChild(this.shadow);
         if (content) {
            this.content(content);
         };
         return this;
};
LightBox.prototype.content = function (content) {
         this.box.innerHTML = content;
         return this;
};
LightBox.prototype.open = function () {
         this.box.style.display = "block";
         this.shadow.style.display = "block";
         return this;
};
LightBox.prototype.close = function () {
         this.box.style.display = "none";
         this.shadow.style.display = "none";
         return this;
};
function ThePBCT () {
         if (confirm("Are you sure you want to clear your paste?")) {
            $("#ThePB-TA").val("");
         }
}
function ThePB () {
         if (!("ThePB-LB" in window)) {
            Object.keys(Langs).forEach(function(key){
                   $("#ThePB-LL").append($("<option>",{value:key}).text(Langs[key]));
            });
            window["ThePB-LB"] = new LightBox($("#ThePB-Hidden").html());
            $(document).keyup(function(e) {
                  if ((("which" in e)?e.which:e.keyCode) == 27) {
                     window["ThePB-LB"].close();
                     e.preventDefault();
                     e.stopPropagation();
                  };
            });
         };
         ThePBReset();
         window["ThePB-LB"].open();
         window["ThePB-LB"].box.style.marginLeft = -(window["ThePB-LB"].box.offsetWidth/2)+"px";
         window["ThePB-LB"].box.style.marginTop = -(window["ThePB-LB"].box.offsetHeight/2)+"px";
         window["ThePB-LB"].shadow.onclick = function () {
             window["ThePB-LB"].close();
         };
         $("#ThePB-Hidden").remove();
};
function ThePBReset () {
         $("#ThePB-ER").html("");
         $("#ThePB-TA").val("");
         $("#ThePB-PW").val("");
         $("#ThePB-DE").val("");
};
function ThePBPaste (mode) {
         $("#ThePB-ER").html("");
         var req = {};
         req["paste"] = $("#ThePB-TA").val();
         req["passwd"] = $("#ThePB-PW").val();
         req["desc"] = $("#ThePB-DE").val();
         req["lang"] = $("select#ThePB-LL option").filter(":selected").val();
         req["priv"] = (mode?"1":"0");
         $.post("http://thepb.in/kiwi/paste.php", req, function(data) {
             if (("error" in data)) {
                $("#ThePB-ER").html(data.error);
              } else {
                window["ThePB-LB"].close();
                var area = $("#kiwi .controlbox textarea");
                area.val(area.val() + data.url);
             };
         },"json").fail(function(xhr, e) {
            $("#ThePB-ER").html("There was an error with ThePB. Please try again later. (Code: "+(xhr.status||0)+")");
         });
};
var control = kiwi.components.ControlInput();
var $icon = $("<a class=\"thepb\" title=\"Upload to ThePB!\"><i class=\"icon-edit\"></i></a>");
$icon.click(function () { ThePB(); });
control.on("command:thepb", function () { ThePB(); });
control.on("command:paste", function () { ThePB(); });
control.on("command:pastebin", function () { ThePB(); });
control.addPluginIcon($icon);

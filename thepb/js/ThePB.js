kiwi.addMediaMessageType(function(url) {
     return /^https?:\/\/((.+)\.)?thepb\.in(\/private)?\/[a-z0-9]+\/?$/i.test(url);
 },function (url) {
     if ((exe = /^https?:\/\/(?:(?:.+)\.)?thepb\.in(\/private)?\/([a-z0-9]+)\/?$/i.exec(url))) {
        var id = exe[2]+"-"+new Date().getTime(),
        $el = $("<div id=\""+id+"\">Loading "+exe[2]+"...</div>");
        $el.ready(function () {
           $.get("https://thepb.in"+(exe[1]?exe[1]:"")+"/"+exe[2]+".kiwi",function(data) {
                $("#"+id).parent().css({"min-width": "485px", "max-width": "95%", "max-height": "480px", overflow: "auto"}).html(data);
           });
        });
        return $el;
     };
});
var LightBox = function (content) {
         if (!(this instanceof LightBox)) {
            return new LightBox(content);
         };
         this.opened = false;
         this.box = document.createElement("div");
         this.box.setAttribute("id","ThePB-LB");
         this.shadow = document.createElement("div");
         this.shadow.setAttribute("id","ThePB-LBS");
         document.getElementsByTagName("body")[0].appendChild(this.box);
         document.getElementsByTagName("body")[0].appendChild(this.shadow);
         $(this.box).data('LightBox',this);
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
         var self = this;
         self.opened = true;
         this.box.style.display = "block";
         this.shadow.style.display = "block";
         this.box.style.marginLeft = -(this.box.offsetWidth/2)+"px";
         this.box.style.marginTop = -(this.box.offsetHeight/2)+"px";
         this.shadow.onclick = function () {
              self.close();
         };
         return this;
};
LightBox.prototype.close = function () {
         this.opened = false;
         this.box.style.display = "none";
         this.shadow.style.display = "none";
         return this;
};
function ThePB () {
         if (!(this instanceof ThePB)) {
            return new ThePB();
         };
         var self = this;
         _.each(_.keys(Langs),function(key){
                $("#ThePB-LL").append($("<option>",{value:key}).text(Langs[key]));
         });
         self.LBManager = new LightBox($("#ThePB-Hidden").html());
         $("#ThePB-Hidden").remove();
         $(document).keyup(function(e) {
               if (self.LBManager.opened) {
                  if ((("which" in e)?e.which:e.keyCode) == 27) {
                     $('#ThePB-LB').data('LightBox').close();
                     e.preventDefault();
                     e.stopPropagation();
                  };
               };
         });
         $("#ThePB-PR").click(function () { self.paste(1); });
         $("#ThePB-SU").click(function () { self.paste(); });
         $("#ThePB-CL").click(function () { self.clear(); });
         $("#ThePB-LBC").click(function () { $('#ThePB-LB').data('LightBox').close(); });
         return this;
};
ThePB.prototype.setPaste = function (content) {
         if (content) {
            $("#ThePB-TA").val(content);
         };
         return this;
};
ThePB.prototype.clear = function () {
         if (confirm("Are you sure you want to clear your paste?")) {
            this.reset();
         }
         return this;
};
ThePB.prototype.reset = function () {
         $("#ThePB-ER").html("");
         $("#ThePB-TA").val("");
         $("#ThePB-PW").val("");
         $("#ThePB-DE").val("");
         return this;
};
ThePB.prototype.paste = function (mode) {
         var self = this;
         $("#ThePB-ER").html("");
         var req = {};
         req["paste"] = $("#ThePB-TA").val();
         req["passwd"] = $("#ThePB-PW").val();
         req["desc"] = $("#ThePB-DE").val();
         req["lang"] = $("select#ThePB-LL option").filter(":selected").val();
         req["priv"] = (mode?"1":"0");
         $.post("https://thepb.in/kiwi/paste.php", req, function(data) {
             if (("error" in data)) {
                $("#ThePB-ER").html(data.error);
              } else {
                self.reset();
                $('#ThePB-LB').data('LightBox').close();
                var area = $("#kiwi .controlbox textarea"),
                    val = area.val();
                if (!/\s+$/.test(val)) {
                   val += " ";
                };
                area.val((val+data.url).trim());
             };
         },"json").fail(function(xhr, e) {
            $("#ThePB-ER").html("There was an error with ThePB. Please try again later. (Code: "+(xhr.status||0)+")");
         });
         return this;
};
$("#kiwi .controlbox textarea").bind("paste",function(e) {
         var self = $(this);
         setTimeout(function () {
              len = self.val().replace(/\s+$/g,"").split(/\r?\n/).length;
              if (len >= 4 && confirm("You are attempting to paste "+len+" lines. Would you like to use a pastebin instead?")) {
                 ThePBManager.setPaste(self.val()).LBManager.open();
                 self.val('');
              };
         });
});
var ThePBManager = ThePB();
var control = kiwi.components.ControlInput();
var $icon = $("<a class=\"thepb\" title=\"Upload to ThePB!\"><i class=\"fa fa-edit\"></i></a>");
$icon.click(function () { ThePBManager.LBManager.open(); });
control.on("command:thepb", function () { ThePBManager.LBManager.open(); });
control.on("command:paste", function () { ThePBManager.LBManager.open(); });
control.on("command:pastebin", function () { ThePBManager.LBManager.open(); });
control.addPluginIcon($icon);

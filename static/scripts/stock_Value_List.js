Site.prototype.SaveValueToList = function(){
    $("#symbolSelect").append(new Option(this.title, this.symbol));
};
Site.prototype.SaveValueToList = function(){
    $("#symbolSelect").append(new Option(this.title, this.symbol));
};

//Submit Event
$( "#stockSearchButton" ).on( "click", function( event ) {
    site.SaveValueToList();
    console.log(event);
  });
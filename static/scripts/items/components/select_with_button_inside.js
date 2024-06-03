var Swbi = function(){
	this.activated = null;
};

Swbi.prototype.cpnt_swbi_activate = function(option){
    if(this.activated != null){
        this.activated.classList.remove('selected');
    }
    this.activated=option;
    this.activated.classList.add('selected');
}

Swbi.prototype.cpnt_swbi_add_to_favorite = function(button){
    button.classList.toggle('favorited');
}

Swbi.prototype.cpnt_swbi_delete = function(button){
    button.parentElement.remove();
}

Swbi.prototype.cpnt_swbi_save_value_to_list = function(quote){
    var optionExists = ($('#symbolSelect option[value="' + quote.symbol + '"]').length > 0);
    if(!optionExists){
        select = document.getElementById('symbolSelect');
        select.insertAdjacentHTML('beforeend', `
        <option onclick=swbi.cpnt_swbi_on_click(this) value= ${quote.symbol} >
            ${quote.title}
            <button onclick=swbi.cpnt_swbi_delete(this) class="delete-button">
                x
            </button>
            <button onclick=swbi.cpnt_swbi_add_to_favorite(this) class="favorite-button">
                ♥
            </button>
        </option>`);
        this.cpnt_swbi_activate(select.lastChild);
    }
};

Swbi.prototype.cpnt_swbi_on_click = function(option){
    site.symbol = option.value;
	site.GetQuote();
    this.cpnt_swbi_activate(option);
}
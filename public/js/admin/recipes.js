"use strict";

define(['common', 'domReady'], function (C, domReady) {

    var deleteBtn = null;
    var title = "";

    var _toggleButtonState = function (value) {
        deleteBtn = deleteBtn || document.getElementById('delete');
        deleteBtn.disabled = !!value;
        if (value == false) {
            deleteBtn.title = "";
        }
        else {
            deleteBtn.title = deleteBtn.getAttribute("data-disabled-title");
        }
    };

    var _bindFormRules = function(){
        deleteBtn = C.GetElem('delete');

        deleteBtn.onclick = function(e){
            e.preventDefault();
            e.stopPropagation();

            var resp = C.Confirm("Are you sure you want to delete this keg?");
            resp.then(function(resp){
                if (resp) {
                    var form = C.SerializeForm(e.target.parentNode.parentNode);
                    //submitForm(form);
                    console.log('form: ', form);
                }
            });
        }
    };

    var _setupSelect = function () {
        var recipes = C.GetElem('recipeList');
        if(recipedata){
            recipes.onchange = function (e) {
                var id = e.target.value;
                var recipename = C.GetElem('Name');
                for (var i = 0; i < recipedata.length; i++){
                    var recipe = recipedata[i];
                    var isRecipe = recipe.id == id;
                    recipename.readOnly = isRecipe;
                    _toggleButtonState(!isRecipe);
                    if (isRecipe) {
                        C.PopulateForm(recipe);
                        break;
                    }
                }
            }
        }
        else {

        }
    };

    var _init = function () {
        _setupSelect();
        _bindFormRules();
    };

    // Public object for reference to functions and properties
    var adminObj = {};

    // When the document is loaded, apply formatting, and bind events
    domReady(_init);

    return adminObj;
});
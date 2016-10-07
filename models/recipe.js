var Recipe = {
    'RecipeObject': function () {
        this.name = null;
        this.og = null;
        this.fg = null;
        this.abv = null;
        this.Author = null;
        this.Notes = null;
        this.srm = null;
        this.ibu = null;
        this.grains = [];
        this.hops = [];
        this.yeast = null;
        this.id = null;
    },
    /**
     * Matches provided params to the expected params of a valid recipe object.
     * @param params
     * @returns {RecipeObject}
     * @constructor
     */
    'RecipeParams': function (params) {
        try{
            var validParams = Recipe.FilterParams(params);
            if (validParams.validCount.length === 0) {
                return false;
            }
            return validParams.params;
        }
        catch(e){
            console.log(e.message);
            return false;
        }
    },
    /**
     * Checks the given parameter object against the allowed insert parameters
     * @param  {Object} params
     * @return {Object} original parameter count, valid parameter count, and valid parameters
     */
    'FilterParams': function (params) {
        var keys = Object.keys(params);
        var validParams = {
            origCount: keys,
            validCount: 0,
            params: {}
        };
        var RecipeParams = new Recipe.RecipeObject();
        Recipe.Params = Recipe.Params || Object.keys(RecipeParams);
        for (var i = 0; i < Recipe.Params.length; i++) {
            var key = Recipe.Params[i];
            if (RecipeParams.hasOwnProperty(key) && typeof params[key] === "string") {
                validParams.params[key] = params[key];
                validParams.validCount++;
            }
            else{
                delete RecipeParams[key];
            }
        }
        return validParams;
    },
    /**
     * A reusable database result/callback method.
     * @param err
     * @param result
     * @private
     */
    '_QueryCallback': function (callback, err, result) {
        if (err) {
            console.error('error: ', err);
            callback({'error': err});
        }
        else if (result) {
            callback(null, result);
        }
        else {
            callback(null, false);
        }
    },
    /**
     * A reusable database query method;
     * @param req
     * @param query
     * @param params
     * @param callback
     * @private
     */
    '_Query': function (req, query, params, callback) {
        Recipe.ErrorMessage = Recipe.ErrorMessage || 'An error occurred attempting to retrieve the requested data. Please try again at a later time.';
        try {
            req.pool.getConnection(function (err, conn) {
                if (err) {
                    console.error(err.message);
                    callback({'error': Recipe.ErrorMessage});
                }
                else if (conn) {
                    var qc = Recipe._QueryCallback.bind(null, callback);
                    if (params) {
                        var _query = conn.query(query, params, qc);
                        console.log(_query.sql);
                    }
                    else {
                        conn.query(query, qc);
                    }
                    conn.release();
                }
                else {
                    callback({'error': Recipe.ErrorMessage})
                }
            });
        }
        catch (e) {
            console.error(e);
            callback({'error': Recipe.ErrorMessage});
        }
    },
    /**
     * Gets an array of full recipe objects including related data.
     * @param req
     * @param callback
     * @constructor
     */
    'GetRecipes': function (req, callback) {
        if (req.pool) {
            var query = 'call get_Recipes';
            Recipe._Query(req, query, null, callback);
        }
        else {
            callback({'error': Recipe.ErrorMessage});
        }
    },
    /**
     * Returns the entire Recipe in the database using the Recipe ID
     * provided in the params object.
     * @param  {Object} req
     * @param  {Object} params
     * @param  {Function} callback
     * @return {undefined}
     */
    'FindRecipeByID': function (req, params, callback) {
        var validParams = Recipe.RecipeParams(params);
        if (!validParams) {
            callback({'error': 'Please check the provided parameters.'});
        }
        else if (req.pool) {
            var query = 'select * from recipes where id = ?';
            Recipe._Query(req, query, validParams.id, callback);
        }
        else {
            callback({'error': Recipe.ErrorMessage});
        }
    },
    /**
     * Gets a list of the recipe names.
     * @param req
     * @param callback
     */
    'ListRecipeNames': function (req, callback) {
        if (req.pool) {
            var query = 'select id, Name from recipes';
            Recipe._Query(req, query, null, callback);
        }
        else {
            callback({'error': Recipe.ErrorMessage})
        }
    },
    /**
     * Finds the Recipe in the database using the Recipe Name
     * provided in the params object.
     * @param  {Object} req
     * @param  {Object} params
     * @param  {Function} callback
     * @return {undefined}
     */
    'FindRecipeByName': function (req, params, callback) {
        var validParams = Recipe.RecipeParams(params);
        if (!validParams) {
            callback({'error': 'Please check the provided parameters.'});
        }
        else if (req.pool) {
            var query = "select * from recipes where Name = ?";
            Recipe._Query(req, query, validParams.name, callback);
        }
        else {
            callback({'error': 'An error occurred attempting to retrieve the requested data. Please try again at a later time.'})
        }
    },
    /**
     * Creates a new recipe.
     * @param req
     * @param params
     * @param callback
     * @constructor
     */
    'AddRecipe': function (req, params, callback) {
        try{
            var RecipeParams = Recipe.RecipeParams(params);
            if (!RecipeParams) {
                callback({'error': 'Please check the provided parameters.'});
            }
            else if (req.pool) {
                Recipe.FindRecipeByName(req, params, function (err, result) {
                    if (err) {
                        callback({'error': err});
                    }
                    else if (result.length > 0) {
                        callback({'error': 'Recipe already exists'});
                    }
                    else {
                        var query = 'insert into Recipes SET ?';
                        Recipe._Query(req, query, RecipeParams, callback);
                    }
                });
            }
            else {
                callback({'error': 'Database not available.'});
            }
        }
        catch(e){
            callback({'error': e.message});
        }
    },
    /**
     * Updates an existing recipe.
     * @param req
     * @param params
     * @param callback
     * @constructor
     */
    'UpdateRecipe': function (req, params, callback) {
        var RecipeParams = Recipe.RecipeParams(params);
        if (!RecipeParams) {
            callback({'error': 'Please check the provided parameters.'});
        }
        else if (req.pool) {

            Recipe.FindRecipeByName(req, params, function (err, result) {
                if (err) {
                    callback({'error': err});
                }
                if (result) {
                    callback({'error': 'Recipe already exists'});
                }
                else {
                    var query = 'update Recipes SET ? where id = ?';
                    Recipe._Query(req, query, (RecipeParams, RecipeParams.id), callback);
                }
            });
        }
        else {
            callback({'error': 'Database not available.'});
        }
    }
};

module.exports = Recipe;
var express = require("express");
var router = express.Router();
const DButils = require("./utils/DButils");
const user_utils = require("./utils/user_utils");
const recipe_utils = require("./utils/recipes_utils");

/**
 * Authenticate all incoming requests by middleware
 */
router.use(async function (req, res, next) {
  if (req.session && req.session.user_id) {
    DButils.execQuery("SELECT user_id FROM users")
      .then((users) => {
        if (users.find((x) => x.user_id === req.session.user_id)) {
          req.user_id = req.session.user_id;
          next();
        }
      })
      .catch((err) => next(err));
  } else {
    res.sendStatus(401);
  }
});

/**
 * This path gets body with recipeId and save this recipe in the favorites list of the logged-in user
 */
router.post("/setFavoriteRecipe", async (req, res, next) => {
  try {
    const user_id = req.session.user_id;
    const recipe_id = req.body.recipeId;
    await user_utils.markAsFavorite(user_id, recipe_id);
    res.status(200).send("The Recipe successfully saved as favorite");
  } catch (error) {
    next(error);
  }
});

/**
 * This path gets body with recipeId and remove this recipe from the favorites list of the logged-in user
 */

router.post("/unsetFavoriteRecipe", async (req, res, next) => {
  try {
    const user_id = req.session.user_id;
    const recipe_id = req.body.recipeId;
    await user_utils.unmarkAsFavorite(user_id, recipe_id);
    res.status(200).send("The Recipe successfully removed from favorites");
  } catch (error) {
    next(error);
  }
});

router.post("/markAsLike", async (req, res, next) => {
  try {
    const user_id = req.session.user_id;
    const recipe_id = req.body.recipeId;
    await user_utils.markAsLike(user_id, recipe_id);
    res.status(200).send("The Recipe successfully saved as like");
  } catch (error) {
    next(error);
  }
});

router.post("/unmarkAsLike", async (req, res, next) => {
  try {
    const user_id = req.session.user_id;
    const recipe_id = req.body.recipeId;
    await user_utils.unmarkAsLike(user_id, recipe_id);
    res.status(200).send("The Recipe successfully removed");
  } catch (error) {
    next(error);
  }
});

/**
 * This path set the recipe as seen by the user
 */
router.post("/setSeenRecipe", async (req, res, next) => {
  try {
    const user_id = req.session.user_id;
    const recipe_id = req.body.recipeId;
    await user_utils.markAsSeen(user_id, recipe_id);
    res.status(200).send("The Recipe successfully saved as seen");
  } catch (error) {
    next(error);
  }
});

/**
 * This path returns the favorites recipes that were saved by the logged-in user
 */
router.get("/getFavoriteRecipes", async (req, res, next) => {
  try {
    const user_id = req.session.user_id;
    const recipes_id = await user_utils.getFavoriteRecipes(user_id);
    let recipes_id_array = [];
    recipes_id.map((element) => recipes_id_array.push(element.recipe_id)); //extracting the recipe ids into array
    const results = await recipe_utils.getRecipesPreview(
      recipes_id_array,
      user_id
    );
    res.status(200).send(results);
  } catch (error) {
    next(error);
  }
});

router.post("/createRecipe", async (req, res, next) => {
  try {
    const user_id = req.session.user_id;
    const recipe = req.body.recipe;
    await user_utils.createRecipe(user_id, recipe);
    res.status(200).send("The Recipe successfully created");
  } catch (error) {
    next(error);
  }
});

//check if only family recipes???
router.post("/getRecipes", async (req, res, next) => {
  try {
    const user_id = req.session.user_id;
    const recipes = await user_utils.getRecipes(user_id);
    res.status(200).send(recipes);
  } catch (error) {
    next(error);
  }
});

module.exports = router;

var express = require("express");
var router = express.Router();
const DButils = require("./utils/DButils");
const user_utils = require("./utils/user_utils");
const recipes_utils = require("./utils/recipes_utils");
const family = require("./family");
const assert = require("assert");

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

router.use("/family", family);
/**
 * This path returns the favorites recipes that were saved by the logged-in user
 */
router.get("/favorite", async (req, res, next) => {
  try {
    const user_id = req.session.user_id;
    const recipes_id = await user_utils.getFavoriteRecipes(user_id);
    let recipes_id_array = [];
    recipes_id.map((element) => recipes_id_array.push(element.id)); //extracting the recipe ids into array
    const results = await recipes_utils.getRecipesPreview(
      recipes_id_array,
      user_id
    );
    res.status(200).send(results);
  } catch (error) {
    next(error);
  }
});

/**
 * This path gets body with recipeId and save this recipe in the favorites list of the logged-in user
 */
router.post("/favorite", async (req, res, next) => {
  try {
    const user_id = req.session.user_id;
    const id = req.body.recipeId;
    const isfav = req.body.isfav;
    await user_utils.favorite(user_id, id, isfav);
    res.status(200).send("The Recipe favorite successfully saved");
  } catch (error) {
    next(error);
  }
});

router.get("/myRecipes", async (req, res, next) => {
  try {
    const user_id = req.session.user_id;
    const recipes = await user_utils.getMyRecipes(user_id);
    res.status(200).send(recipes);
  } catch (error) {
    next(error);
  }
});

router.get("/seen", async (req, res, next) => {
  try {
    const user_id = req.session.user_id;
    const recipes_id = await user_utils.getThreeLastSeens(user_id);
    let recipes_id_array = [];
    recipes_id.map((element) => recipes_id_array.push(element.id)); //extracting the recipe ids into array

    const results = await recipes_utils.getRecipesPreview(
      recipes_id_array,
      user_id
    );
    res.status(200).send(results);
  } catch (error) {
    next(error);
  }
});

/**
 * This path set the recipe as seen by the user.
 */

router.post("/myRecipes", async (req, res, next) => {
  try {
    const user_id = req.session.user_id;
    const recipe = req.body.recipe;
    await user_utils.createRecipe(user_id, recipe);
    res.status(200).send("The Recipe successfully created");
  } catch (error) {
    next(error);
  }
});

router.get("/search", async (req, res, next) => {
  try {
    const recipes = await recipes_utils.searchByName(
      req.query,
      req.session.user_id
    );
    if (recipes.length == 0) {
      throw { status: 404, message: "There are no recipes with this name" };
    }
    res.send(recipes);
  } catch (error) {
    next(error);
  }
});

router.get("/random", async (req, res, next) => {
  try {
    const recipes = await recipes_utils.randomRecipes(
      req.query,
      req.session.user_id
    );
    res.send(recipes);
  } catch (error) {
    next(error);
  }
});

router.get("/ingerdients", async (req, res, next) => {
  try {
    name = req.query.name;
    number = req.query.number;
    const ingredients = await user_utils.getIngerdients(name, number);

    if (ingredients.results.length == 0) {
      throw { status: 404, message: "There are no ingredient with this name" };
    }
    res.send(ingredients.results);
  } catch (error) {
    next(error);
  }
});

router.get("/recipe", async (req, res, next) => {
  try {
    let user_id = req.session.user_id;
    let id = req.query.id;
    let result = await DButils.execQuery(
      `SELECT * FROM recipes  WHERE id = ${id}  and user_id = ${user_id}`
    );

    assert(result.length !== 0, "The recipe does not exist");
    let recipe = await user_utils.getRecipe(id);
    res.send(recipe);
  } catch (error) {
    next(error);
  }
});
/**
 * This path returns a full details of a recipe by its id
 */
router.get("/:recipeId", async (req, res, next) => {
  try {
    await user_utils.setseen(req.session.user_id, req.params.recipeId);
    const recipe = await recipes_utils.getRecipeFullDetails(
      req.params.recipeId,
      req.session.user_id
    );
    res.send(recipe);
  } catch (error) {
    next(error);
  }
});

module.exports = router;

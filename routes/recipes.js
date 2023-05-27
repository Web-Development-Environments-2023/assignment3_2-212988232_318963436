var express = require("express");
var router = express.Router();
const recipes_utils = require("./utils/recipes_utils");
const DButils = require("./utils/DButils");

router.get("/", (req, res) => res.send("im here"));

router.get("/search", async (req, res, next) => {
  try {
    const recipes = await recipes_utils.searchByName(req.query);
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
    const recipes = await recipes_utils.randomRecipes(req.query);
    res.send(recipes);
  } catch (error) {
    next(error);
  }
});

/**
 * This path returns a full details of a recipe by its id
 */
router.get("/:recipeId", async (req, res, next) => {
  try {
    const recipe = await recipes_utils.getRecipeFullDetails(
      req.params.recipeId
    );
    res.send(recipe);
  } catch (error) {
    next(error);
  }
});

module.exports = router;

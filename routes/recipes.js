var express = require("express");
var router = express.Router();
const recipes_utils = require("./utils/recipes_utils");
const DButils = require("./utils/DButils");

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
router.get("/", (req, res) => res.send("im here"));

router.get("/getRecipeByName", async (req, res, next) => {
  try {
    const user_id = req.session.user_id;
    const recipes = await recipes_utils.searchByName(req.query, user_id);
    if (recipes.length == 0) {
      throw { status: 404, message: "There are no recipes with this name" };
    }
    res.send(recipes);
  } catch (error) {
    next(error);
  }
});

router.get("/getRandom", async (req, res, next) => {
  try {
    const user_id = req.session.user_id;
    const recipes = await recipes_utils.randomRecipes(req.query, user_id);
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
    const user_id = req.session.user_id;
    const recipe = await recipes_utils.getRecipeDetails(
      req.params.recipeId,
      user_id
    );
    res.send(recipe);
  } catch (error) {
    next(error);
  }
});

module.exports = router;

-- Active: 1684857355945@@127.0.0.1@3306@recipe_db
DROP DATABASE IF EXISTS recipe_db;

CREATE DATABASE recipe_db;

USE recipe_db;

CREATE TABLE
    users (
        user_id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(100) UNIQUE,
        password VARCHAR(255),
        firstname VARCHAR(100),
        lastname VARCHAR(100),
        email VARCHAR(100),
        country VARCHAR(50)
    );

CREATE TABLE
    recipes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(50),
        image VARCHAR(255),
        readyInMinutes INTEGER,
        vegetarian BOOLEAN,
        vegan BOOLEAN,
        glutenFree BOOLEAN,
        recipe_date DATE,
        servings INT,
        user_id INT,
        FOREIGN KEY (user_id) REFERENCES users(user_id)
    );

CREATE TABLE
    favorites (
        user_id INT ,
        id INT ,
        date TIMESTAMP,
        PRIMARY KEY (user_id, id),
        FOREIGN KEY (user_id) REFERENCES users(user_id)
    );

CREATE TABLE
    seens (
        user_id INT ,
        id INT ,
        date TIMESTAMP,
        PRIMARY KEY (user_id, id),
        FOREIGN KEY (user_id) REFERENCES users(user_id)
    );
CREATE TABLE 
    ingredients(
        ingredient_id INT PRIMARY KEY,
        name VARCHAR(50),
        imageURL VARCHAR(255)
    );
CREATE TABLE
    recipe_ingredients(
        id INT,
        ingredient_id INT,
        amount INT,
        units ENUM("g", "kg", "ml", "l", "tsp", "tbsp", "cup", "piece"),
        PRIMARY KEY (id, ingredient_id),
        FOREIGN KEY (id) REFERENCES recipes(id),
        FOREIGN KEY (ingredient_id) REFERENCES ingredients(ingredient_id)
    );

CREATE TABLE
    steps(
        step_id INT AUTO_INCREMENT PRIMARY KEY,
        id INT,
        step_number INT,
        description VARCHAR(1000),
        FOREIGN KEY (id) REFERENCES recipes(id)
    );

CREATE TABLE
    family(
        family_id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(50)
    );
CREATE TABLE
    user_family(
        family_id INT,
        user_id INT,
        PRIMARY KEY (family_id, user_id),
        FOREIGN KEY (family_id) REFERENCES family(family_id),
        FOREIGN KEY (user_id) REFERENCES users(user_id)
    );
CREATE TABLE
    recipe_family(
        family_id INT,
        id INT,
        data TEXT,
        PRIMARY KEY (family_id, id),
        FOREIGN KEY (family_id) REFERENCES family(family_id),
        FOREIGN KEY (id) REFERENCES recipes(id)
    );





    



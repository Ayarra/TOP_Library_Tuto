const Genre = require("../models/genre");
const Book = require("../models/book");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

exports.genre_list = asyncHandler(async (req, res, next) => {
  const allGenres = await Genre.find().sort({ name: 1 }).exec();
  res.render("genre_list", {
    title: "Genre List",
    genre_list: allGenres,
  });
});

exports.genre_detail = asyncHandler(async (req, res, next) => {
  const [genre, bookInGenre] = await Promise.all([
    Genre.findById(req.params.id).exec(),
    Book.find({ genre: req.params.id }, "title summary").exec(),
  ]);
  if (genre === null) {
    const err = new Error("Genre not found.");
    err.status = 404;
    return next(err);
  }

  res.render("genre_detail", {
    title: "Genre Detail",
    genre: genre,
    genre_books: bookInGenre,
  });
});

exports.genre_create_get = (req, res, next) => {
  res.render("genre_form", { title: "Create genre" });
};

exports.genre_create_post = [
  // Validate and sanitize the name field.
  body("name", "Genre must contain at least 3 characters.")
    .trim()
    .isLength({ min: 3 })
    .escape(),

  // Process request after validation and sanitization
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request
    const errors = validationResult(req);

    // Create a genre object with escaped and trimmed data
    const genre = new Genre({ name: req.body.name });

    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.
      res.render("genre_form", {
        title: "Create genre",
        genre: genre,
        errors: errors.array(),
      });
      return;
    } else {
      // Data form is valid
      // Check if Genre with the same name already exists.
      const genreExists = await Genre.findOne({ name: req.body.name }).exec();
      if (genreExists) {
        // Genre exists, redirect to its detail page.
      } else {
        await genre.save();
        // New genre saved. Redirect to genre detail page.
        res.redirect(genre.url);
      }
    }
  }),
];

exports.genre_delete_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Genre delete GET");
});

exports.genre_delete_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Genre delete POST");
});

exports.genre_update_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Genre update GET");
});

exports.genre_update_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Genre update POST");
});

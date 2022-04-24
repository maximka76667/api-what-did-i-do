const Card = require('../models/card');
const NotFoundError = require('../errors/not-found-error');
const ForbiddenError = require('../errors/forbidden-error');
const { errorMessages: { forbiddenErrorMessage, notFoundErrorMessages: { cards: cardsErrorMessage } } } = require('../errors/error-config');
const handleErrors = require('../errors/handle-errors');

const getUserCards = (req, res, next) => {
  Card.find({ owner: req.user._id })
    .then((cards) => res.send({ cards }))
    .catch((err) => next(handleErrors(err)));
};

const addCard = (req, res, next) => {
  Card.create({ owner: req.user._id, ...req.body })
    .then((card) => res.send(card))
    .catch((err) => next(handleErrors(err)));
};

const changePoints = (req, res, next) => {
  Card.findByIdAndUpdate(req.user._id, req.body, { new: true, runValidators: true })
    .then((card) => {
      if (!card) throw new NotFoundError(cardsErrorMessage);
      if (card.owner._id.toString() !== req.user._id) {
        throw new ForbiddenError(forbiddenErrorMessage);
      }
      return res.send({ card });
    })
    .catch((err) => next(handleErrors(err)));
};

const deleteCard = (req, res, next) => {
  const { cardId } = req.params;

  Card.findById(cardId)
    .then((card) => {
      if (!card) throw new NotFoundError(cardsErrorMessage);
      if (card.owner._id.toString() !== req.user._id) {
        throw new ForbiddenError(forbiddenErrorMessage);
      }
      Card.findByIdAndDelete(cardId)
        .then(() => res.send(card))
        .catch((err) => next(handleErrors(err)));
    })
    .catch((err) => next(handleErrors(err)));
};

// const getMovies = (req, res, next) => {
//   Movie.find({})
//     .then((movies) => res.send({ movies: movies.reverse() }))
//     .catch((err) => next(handleErrors(err)));
// };

// const addMovie = (req, res, next) => {
//   Movie.create({ owner: req.user._id, ...req.body })
//     .then((movie) => res.send({ movie }))
//     .catch((err) => next(handleErrors(err)));
// };

// const deleteMovie = (req, res, next) => {
//   const { movieId } = req.params;

//   Movie.findById(movieId)
//     .then((movie) => {
//       if (!movie) throw new NotFoundError(notFoundErrorMessage);
//       if (movie.owner._id.toString() !== req.user._id) {
//         throw new ForbiddenError(forbiddenErrorMessage);
//       }
//       Movie.findByIdAndDelete(movieId)
//         .then(() => res.send({ movie }))
//         .catch((err) => next(handleErrors(err)));
//     })
//     .catch((err) => next(handleErrors(err)));
// };

module.exports = {
  getUserCards,
  addCard,
  deleteCard,
  changePoints,
};

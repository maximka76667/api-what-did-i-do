const compareDates = require('../utils/compareDates');
const Card = require('../models/card');
const { ForbiddenError, NotFoundError, handleErrors } = require('../errors');
const { errorMessages: { forbiddenErrorMessage, notFoundErrorMessages: { cards: cardsErrorMessage } } } = require('../errors/error-config');

const getUserCards = (req, res, next) => {
  Card.find({ owner: req.user._id })
    .then((cards) => res.send({
      cards: cards.sort(compareDates),
    }))
    .catch((err) => next(handleErrors(err)));
};

const addCard = (req, res, next) => {
  Card.create({ owner: req.user._id, ...req.body })
    .then((card) => res.send(card))
    .catch((err) => next(handleErrors(err)));
};

const addPoint = async (req, res, next) => {
  const { cardId } = req.params;
  Card.findByIdAndUpdate(cardId, {
    $addToSet: {
      points: req.body.point,
    },
  }, { new: true })
    .then((card) => {
      if (!card) throw new NotFoundError(cardsErrorMessage);
      if (card.owner._id.toString() !== req.user._id) {
        throw new ForbiddenError(forbiddenErrorMessage);
      }
      const { points: newPoints } = card;
      const newPoint = newPoints[newPoints.length - 1];
      res.send({ newPoint });
    })
    .catch((err) => next(handleErrors(err)));
};

const getPoint = (req, res, next) => {
  const { cardId, pointId } = req.params;
  Card.findOne({ _id: cardId, 'points._id': pointId })
    .then((card) => res.send({
      card,
    }))
    .catch((err) => next(handleErrors(err)));
};

const updatePoint = (req, res, next) => {
  const { cardId, pointId } = req.params;
  Card.findOneAndUpdate({ _id: cardId, 'points._id': pointId }, {
    $set: {
      'points.$.name': req.body.newName,
    },
  }, { new: true })
    .then((card) => res.send(card))
    // To do handleErrors
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

const deletePoint = (req, res, next) => {
  const { cardId, pointId } = req.params;

  Card.findByIdAndUpdate(cardId, {
    $pull: {
      points: { _id: pointId },
    },
  }, { new: true })
    // To do handle errors
    .then((card) => res.send(card))
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
  addPoint,
  getPoint,
  updatePoint,
  deletePoint,
};

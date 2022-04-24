const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { getUserCards, addCard, deleteCard } = require('../controllers/cards');
const {
  auth, signout, createUser, login, updateUser, getMyUser,
} = require('../controllers/users');
const routeNotFound = require('../middlewares/route-not-found');

router.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30).required(),
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    }),
  }),
  createUser,
);

router.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    }),
  }),
  login,
);

router.use(auth);

// Cards routes
router.get('/cards', getUserCards);

router.post(
  '/cards',
  celebrate({
    body: Joi.object().keys({
      date: Joi.string().required(),
      points: Joi.array().required().default([]),
    }),
  }),
  addCard,
);

router.patch(
  '/cards/:cardId',
  celebrate({
    body: Joi.array(),
    params: Joi.object().keys({
      cardId: Joi.string().hex().length(24),
    }),
  }),
);

router.delete(
  '/cards/:cardId',
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().hex().length(24),
    }),
  }),
  deleteCard,
);

// Users routes
router.get('/users/me', getMyUser);

router.patch(
  '/users/me',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30).required(),
      email: Joi.string().email().required(),
    }),
  }),
  updateUser,
);

router.get('/signout', signout);

router.use(routeNotFound);

module.exports = router;

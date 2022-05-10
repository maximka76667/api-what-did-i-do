const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getUserCards, addCard, deleteCard, addPoint,
} = require('../controllers/cards');
const {
  signout, createUser, login, updateUser, getMyUser,
} = require('../controllers/users');
const { auth, routeNotFound } = require('../middlewares');

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
      points: Joi.array().items(Joi.string()),
    }),
  }),
  addCard,
);

router.patch(
  '/cards/:cardId',
  celebrate({
    body: Joi.object({
      point: Joi.object({
        name: Joi.string().required(),
      })
        .required(),
    }),
    params: Joi.object().keys({
      cardId: Joi.string().hex().length(24),
    }),
  }),
  addPoint,
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

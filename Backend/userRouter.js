const express = require('express');

const userRouter = express.Router();
// express.get('/', (req, res, next) => {
//   console.log('get all Users');
//   res.json({
//     result: 'sucess',
//     users: [{
//       id: '123',
//       name: 'john doe',
//     }, {
//       id: '456',
//       name: 'jane doe',
//     }],
//   });
// });
userRouter.post('/signup', (req, res, next) => {
  console.log('Create a new User with data present in req.body');
  console.log(req.body);
  res.json({
    result: 'sucess',
  });
});

// express.get('/:id', (req, res, next) => {
//   console.log('get a user with Id  : req.params.id');
//   res.json(
//     result: 'sucess',
//     users: {
//       id: '456',
//       name: 'jane doe',
//     },
//   });
// });

module.exports = userRouter;

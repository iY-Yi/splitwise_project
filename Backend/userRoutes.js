var routes = (express) => {
    let userRouter = express.Router();
    userRouter.get('/', (req, res, next) => {
        console.log('get all Users');
        res.json({
            result: 'sucess',
            users: [{
                id: "123",
                name: "john doe"
            }, {
                id: "456",
                name: "jane doe"
            }]
        })
    });
    userRouter.post('/', (req, res, next) => {
        console.log('Create a new User with data present in req.body');
        res.json({
            result: 'sucess'
        })
    });

    userRouter.get('/new', (req, res, next) => {
        res.status(200).end("API is working properly");
    });

    userRouter.get('/:id', (req, res, next) => {
        console.log('get a user with Id  : req.params.id');
        res.json({
            result: 'sucess',
            users: {
                id: "456",
                name: "jane doe"
            }
        })
    });
};
module.exports = routes;
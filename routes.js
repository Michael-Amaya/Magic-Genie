module.exports = (app, db) => {
    let utils = require("./utils")(db);

    // Usage example:
    // utils.askGenieQuestion("Is there a meaning to life?")
    // Response:
    // { question: 'Is there a meaning to life?', answer: 'Better not tell you now.', answerType: 2 }
    // Gets inserted in database on its own

    // Define all routes here!
    app.get('/', async (req, res) => {
        res.render('index');
    });
};
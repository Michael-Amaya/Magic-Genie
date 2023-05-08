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

    app.post('/getPrediction', async (req,res) => {
        const question = req.body.question;
        let answer = utils.askGenieQuestion(question);

        // Generate image between 1 and 3
        const imageNumber = Math.floor(Math.random() * 3) + 1;
        let imageName = '';
        if (answer.answerType == AnswerType.positive) {
            imageName = 'positive';
        } else if (answerType == AnswerType.negative) {
            imageName = 'negative';
        } else {
            imageName = 'neutral';
        }

        const finalName = `${imageName}${imageNumber}.png`;
        answer['image'] = finalName;

        res.render('getPrediction', answer);
    });

    app.get('/previousPredictions/:queryType', async (req, res) => {
        const queryType = req.param.queryType;
        const getType = utils.getQueryType(queryType);
        let vars = {
            'err': false,
            'predictions': []
        }

        if (getType != utils.AnswerType.error) {
            vars['predictions'] = utils.getPredictions(getType);
        } else {
            vars['err'] = true
        }

        res.render('previousPredictions', vars);
    });
};
module.exports = db => {
    const axios = require("axios");

    // Answer type enum
    const AnswerType = {
        positive: 0,
        negative: 1,
        neutral: 2,
        error: 3,
        all: 4
    }

    // Possible positive answers
    const positive = [ 
        'It is Certain.', 
        'It is decidedly so.', 
        'Without a doubt.', 
        'Yes definitely.', 
        'You may rely on it.', 
        'As I see it, yes.', 
        'Most likely.',
        'Outlook good.',
        'Yes.',
        'Signs point to yes.'
      ];

    // Possible negative answers
    const negative = [
        "Don't count on it.",
        'My reply is no.',
        'My sources say no.',
        'Outlook not so good.',
        'Very doubtful.'
      ];

    // Possible neutral answers
    const neutral = [
        'Reply hazy, try again.',
        'Ask again later.',
        'Better not tell you now.',
        'Cannot predict now.',
        'Concentrate and ask again.'
      ];

    // Ask question to genie. Stores in database automatically.
    const askGenieQuestion = async question => {
        const answer = await make8BallApiCall(question);
        const answerType = getAnswerType(answer);

        insertPrediction(question, answer, answerType);

        const toReturn = {
            question: question,
            answer: answer,
            answerType: answerType
        }


        return toReturn
    }

    // Gets the type of answer returned by the API
    const getAnswerType = answer => {
        if (positive.includes(answer)) {
            return AnswerType.positive;
        } else if (negative.includes(answer)) {
            return AnswerType.negative;
        } else if (neutral.includes(answer)) {
            return AnswerType.neutral;
        } else {
            return AnswerType.error;
        }
    };

    // Makes a call to the 8ball api with axios, waits for a response and then
    // returns the genie's answer
    const make8BallApiCall = async question => {
        response = await axios.get(`https://eightballapi.com/api?question=${question}`);
        return response.data.reading;
    };
    
    // Insert prediction into mongodb database
    // Requires the question asked, the answer returned, and
    // an answer type
    const insertPrediction = (question, answer, answerType) => {
        const toInsert = {
            question: question,
            answer: answer,
            answerType: answerType
        }

        const result = db.client.db(db.database).collection(db.collection).insertOne(toInsert);
        return result.insertedCount;
    };

    // Get predictions from the database. If no answer type is defined,
    // then it will just get all of the predictions. Valid answer types are
    // AnswerType.positive, AnswerType.negative, AnswerType.neutral, AnswerType.all (for all predictions)
    const getPredictions = async (answerType = AnswerType.all) => {
        // Set filter to either get all predictions, or only specific predictions
        let filter = {answerType: answerType}
        if (answerType == AnswerType.all) { filter = {} }


        let result = await db.client.db(db.database).collection(db.collection).find(filter).toArray();
        return result;
    };

    // Export what needs exporting
    return {
        AnswerType: AnswerType,
        askGenieQuestion: askGenieQuestion,
        getPredictions: getPredictions
    }
}
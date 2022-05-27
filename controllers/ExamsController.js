const Questions = require("../models/question");
const Attention = require("../models/attention");
const Exam = require('../models/exam')
class ExamsController {

    saveExam = async (req, res) => {
        try {
            const { id, name, questionPoint, listQuestion, time, typeCategory, description, requirement, testCount, detail } = req.body
            Exam.findByIdAndUpdate(id,
                {
                    name,
                    questionPoint,
                    listQuestion,
                    time,
                    typeCategory,
                    description,
                    requirement,
                    testCount,
                    detail
                },
                (err, docs) => {
                    if (err) {
                        res.status(401).send(JSON.stringify({
                            message: "Get failed"
                        }))
                    } else {
                        res.status(201).send(JSON.stringify({
                            message: 'Save success',
                            data: docs,
                        }))
                    }
                })
        } catch {
            res.status(401).send(JSON.stringify({
                message: "Error system"
            }))
        }
    }

    deleteExam = async (req, res) => {
        try {
            const { id } = req.body
            Exam.findByIdAndDelete(id, (err, docs) => {
                if (err) {
                    res.status(401).send(JSON.stringify({
                        message: "Get failed"
                    }))
                } else {
                    res.status(201).send(JSON.stringify({
                        message: 'Delete success',
                        data: docs,
                    }))
                }
            })
        } catch {
            res.status(401).send(JSON.stringify({
                message: "Error system"
            }))
        }
    }

    getExamEdit = async (req, res) => {
        try {
            const { id } = req.params
            Exam.findById(id, (err, docs) => {
                if (err) {
                    res.status(401).send(JSON.stringify({
                        message: "Get failed"
                    }))
                } else {
                    res.status(201).send(JSON.stringify({
                        message: 'Get success',
                        data: docs,
                    }))
                }
            })

        } catch (err) {
            res.status(401).send(JSON.stringify({
                message: "Error system"
            }))
        }
    }

    getAllTestExam = async (req, res) => {
        try {
            await Exam.find().exec()
                .then(result => {
                    res.status(201).send(JSON.stringify({
                        message: 'Get success',
                        data: result
                    }))
                })
                .catch(err => {
                    res.status(401).send(JSON.stringify({
                        message: "Get failed"
                    }))
                })
        } catch (err) {
            res.status(401).send(JSON.stringify({
                message: "Error system"
            }))
        }
    }

    addNewExam = async (req, res) => {
        try {
            const { name, questionPoint, listQuestion, time, typeCategory, description, requirement, testCount ,detail } = req.body
            console.log(req.body)
            const newTestExam = new Exam({
                name,
                questionPoint,
                listQuestion,
                time,
                typeCategory,
                description,
                requirement,
                testCount,
                detail
            })

            newTestExam.save()
                .then(result => {
                    if (result) {
                        res.status(201).send(JSON.stringify({
                            message: 'Send succes',
                            data: result
                        }))
                    } else {
                        res.status(401).send(JSON.stringify({
                            message: "Save failed"
                        }))
                    }
                })
                .catch(err => {
                    res.status(401).send(JSON.stringify({
                        message: "Save failed"
                    }))
                })
        } catch (err) {
            res.status(401).send(JSON.stringify({
                message: "Error system"
            }))
        }
    }

    getAllExams = async (req, res) => {

    }
    getQuestions = async (req, res) => {
        var ObjectId = require('mongodb').ObjectId;
        const questionsID = new ObjectId(req.body.questionsID);
        console.log("qid: ", questionsID);
        Questions.findOne({ _id: questionsID }).exec()
            .then((data) => {
                console.log("data: ", data.ListQuestions);
                res.status(200).send(
                    JSON.stringify({
                        data: data.ListQuestions
                    })
                )
            })
            .catch((error) => {
                console.log(error);
            })
    }
    getResultExam = async (req, res) => {
        const questionsID = req.body.questionsID;
        const userAnswer = req.body.userAnswer;
        const rightAnswer = [];
        const examID = req.body.examID;
        //  const username = res.locals.data.username;
        const username = "tanthanh0805";
        let score = 0;
        let testRound = 1;

        Questions.findOne({ _id: questionsID }).exec()
            .then((data) => {
                console.log("data: ", data.ListQuestions);
                data.ListQuestions.forEach(element => {
                    rightAnswer.push(element.rightAnswer);
                });

                for (var i = 0; i < rightAnswer.length; i++) {
                    if (rightAnswer[i] == userAnswer[i]) score = score + 1;
                }
                Attention.findOne({ username: username, examID: examID }).sort({ '_id': -1 }).limit(1).exec()
                    .then((data) => {
                        if (data) testRound = data.testRound + 1;
                        const newAttention = new Attention({
                            username: username,
                            examID: examID,
                            score: score,
                            testRound: testRound,
                            userAnswer: userAnswer
                        })
                        newAttention.save().then((data) => {
                            console.log("attention: ", data);
                            res.status(200).send(
                                JSON.stringify({
                                    rightAnswer: rightAnswer,
                                    userAnswer: userAnswer,
                                    score: score,
                                })
                            )
                        });
                    })
                    .catch((error) => {
                        console.log(error);
                    })

            })
            .catch((error) => {
                console.log(error);
            })
    }
}

module.exports = new ExamsController();
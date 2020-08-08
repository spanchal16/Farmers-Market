
const axios = require('axios')


function randomNumberGenerator() {
    let aNumber = Math.floor(Math.random() * (100 - 1) + 1);
    if (aNumber % 2 == 0) {
        return 2
    }
    else {
        return 1
    }
}
let questionNumber = 0;
module.exports = {


    backHome: async function (req, res) {
        let error = req.query.error;
        return res.view("pages/homepage", { error });
    },

    twoFactorQuestion: async function (req, res) {

        // console.log(req.method);
        if (req.method === 'GET' || req.body.txtemailid === undefined || req.body.txtpassword === undefined) {
            //res.redirect('..');
            res.redirect('/?error=' + "Please login first!");
        }
        else {
            let email = req.body.txtemailid;
            let password = req.body.txtpassword;

            const sqlSelect = "SELECT * FROM users where email_id = '"+email+"' and password = '"+password+ "'";

            await sails.sendNativeQuery(sqlSelect, async function (err, results) {
                var length = results["rows"].length;
                if (err) {
                    console.log(err);
                    res.redirect('/?error=Something went wrong. Please try again later');
                }
                else {
                    if (length < 1) {
                        res.redirect('/?error=Invalid Credentials');
                    }
                    else {
                        console.log(results["rows"]);
                        questionNumber = randomNumberGenerator();
                        let question = ""
                        let answer = ""
                        if(questionNumber === 1){
                        //     console.log(results["rows"][0]["question1"])
                             question = results["rows"][0]["question1"];
                             answer = results["rows"][0]["answer1"];
                        }
                        else{
                          //  console.log(results["rows"][0]["question2"])
                            question = results["rows"][0]["question2"];
                            answer = results["rows"][0]["answer2"];
                        }

                        
                        res.view('pages/twoFactorQuestions', { email, question, answer });
                    }
                }
            });

        }
    },


    authenticateanswer: async function (req, res) {
        if(questionNumber === 0 ){
            res.redirect('/?error=Something went wrong!');
        }
        else{
            let userAnswer = req.body.txtanswer;
            let correctAnswer = req.body.correctanswer;
            if(userAnswer.toLowerCase() === correctAnswer.toLowerCase()){
                console.log("Authenticated!!!!!!!!!!!!");
            }
            else{
                res.redirect('/?error=Wrong Answer! Start Again!');
            }

        }

    },
};

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
        req.session.destroy();
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
                        name = results["rows"][0]["first_name"];
                        req.session.address = results["rows"][0]["address"];
                        res.view('pages/twoFactorQuestions', { email, question, answer, name });
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
                req.session.authenticated = true;
                req.session.emailId =  req.body.email;
                req.session.name = req.body.name;
                console.log(req.session);
                res.redirect('/userHome');
            }
            else{
                res.redirect('/?error=Wrong Answer! Start Again!');
            }

        }

    },

    goHome: async function (req, res) {
        if(req.session.authenticated != true ){
            res.redirect('/?error=You need to login first!');
        }
        else{
            let name = req.session.name;

            await axios({
                method: 'get',
                url: "https://farmersmarketcompany.azurewebsites.net/api/getallProducts",
                headers: {},
                data: {}
            })
                .then(function (response) {
                   // console.log("home all->"+response);
                    allData = response;
                })
                .catch(function (error) {
                    return res.json({ status: 'unsuccessful' });
            });
            console.log(allData)
            if(req.query.error != undefined){
                req.session.currentProductID = null;
                req.session.currentProduct = null;
                req.session.priceEach = null;
                req.session.currentQty = null;
                let error = req.query.error
                res.view('pages/userHome', { name, allData, error });
            }
            else{
                req.session.currentProductID = null;
                req.session.currentProduct = null;
                req.session.priceEach = null;
                req.session.currentQty = null;    
            res.view('pages/userHome', { name, allData });
            }
        }

    },

    // Function for Registering the user.
    registerData: async function (req, res) {

    
        let email = req.body.txtemailid;
        

        const sqlSelect = "SELECT * FROM users where email_id = '"+email+"'";

        await sails.sendNativeQuery(sqlSelect, async function (err, results) {
            var length = results["rows"].length;
            if (err) {
                console.log(err);
                res.redirect('/?error=Something went wrong. Please try again later');
            }
            else {
                if (length < 1) {
                    console.log("inside length < 1")
                    let vals = "values('"+email+"' , "+" '"+req.body.txtfname+"' , "+" '"+req.body.txtlname+"' , "+" '"+req.body.txtpassword+"' , "+" '"+req.body.txtquetion1+"' , "+" '"+req.body.txtanswer1+"' , "+" '"+req.body.txtquetion2+"' , "+" '"+req.body.txtanswer2+"' , "+" '"+req.body.address+"')"
        
                  
                    let sqlInsert = "insert into users " + vals;
                    await sails.sendNativeQuery(sqlInsert, async function (err, results){
                        if (err) {
                            console.log(err);
                            res.redirect('/?error=Something went wrong. Please try again later');
                        }

                        else{
                            res.redirect('/')
                        }
                  

                    })
                      
                }
                else {
                    res.redirect('/?error=Invalid Credentials');
                }
                   
            }
        })
    }


};
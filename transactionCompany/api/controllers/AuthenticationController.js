
const axios = require('axios')
module.exports = {


    backHome: async function (req, res) {
    let error = req.query.error;
    return res.view("pages/homepage", { error });
    },

    twoFactorQuestion: async function (req, res) {

       // console.log(req.method);
        if(req.method === 'GET' || req.body.txtemailid === undefined || req.body.txtpassword === undefined){
            //res.redirect('..');
           // console.log('undefined aaaavyuuuuu');
            res.redirect('/?error=' + "true");
        }
        else{
           // console.log("Na check kryu");
            let email = req.body.txtemailid;
            let password = req.body.txtpassword;
        
        const sqlSelect = "SELECT * FROM users";

        await sails.sendNativeQuery(sqlSelect,async function (err, results) {
          var length = results["rows"].length;
          if(err){
              console.log(err);
          }
          else {
           console.log(results["rows"]);
          // res.redirect('/twoFactor?email=' + email);
          let question = "This is a test question for 2 Factor";
           res.view('pages/twoFactorQuestions',{question});
          }
        }); 

        }          
    },
};

const axios = require('axios')
module.exports = {

    twoFactorQuestion: async function (req, res) {
        const sqlSelect = "SELECT * FROM users";

        await sails.sendNativeQuery(sqlSelect,async function (err, results) {
          var length = results["rows"].length;
          if(err){
              console.log(err);
          }
          else {
           console.log(results["rows"]);
          }
        }); 

                  
      },    
};
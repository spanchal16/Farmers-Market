

module.exports.routes = {

  '/': { view: 'pages/homepage' },
  '/registerUser': {view: 'pages/registerUser'},
  "POST /twofactor": "AuthenticationController.twofactorQuestion",
};

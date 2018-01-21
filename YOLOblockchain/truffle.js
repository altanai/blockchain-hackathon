module.exports = {
 /*build: new DefaultBuilder({
    "index.html": "index.html",
    "app.js": [
      "javascripts/app.js"
    ],
    "app.css": [
      "stylesheets/app.css"
    ],
    "images/": "images/"
  }),*/
  networks: {
    development: {
      host: "localhost" , //"192.168.3.226", //"localhost",
      port: 8545, // 7545 fro gnache running from windows appx , 8545 for ganache cli
      network_id: "*", // Match any network id
      /*gas:4612388*/
    },
    live:{
      host: "192.168.3.226", //"localhost",
      port: 7545, // 7545 fro gnache running from windows appx , 8545 for ganache cli
      network_id: "1", // Match any network id
    }
  }
};






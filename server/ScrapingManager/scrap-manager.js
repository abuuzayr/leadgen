var request = require('request');
var fs = require('fs');
var config = require('../config');
var dbHandler = require('../database-handler');
var countries = require('../countries.json').geonames;
var apiKey = require('../apikey.json').googleAPI;

var coord = [];
/**This is a module for handling scraping
*@exports ScrapManager
*/
var ScrapManager = {

  /**
  *Start new google scrape, loads list of coordinates based on country.
  *@param {string} type - category to scrap
  *@param {string} country - country to scrap
  *@param {string} apiKey - google places api key
  *@returns {Promise} scrape results or error
  */
  scrapCorporateGoogleNew: function(type, country, apiKey) {
    return new Promise(function(resolve, reject) {
      
      var formatType = type.replace(/ /g , '+');

      if (country == 'Singapore') {
        loadLocalCoordinates();

        //Radar search based on coordinates and radius
        var url = 'https://maps.googleapis.com/maps/api/place/radarsearch/json?location=' + coord[0][0] + ',' + coord[0][1] + '&radius=3000&keyword=' + formatType + '&key=' + apiKey;

        requestGoogle(url)
          .then(function(places) {
            var arr1 = [];
            for (var i = 0; i < places.results.length; i++) {
              var urlDetails = 'https://maps.googleapis.com/maps/api/place/details/json?placeid=' +
                places.results[i].place_id + '&key=' + apiKey;
              arr1.push(requestGoogle(urlDetails));
            }
            return Promise.all(arr1);
          })
          .then(function(results) {
            var arr = [];

            for (var i = 0; i < results.length; i++) {
              var obj = {
                firstName: null,
                lastName: null,
                email: null,
                company: results[i].result.name,
                phone: results[i].result.international_phone_number,
                category: type,
                type: 1,
                origin: 1,
                success: 0,
                failure: 0,
                history: null
              };
              arr.push(obj);
            }

            resolve(arr);
          })
          .catch(function(error) {
            reject(500);
          });
      } else {
        loadForeignCoordinates(country)
          .then(function(results) {
            var url = 'https://maps.googleapis.com/maps/api/place/radarsearch/json?location=' + coord[0][0] + ',' + coord[0][1] + '&radius=10000&keyword=' + formatType + '&key=' + apiKey;

            requestGoogle(url)
              .then(function(places) {
                var arr1 = [];
                for (var i = 0; i < places.results.length; i++) {
                  var urlDetails = 'https://maps.googleapis.com/maps/api/place/details/json?placeid=' +
                    places.results[i].place_id + '&key=' + apiKey;
                  arr1.push(requestGoogle(urlDetails));
                }
                return Promise.all(arr1);
              })
              .then(function(results) {
                var arr = [];

                for (var i = 0; i < results.length; i++) {
                  var obj = {
                    firstName: null,
                    lastName: null,
                    email: null,
                    company: results[i].result.name,
                    phone: results[i].result.international_phone_number,
                    category: type,
                    type: 1,
                    origin: 1,
                    success: 0,
                    failure: 0,
                    history: null
                  };
                  arr.push(obj);
                }

                resolve(arr);
              })
              .catch(function(error) {
                reject(500);
              });
          })
          .catch(function(error) {
            reject(error);
          });
      }
    });
  },

  /**
  *Continued google scrape with different coordinates based on index
  *@param {Number} index - index for array of coordinates
  *@param {string} type - category to scrap
  *@param {string} country - country to scrap
  *@param {string} apiKey - google places api key
  *@returns {Promise} scrap results or error
  */
  scrapCorporateGoogleCont: function(index, type, country, apiKey) {
    return new Promise(function(resolve, reject) {

      var formatType = type.replace(/ /g , '+');

      var radius;
      if (index >= coord.length)
        reject(205);

      if (country == 'Singapore')
        radius = 3000;
      else
        radius = 10000;

      var url = 'https://maps.googleapis.com/maps/api/place/radarsearch/json?location=' + coord[index][0] + ',' + coord[index][1] + '&radius=' + radius + '&keyword=' + formatType + '&key=' + apiKey;

      requestGoogle(url)
        .then(function(places) {
          var arr1 = [];
          for (var i = 0; i < places.results.length; i++) {
            var urlDetails = 'https://maps.googleapis.com/maps/api/place/details/json?placeid=' +
              places.results[i].place_id + '&key=' + apiKey;
            arr1.push(requestGoogle(urlDetails));
          }
          return Promise.all(arr1);
        })
        .then(function(results) {
          var arr = [];

          for (var i = 0; i < results.length; i++) {
            var obj = {
              firstName: null,
              lastName: null,
              email: null,
              company: results[i].result.name,
              phone: results[i].result.international_phone_number,
              category: type,
              type: 1,
              origin: 1,
              success: 0,
              failure: 0,
              history: null
            };
            arr.push(obj);
          }

          resolve(arr);
        })
        .catch(function(error) {
          reject(500);
        });
    });
  },

  /**
  *Scrape corporate leads from superadmin source
  *@param {string} type - category to scrap
  *@returns {Promise} scrape results or error
  */
  scrapCorporateYellowPage: function(type) {
    return new Promise(function(resolve, reject) {
      dbHandler.dbQuerySA('local', {type:1, category:type})
        .then(function(results) {
          for(var i=0;i<results.length;i++){
            results[i].origin = 2;
          }
          resolve(results);
        })
        .catch(function(error) {
          reject(error);
        });
    });
  },

  /**
  *Scrape consumer leads from superadmin source
  *@param {string} type - category to scrap
  *@returns {Promise} scrape results or error
  */
  scrapConsumerYellowPage: function(type) {
    return new Promise(function(resolve, reject) {
      dbHandler.dbQuerySA('local', {
          category: type,
          type : 2
        })
        .then(function(results) {
          for(var i=0;i<results.length;i++){
            results[i].origin = 2;
          }
          resolve(results);
        })
        .catch(function(error) {
          reject(error);
        });
    });
  }

};

/**
*Sends request to the url
*@param {string} url - api endpoint
*@returns {Promise} response body or error
*/
var requestGoogle = function(url) {
  return new Promise(function(resolve, reject) {
    request(url, function(error, response, body) {
      if (error !== null)
        reject(error);
      else {
        resolve(JSON.parse(body));
      }
    });
  });
};

/**
*Loads local coordinate from config.js
*/
var loadLocalCoordinates = function() {
  coord = [];
  for (var i = 0; i < config.coordinates.length; i++) {
    coord.push([config.coordinates[i].Latitude, config.coordinates[i].Longitude]);
  }
};

/**
*Loads coordinates from other countries
*/
var loadForeignCoordinates = function(country) {
  return new Promise(function(resolve, reject) {
    coord = [];
    var id;
    for (var i = 0; i < countries.length; i++) {
      if (countries[i].countryName == country) {
        id = countries[i].geonameId;
        break;
      }
    }
    if (id === undefined)
      reject(400);
    var url = 'http://api.geonames.org/childrenJSON?geonameId=' + id + '&username=groventuretest';
    request(url, function(error, response, body) {
      if (error !== null)
        reject(500);
      else {
        var obj = JSON.parse(body);
        var arr = obj.geonames;
        for (var i = 0; i < arr.length; i++) {
          coord.push([arr[i].lat, arr[i].lng]);
        }
        resolve(200);
      }
    });
  });
};



module.exports = ScrapManager;

//origin 1 = from user , 2 = filter from yp

//type 1 = corporate, 2 = consumer


module.exports = {
  'port': process.env.PORT || 8080,
  'dbURI': 'mongodb://localhost:27017/app',
  'superSecret' : 'ilovescotchscotchyscotchscotch',
  'appSecret' : 'secret_for_bulletlead',
  'successMsg': 'sucess',
  'errorMsg': 'error',
  'apiFile': 'apikey.txt',
  'coordinates': [{
    Longitude: 103.856,
    Latitude: 1.2931
  }, {
    Longitude: 103.82,
    Latitude: 1.2939
  }, {
    Longitude: 103.85,
    Latitude: 1.3692
  }, {
    Longitude: 103.783,
    Latitude: 1.305
  }, {
    Longitude: 103.961,
    Latitude: 1.3225
  }, {
    Longitude: 103.7,
    Latitude: 1.3333

  }, {
    Longitude: 103.763,
    Latitude: 1.3517
  }, {
    Longitude: 103.765,
    Latitude: 1.3797
  }, {
    Longitude: 103.776,
    Latitude: 1.3403
  }, {
    Longitude: 103.788,
    Latitude: 1.2806
  }, {
    Longitude: 103.964,
    Latitude: 1.3417
  }, {
    Longitude: 103.75,
    Latitude: 1.3825
  }, {
    Longitude: 103.765,
    Latitude: 1.3158
  }, {
    Longitude: 103.723,
    Latitude: 1.3342
  }, {
    Longitude: 103.739,
    Latitude: 1.3414
  }, {
    Longitude: 103.723,
    Latitude: 1.3503
  }, {
    Longitude: 103.867,
    Latitude: 1.3333
  }, {
    Longitude: 103.818,
    Latitude: 1.4028
  }, {
    Longitude: 103.771,
    Latitude: 1.2928
  }, {
    Longitude: 103.948,
    Latitude: 1.3722
  }, {
    Longitude: 103.907,
    Latitude: 1.4144
  }, {
    Longitude: 103.829,
    Latitude: 1.4508
  }, {
    Longitude: 103.871,
    Latitude: 1.3508
  }, {
    Longitude: 103.956,
    Latitude: 1.3411
  }, {
    Longitude: 103.904,
    Latitude: 1.3361
  }, {
    Longitude: 103.95,
    Latitude: 1.3492
  }, {
    Longitude: 103.844,
    Latitude: 1.3492
  }, {
    Longitude: 103.85,
    Latitude: 1.3361
  }, {
    Longitude: 103.777,
    Latitude: 1.4444
  }, {
    Longitude: 103.754,
    Latitude: 1.3944
  }, {
    Longitude: 103.831,
    Latitude: 1.4333
  }],
  getDbUri : function(userID){
    if(userID === null)
      return 'mongodb://localhost:27017/s_admin';
    else
      return 'mongodb://localhost:27017/' + userID;
  }
};
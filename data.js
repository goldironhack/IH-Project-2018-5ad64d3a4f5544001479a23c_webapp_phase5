var URLS = {
  "neighborhood": 'https://data.cityofnewyork.us/api/views/xyye-rtrs/rows.json',
  "districts": "https://services5.arcgis.com/GfwWNkhOj9bNBqoJ/arcgis/rest/services/nycd/FeatureServer/0/query?where=1=1&outFields=*&outSR=4326&f=geojson",
  "crimes": "https://data.cityofnewyork.us/resource/9s4h-37hy.json",
  "housing": "https://data.cityofnewyork.us/api/views/hg8x-zxpr/rows.json"
};

function DataManager() {

let r = {};
  for (let key in URLS) {
    $.get(URLS[key], function(data) {})
      .done(function(data) {
        switch (key) {
          case Object.keys(URLS)[0]:
            r[key] = data.data;
            break;
          case Object.keys(URLS)[1]:
            r[key] = JSON.parse(data).features;
            break;
          case Object.keys(URLS)[2]:
            r[key] = data;
            break;
          case Object.keys(URLS)[3]:
            r[key] = data.data;
            break;
          default:
            break;
        }
      })
      .fail(function(error) {
        console.log(error);
      });
  }

  this.result = r;
  this.keys = Object.keys(URLS);
}

DataManager.prototype.getDataFromURLS = function() {
  return this.result;
}

DataManager.prototype.getKeysURLS = function() {
  return this.keys;
}

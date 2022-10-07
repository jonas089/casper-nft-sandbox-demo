// write to- and read from .json files
const fs = require('fs');

function writeJsonFile(data, path){
    fs.writeFile(
      path + '.json',
      JSON.stringify(data),
      function (err) {
          if (err) {
              console.error('Failed to dump json.');
          }
      }
    );
}
  
function readJsonFile(path){
    let data = fs.readFileSync(
      path + '.json', 'utf-8'
    );
    let json_data = [];
    try {
      json_data = JSON.parse(data)
    }
    catch(error){
      null;
    };
    return json_data;
}

module.exports = {readJsonFile, writeJsonFile};
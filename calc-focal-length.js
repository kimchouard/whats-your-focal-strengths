var ExifImage = require('exif').ExifImage;
var path = require("path");
var glob = require("glob");
const ObjectsToCsv = require('objects-to-csv');
const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});

// Create the array that contains all the images data
let exifs = [];

const saveExifs = async () => {
  const csvExifs = new ObjectsToCsv(exifs);
 
  // Save to file:
  await csvExifs.toDisk(path.join(__dirname, '/exifs.csv'));
 
  // Return the CSV file as string:
  console.log(await csvExifs.toString());
  return await csvExifs.toString();
}

const extractExifs = async (files, iterator) => {
  try {
    const file = files[iterator];

    await new ExifImage({ image : file }, (error, exifData) => {
      if (error) { return console.error('Error: ', error.message); }
      
      let exif = exifData.exif;
      let newExif = {
        path: file,
        FNumber: exif.FNumber,
        ISO: exif.ISO,
        CreateDate: exif.CreateDate,
        ShutterSpeedValue: exif.ShutterSpeedValue,
        ApertureValue: exif.ApertureValue,
        MeteringMode: exif.MeteringMode,
        FocalLength: exif.FocalLength,
        LensInfo: exif.LensInfo,
        LensModel: exif.LensModel,
      }

      console.log('Adding line:',newExif, exif);

      exifs.push(newExif);

      if (iterator < files.length-1) {
        extractExifs(files,iterator+1);
      }
      else {
        // console.log('Exifs:', exifs);
        saveExifs();
      }
    });
  } catch (error) {
    return console.error('Error: ', error.message);
  }
}
  
readline.question(`What folder do you want to analyze?`, (folder) => {
  console.log(`You chose "${folder}"`);
  // options is optional
  glob(`${path.join(__dirname, folder)}/**/*.jpg`, {}, (err, files) => {
    // files is an array of filenames.
    // If the `nonull` option is set, and nothing
    // was found, then files is ["**/*.js"]
    // er is an error object or null.

    if (err) {
      return console.log('Unable to scan directory: ' + err);
    } 

    extractExifs(files, 0);
  })

  
  readline.close();
})
  





// var im = require('imagemagick');
// im.readMetadata('SA307923.ARW', function(err, metadata){
//   if (err) throw err;
//   console.log('Shot at '+metadata.exif.dateTimeOriginal, metadata);
// })
// // -> Shot at Tue, 06 Feb 2007 21:13:54 GMT

// const fileMetadata = require('file-metadata');
 
// (async () => {
//     console.log(await fileMetadata('SA307923.ARW'));
// })();
var ExifImage = require('exif').ExifImage;
var path = require("path");
var glob = require("glob");
const ObjectsToCsv = require('objects-to-csv');
const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});
const args = require('minimist')(process.argv.slice(2));

// Create the array that contains all the images data
let exifs = [];

const saveExifs = async () => {
  const csvExifs = new ObjectsToCsv(exifs);
 
  // Save to file:
  await csvExifs.toDisk(path.join(__dirname, '/exifs.csv'));
 
  // Return the CSV file as string:
  // console.log(await csvExifs.toString());
  return await csvExifs.toString();
}

const extractExifs = async (files, iterator) => {
  try {
    const file = files[iterator];

    await new ExifImage({ image : file }, (error, exifData) => {
      if (error) { return console.error('Error: ', error.message); }
      
      let exif = exifData.exif;
      // DOC: p.31 https://www.exif.org/Exif2-2.PDF
      let newExif = {
        path: file,
        ExposureTime: exif.ExposureTime, // Exposure time, given in seconds (sec). 
        ExposureProgram: exif.ExposureProgram, /*
          Default = 0
            0 = Not defined
            1 = Manual
            2 = Normal program
            3 = Aperture priority
            4 = Shutter priority
            5 = Creative program (biased toward depth of field)
            6 = Action program (biased toward fast shutter speed)
            7 = Portrait mode (for closeup photos with the background out of focus)
            8 = Landscape mode (for landscape photos with the background in focus)
            Other = reserved 
        */
        FNumber: exif.FNumber, // The F number.
        ISO: exif.ISO,
        CreateDate: exif.CreateDate,
        ShutterSpeedValue: exif.ShutterSpeedValue, // Shutter speed. The unit is the APEX (Additive System of Photographic Exposure) setting
        ApertureValue: exif.ApertureValue, // The lens aperture. The unit is the APEX value. 
        MaxApertureValue: exif.MaxApertureValue, //The smallest F number of the lens. The unit is the APEX value. 
        BrightnessValue: exif.BrightnessValue, // The value of brightness. The unit is the APEX value. Ordinarily it is given in the range of -99.99 to 99.99. 
        MeteringMode: exif.MeteringMode, /* The metering mode.
          Default = 0
            0 = unknown
            1 = Average
            2 = CenterWeightedAverage
            3 = Spot
            4 = MultiSpot
            5 = Pattern
            6 = Partial
            Other = reserved
            255 = other 
        */
        FocalLength: exif.FocalLength, // The actual focal length of the lens, in mm. Conversion is not made to the focal length of a 35 mm film camera. 
        LensInfo: exif.LensInfo,
        LensModel: exif.LensModel,
        SubjectDistance: exif.SubjectDistance, // The distance to the subject, given in meters. Note that if the numerator of the recorded value is FFFFFFFF.H, Infinity shall be indicated; and if the numerator is 0, Distance unknown shall be indicated. 
      }

      // console.log('Adding line:',newExif, exif);

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

const getFilesExifs = (folder) => {
  console.log(`You chose "${folder}"`);

  // the folder is absolute IF starts with "/", otherwise relative to the current folder.
  glob(`${(folder.search('^\/') === -1) ? path.join(__dirname, folder) : folder}/**/*.jpg`, {}, (err, files) => {
    if (err) {
      return console.log('Unable to scan directory: ' + err);
    } 

    extractExifs(files, 0);
  });
}

// MAIN
if (args['folder']) {
  readline.close();
  let folder = args['folder'];
  getFilesExifs(folder);
}
else {
  readline.question(`What folder do you want to analyze?`, (folder) => {
    getFilesExifs(folder);
    
    readline.close();
  });
}
# whats-your-focal-lengths
Get some more insight on what focal length you shot the most with.

# Usage

```node calc-focal-length.js```

This will ask you a folder in which to find your JPGs.

You can specify the folder directly with `--folder`:

```node calc-focal-length.js --folder "/Volumes/Kim Chouard/
Sony/"```

# Outputs

Create a exifs.csv with extended data on any JPG in the specified folder.

## path
Path of the image.

## ExposureTime
Exposure time given in seconds (sec). 
## ExposureProgram
The class of the program used by the camera to set exposure when the picture is taken. 

Default = 0

- 0 = Not defined
- 1 = Manual
- 2 = Normal program
- 3 = Aperture priority
- 4 = Shutter priority
- 5 = Creative program (biased toward depth of field)
- 6 = Action program (biased toward fast shutter speed)
- 7 = Portrait mode (for closeup photos with the background out of focus)
- 8 = Landscape mode (for landscape photos with the background in focus)
- Other = reserved 

## FNumber
The F number.

## ISO

The ISO value.

## CreateDate

Format: `2019:02:13 12:57:07`

## ShutterSpeedValue

Shutter speed. The unit is the APEX (Additive System of Photographic Exposure) setting.

## ApertureValue

The lens aperture. The unit is the APEX value. 

## MaxApertureValue

The smallest F number of the lens. The unit is the APEX value. 

## BrightnessValue

The value of brightness. The unit is the APEX value. Ordinarily it is given in the range of -99.99 to 99.99. 

## MeteringMode

The metering mode.

Default = 0
- 0 = unknown
- 1 = Average
- 2 = CenterWeightedAverage
- 3 = Spot
- 4 = MultiSpot
- 5 = Pattern
- 6 = Partial
- Other = reserved
- 255 = other 


## FocalLength

The actual focal length of the lens in mm. Conversion is not made to the focal length of a 35 mm film camera. 

## LensInfo

## LensModel

## SubjectDistance

The distance to the subject given in meters. Note that if the numerator of the recorded value is FFFFFFFF.H Infinity shall be indicated; and if the numerator is 0 Distance unknown shall be indicated. 

---

Full Documentation available p.31: https://www.exif.org/Exif2-2.PDF
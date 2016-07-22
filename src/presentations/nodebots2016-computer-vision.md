```json
{
    "date"   : "2016-07-22T10:00:18.998Z"
  , "title"  : "node.js & computer vision"
  , "author" : "Andrey Sidorov"
  , "tags"    : ["dbus", "node.js", "computer vision", "nodebots"]
  , "template": "presentation"
  , "fileName": "nodebots2016-computer-vision.html"
}
```

# Node.js & practical computer vision recipes

## node-opencv

Object detection (car/face):

node-opencv has a number of bundled configurations for feature extraction

```js
var CASCADES = {
   FACE_CASCADE: 'haarcascade_frontalface_alt.xml'
 , EYE_CASCADE: 'haarcascade_eye.xml'
 , EYEGLASSES_CASCADE: 'haarcascade_eye_tree_eyeglasses.xml'
 , FULLBODY_CASCADE: 'haarcascade_fullbody.xml'
 , CAR_SIDE_CASCADE: 'hogcascade_cars_sideview.xml'
};
```

## Google Cloud vision

First, read ["quick start"](https://cloud.google.com/vision/docs/quickstart). Go to API console and [enable cloud vision API]( https://console.cloud.google.com/apis/api/vision.googleapis.com/overview?project=api-project-113105314762)

![](https://cloud.githubusercontent.com/assets/173025/17054047/6bfbb120-5048-11e6-8672-7efe2eca253d.png)

Example using [official npm package](https://www.npmjs.com/package/gcloud#google-cloud-vision-beta)

```js
var gcloud = require('gcloud');

// Authorizing on a per-API-basis. You don't need to do this if you auth on a
// global basis (see Authorization section above).

var vision = gcloud.vision({
  projectId: 'vernal-acrobat-120002',
  keyFilename: 'key.json'
});

//vision.detectText('./image.png', function(err, text) {
//vision.detect('./image2.jpg', ['label', 'face'],

function detect() {
  // this is my phone IP camera
  // though undocumented, you can pass image url
  // and client would request image for you locally
  // first before sending to CV
  vision.detect('http://192.168.1.7:8080/shot.jpg', ['label', 'face'], function(err, detections, resp) {
    console.log(detections.labels)
    detect();
    // we'll do it in a loop in this exemple
    // don't forget to close, otherwise https://cloud.google.com/vision/docs/pricing
  });
}
detect()
```

See more examples on [tutorial page](https://cloud.google.com/vision/docs/face-tutorial)

let video = document.getElementById("videoElement");
let photo = document.getElementById('photo');
let canvas = document.getElementById("result");
let canvas_new = document.getElementById("result_new");

let width;
let height;
let context;


video.addEventListener('loadedmetadata', function(e){
  width = video.videoWidth;
  height = video.videoHeight;
});


if (navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({video: true})
        .then(function(stream) {
            video.srcObject = stream;
        })
        .catch(function(error) {
            console.log("Something went wrong!");
            console.log(error)
        });
}
setInterval(takepicture,10);

function takepicture() {
  context = canvas.getContext('2d');
  var context_new = canvas_new.getContext('2d');
  if (width && height) {
    canvas_new.width = width;
    canvas_new.height = height;
    context_new.drawImage(video, 0, 0, width, height);
    var data = canvas_new.toDataURL('image/png');
    photo.setAttribute('src', data);
    photo.width = 128;
    photo.height = 128;
    // photo.setAttribute('width',width);
    // photo.setAttribute('width',height);
  } else {
    console.log('do nothing')
  }
}


const APP = {
  model: null, 
  size: 256,
  source: document.getElementById('photo'),
  canvas: document.getElementById('result'),
  status: document.getElementById('status'),
  download: document.getElementById('download'),
  $: n => document.getElementById(n),
  path: './models/CartoonGAN/web-uint8/model.json'
}



tf.setBackend('wasm').then(() => runModel())

const runModel = async () => {
  APP.model = await tf.loadGraphModel(APP.path)
  // warm up
  APP.model.predict(tf.zeros([1, 1, 1, 3])).dispose()
  predict(APP.source)
  APP.source.onload = () => {
    setTimeout(() => { predict(APP.source) }, 1)
  }
}

async function predict(imgElement) {
  let img = tf.browser.fromPixels(imgElement)
  console.log('img',img.shape)
  const shape = img.shape
  const [w, h] = shape
  img = normalize(img)
  const t0 = performance.now()
  const result = await APP.model.predict({ 'input_photo:0': img })
  const timer = performance.now() - t0
  let img_out = await result.squeeze().sub(tf.scalar(-1)).div(tf.scalar(2)).clipByValue(0, 1)
  const pad = Math.round(Math.abs(w - h) / Math.max(w, h) * APP.size)
  const slice = (w > h) ? [0, pad, 0] : [pad, 0, 0]
  img_out = img_out.slice(slice)
  draw(img_out, shape)
  console.log(Math.round(timer / 1000 * 10) / 10)
}

function normalize(img) {
  const [w, h] = img.shape
  // pad
  const pad = (w > h) ? [[0, 0], [w - h, 0], [0, 0]] : [[h - w, 0], [0, 0], [0, 0]]
  img = img.pad(pad)
  const size = APP.size
  img = tf.image.resizeBilinear(img, [w, h]).reshape([1, w, h, 3])
  const offset = tf.scalar(127.5)
  return img.sub(offset).div(offset)
}

async function draw(img, size) {
  // console.log(img.shape)
  canvas.width = 128
  canvas.height = 128
  // console.log(canvas.width,canvas.height)
  // console.log(video.videoWidth,video.videoHeight)
  await tf.browser.toPixels(img, canvas);

  // context.drawImage(img, 0, 0, width, height);
  // const scaleby = size[0] / img.shape[0]
  // tf.browser.toPixels(img, APP.canvas)
  // setTimeout(() => scaleCanvas(scaleby), 10)
}

// function scaleCanvas(pct=10) {
//   const canvas = APP.$('result')
//   const tmpcan = document.createElement('canvas')
//   const tctx = tmpcan.getContext('2d')
//   const cw = canvas_new.width
//   const ch = canvas_new.height
//   tmpcan.width = cw
//   tmpcan.height = ch
//   tctx.drawImage(canvas, 0, 0)
//   canvas.width *= pct
//   canvas.height *= pct
//   const ctx = canvas.getContext('2d')
//   ctx.drawImage(tmpcan, 0, 0, cw, ch, 0, 0, cw*pct, ch*pct)
//   APP.download.href = canvas.toDataURL('image/jpeg')
// }



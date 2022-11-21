var video = document.getElementById("videoElement");

if (navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({video: true})
        .then(function(stream) {
            video.srcObject = stream;
        })
        .catch(function(error) {
            console.log("Something went wrong!");
        });
}

var c = document.getElementById("result");
var ctx = c.getContext("2d");

setInterval(function () {
  ctx.drawImage(video, 0, 0, 640, 360);
  console.log(video.width,video.height)
  c.toBlob(function(blob) {
       // Save Blob
       var a = document.createElement("a");
       document.body.appendChild(a);
       var url = window.URL.createObjectURL(blob);
       a.href = url;
       window.URL.revokeObjectURL(url);
      //  console.log(stream.srcObject)
  });      
}, 1000 / 15)

// //  Accessing the webcam
// var video = document.querySelector("#videoElement");

// if (navigator.mediaDevices.getUserMedia) {
//   navigator.mediaDevices.getUserMedia({ video: true })
//     .then(function (stream) {
//       video.srcObject = stream;
//     })
//     .catch(function (err0r) {
//       console.log("Something went wrong!");
//     });
// }

// // cartoonization intialization
// tf.setBackend('wasm').then(() => runModel())

// const APP = {
//   model: null, size: 256,
//   source: document.getElementById('videoElement'),
//   canvas: document.getElementById('result'),
//   status: document.getElementById('status'),
//   download: document.getElementById('download'),
//   $: n => document.getElementById(n),
//   path: './models/CartoonGAN/web-uint8/model.json'
// }


// const runModel = async () => {
//   APP.model = await tf.loadGraphModel(APP.path)
//   // warm up
//   APP.model.predict(tf.zeros([1, 1, 1, 3])).dispose()
//   predict(APP.source)
//   APP.source.onload = () => {
//     setTimeout(() => {
//       APP.status.classList.remove('d-none')
//       APP.canvas.classList.add('d-none')
//       APP.canvas.classList.remove('d-block')
//     }, 0)
//     setTimeout(() => { predict(APP.source) }, 50)
//   }
// }

// async function predict(imgElement) {
//   let img = tf.browser.fromPixels(imgElement)
//   const shape = img.shape
//   const [w, h] = shape
//   img = normalize(img)
//   const t0 = performance.now()
//   const result = await APP.model.predict({ 'input_photo:0': img })
//   const timer = performance.now() - t0
//   let img_out = await result.squeeze().sub(tf.scalar(-1)).div(tf.scalar(2)).clipByValue(0, 1)
//   const pad = Math.round(Math.abs(w - h) / Math.max(w, h) * APP.size)
//   const slice = (w > h) ? [0, pad, 0] : [pad, 0, 0]
//   img_out = img_out.slice(slice)
//   draw(img_out, shape)
//   console.log(Math.round(timer / 1000 * 10) / 10)
// }

// function normalize(img) {
//   const [w, h] = img.shape
//   // pad
//   const pad = (w > h) ? [[0, 0], [w - h, 0], [0, 0]] : [[h - w, 0], [0, 0], [0, 0]]
//   img = img.pad(pad)
//   const size = APP.size
//   img = tf.image.resizeBilinear(img, [size, size]).reshape([1, size, size, 3])
//   const offset = tf.scalar(127.5)
//   return img.sub(offset).div(offset)
// }

// function draw(img, size) {
//   const scaleby = size[0] / img.shape[0]
//   tf.browser.toPixels(img, APP.canvas)
//   APP.canvas.classList.remove('d-none')
//   APP.canvas.classList.add('d-block')
//   APP.status.classList.add('d-none')
//   setTimeout(() => scaleCanvas(scaleby), 50)
// }

// function scaleCanvas(pct=2) {
//   const canvas = APP.$('result')
//   const tmpcan = document.createElement('canvas')
//   const tctx = tmpcan.getContext('2d')
//   const cw = canvas.width
//   const ch = canvas.height
//   tmpcan.width = cw
//   tmpcan.height = ch
//   tctx.drawImage(canvas, 0, 0)
//   canvas.width *= pct
//   canvas.height *= pct
//   const ctx = canvas.getContext('2d')
//   ctx.drawImage(tmpcan, 0, 0, cw, ch, 0, 0, cw*pct, ch*pct)
//   APP.download.href = canvas.toDataURL('image/jpeg')
// }

// document.getElementById('videoElement').addEventListener('play', function () {
//   var $this = this; //cache
//   (function loop() {
//       if (!$this.paused && !$this.ended) {
//         APP.canvas.getContext('2d').drawImage($this, 0, 0);
//           setTimeout(loop, 1000 / 30); // drawing at 30fps
//       }
//   })();
// }, 0);

// // document.getElementById('file').addEventListener('change', evt => {
// //   evt.target.files.forEach(f => {
// //     if (!f.type.match('image.*')) { return }
// //     let reader = new FileReader()
// //     reader.onload = e => { APP.source.src = e.target.result }
// //     reader.readAsDataURL(f)
// //   })
// //   evt.target.value = null
// // })

// // document.querySelectorAll('#examples img').forEach(
// //   img => img.addEventListener('click', evt => { APP.source.src = img.src })
// // )
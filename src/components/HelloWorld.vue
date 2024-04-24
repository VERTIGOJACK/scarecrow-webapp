<script setup lang="ts">
  import { ref, onMounted } from "vue";
  import CameraHelper from "../Functions/CameraHelper";
  import audioFile from "../assets/birdsound.mp3";

  const msg = ref("");
  const videoTag = ref<HTMLVideoElement | null>(null);
  const canvas = ref<CanvasRenderingContext2D | null>(null);
  const audio = ref(new Audio(audioFile));
  const deviceList = ref<MediaDeviceInfo[]>([]);
  const cameraHelper = new CameraHelper();

  var sample_size = 5;
  var w = 300;
  var h = 150;
  // make an array to hold our old pixel values
  var previous_frame = [];
  // choose a brightness threshold, if the old pixel values differs enough then we know there's movement
  var threshold = 50;

  const drawCanvas = () => {
    if (canvas.value && videoTag != null) {
      // draw video onto screen
      canvas.value.drawImage(videoTag.value, 0, 0, w, h);
      // get the screen's pixels data
      var data = canvas.value.getImageData(0, 0, w, h).data;
      // loop through rows and columns
      for (var y = 0; y < h; y += sample_size) {
        for (var x = 0; x < w; x += sample_size) {
          // the data array is a continuous array of red, blue, green
          // and alpha values, so each pixel takes up four values
          // in the array
          var pos = (x + y * w) * 4;

          // get red, blue and green pixel value
          var r = data[pos];
          var g = data[pos + 1];
          var b = data[pos + 2];
          // draw the pixels as blocks of colours
          {
            canvas.value.fillStyle = `rgb(${r},${g},${b})`;
            canvas.value.fillRect(x, y, sample_size, sample_size);
          }
          if (
            previous_frame[pos] &&
            Math.abs(previous_frame[pos] - r) > threshold
          ) {
            canvas.value.fillStyle = `rgb(${255},${0},${0})`;
            canvas.value.fillRect(x, y, sample_size, sample_size);
            if (audio.value.paused) {
              audio.value.play();
              console.log(audio.value.paused);
            }
          }
          // store these colour values to compare to the next frame
          previous_frame[pos] = r;
        }
      }
    }
    window.requestAnimationFrame(drawCanvas);
  };

  onMounted(async () => {
    await cameraHelper.setupAsync();
    if (videoTag.value != null) {
      videoTag.value.srcObject = cameraHelper.stream;
      deviceList.value = cameraHelper.devices;
      console.log(cameraHelper.devices);
    }
    audio.value.currentTime = 0;
    audio.value.pause();

    audio.value.addEventListener("ended", function () {
      audio.value.currentTime = 0;
      audio.value.pause();
    });

    const c = document.getElementById("canvas");
    const ctx = c.getContext("2d");
    canvas.value = ctx;
    drawCanvas();
  });

  const updateCamera = async (deviceId: number) => {
    if (videoTag.value != null) {
      console.log(deviceId);
      await cameraHelper.specifyDeviceID(deviceId);
      videoTag.value.srcObject = cameraHelper.stream;
    }
  };
</script>

<template>
  <div class="vertical-layout">
    <p>{{ msg }}</p>
    <video ref="videoTag" autoplay></video>
    <canvas id="canvas"></canvas>
    <select @input="async (event) => await updateCamera(event.target.value)">
      <option
        v-for="device in deviceList"
        :label="device.label"
        :value="device.deviceId"></option>
    </select>
  </div>
</template>

<style scoped>
  .vertical-layout {
    display: flex;
    flex-direction: column;
  }
  .horizontal-layout {
    display: flex;
    flex-direction: row;
  }
  video {
    width: 200px;
  }
  canvas {
    width: 500px;
  }
  .logo {
    height: 6em;
    padding: 1.5em;
    will-change: filter;
    transition: filter 300ms;
  }
  .logo:hover {
    filter: drop-shadow(0 0 2em #646cffaa);
  }
  .logo.vue:hover {
    filter: drop-shadow(0 0 2em #42b883aa);
  }
</style>

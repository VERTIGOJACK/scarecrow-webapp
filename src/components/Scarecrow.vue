<script setup lang="ts">
  import { ref, onMounted } from "vue";
  import CameraHelper from "../Functions/CameraHelper";
  import audioFile from "../assets/birdsound.mp3";
  import MotionDetection from "../Functions/MotionDetection";

  const video = ref<HTMLVideoElement | null>(null);
  const canvas = ref<HTMLCanvasElement | null>(null);
  const audio = ref(new Audio(audioFile));
  const deviceList = ref<MediaDeviceInfo[]>([]);
  const cameraHelper = new CameraHelper();
  const motionDetection = new MotionDetection();

  const fps = ref<number>(0);
  const threshold = ref<number>(0);
  const sensitivity = ref<number>(0);

  const setFps = (number: number) => {
    if (number > 60) {
      fps.value = 60;
    } else if (number <= 0 || undefined || null) {
      fps.value = 0;
    } else {
      fps.value = number;
    }
  };

  const setThreshold = () => {
    motionDetection.threshold = threshold.value;
  };

  const setSensitivity = () => {
    motionDetection.sensitivity = sensitivity.value;
  };

  const drawLoop = () => {
    setTimeout(function () {
      requestAnimationFrame(drawLoop);
      if (canvas.value != null && video.value != null) {
        motionDetection.drawVideoOnCanvas(
          video.value,
          canvas.value.getContext("2d")!,
          audio.value
        );
      }
    }, 1000 / fps.value);
  };

  onMounted(async () => {
    //set up cameras and video feed
    await cameraHelper.setupAsync();
    if (video.value != null) {
      video.value.srcObject = cameraHelper.stream;
      deviceList.value = cameraHelper.devices;
    }

    //get canvas dimensions
    if (canvas.value) {
      motionDetection.setCanvasDimensions(
        canvas.value.width,
        canvas.value.height
      );
    }

    //set up ref initial values
    fps.value = 10;
    threshold.value = motionDetection.threshold;
    sensitivity.value = motionDetection.sensitivity;

    //prepare audio for first run
    audio.value.currentTime = 0;
    audio.value.pause();

    // run on audio finished playing
    audio.value.addEventListener("ended", function () {
      audio.value.currentTime = 0;
      audio.value.pause();
    });

    //start animation loop
    drawLoop();
  });

  const updateCamera = async (deviceId: number) => {
    if (video.value != null) {
      await cameraHelper.specifyDeviceID(deviceId);
      video.value.srcObject = cameraHelper.stream;
    }
  };
</script>

<template>
  <div class="vertical-layout">
    <video ref="video" autoplay hidden></video>
    <canvas ref="canvas"></canvas>
    <select
      @input="async (event: any) => await updateCamera(event.target.value)">
      <option
        v-for="device in deviceList"
        :label="device.label"
        :value="device.deviceId"></option>
    </select>
    <div class="vertical-layout">
      <label>
        Fps
        <input
          type="number"
          v-model="fps"
          @input="(event: any) => setFps(event.target.value)" />
      </label>
      <label>
        Threshold: {{ threshold }}
        <input
          type="range"
          v-model="threshold"
          min="0"
          max="255"
          @input="setThreshold()" />
      </label>
      <label>
        Sensitivity:
        <input
          type="number"
          v-model="sensitivity"
          min="0"
          max="255"
          @input="setSensitivity()" />
      </label>
    </div>
  </div>
</template>

<style scoped>
  .vertical-layout {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 1em;
  }
  .horizontal-layout {
    display: flex;
    flex-direction: row;
  }
  canvas {
    width: 100%;
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
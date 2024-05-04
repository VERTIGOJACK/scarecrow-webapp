<script setup lang="ts"></script>

<template>
  <div id="root">
    <div class="spinner-container">
      <div class="bubble-container n1">
        <div class="bubble-wrapper">
          <div class="bubble n1"></div>
        </div>
      </div>
      <div class="bubble-container n2">
        <div class="bubble-wrapper">
          <div class="bubble n2"></div>
        </div>
      </div>
      <div class="bubble-container n3">
        <div class="bubble-wrapper">
          <div class="bubble n3"></div>
        </div>
      </div>
      <div class="bubble-container n4">
        <div class="bubble-wrapper">
          <div class="bubble n4"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  #root {
    --startcolor: var(--accent-1);
    --midcolor: var(--accent-2);
    --endcolor: var(--accent-3);
    --size: var(--lengths-lg-1);
    --speed: 1s;
    --delay: calc(var(--speed) / 4);
  }

  #root * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  .spinner-container {
    position: relative;
    width: var(--size);
    aspect-ratio: 1/1;
    animation: rotateSpinner var(--speed) ease-in-out infinite;
  }
  .bubble-container {
    position: absolute;
    width: 100%;
    aspect-ratio: 1/1;
  }
  .bubble-wrapper {
    position: absolute;
    width: 25%;
    height: 25%;
    animation: bubbleMove calc(var(--speed) * 2) infinite ease-in-out;
  }

  .bubble {
    background-color: var(--startcolor);
    width: 100%;
    height: 100%;
    border-radius: 100%;
    animation: bubbleGrow calc(var(--speed) * 3) ease-in-out infinite;
  }

  .bubble-container.n2 {
    transform: rotate(90deg);
  }
  .bubble-container.n3 {
    transform: rotate(180deg);
  }
  .bubble-container.n4 {
    transform: rotate(270deg);
  }

  .bubble.n2 {
    animation-delay: var(--delay);
  }
  .bubble.n3 {
    animation-delay: calc(var(--delay) * 2);
  }
  .bubble.n4 {
    animation-delay: calc(var(--delay) * 3);
  }

  @keyframes bubbleMove {
    0% {
      transform: translatex(150%) translatey(0%);
    }
    25% {
      transform: translateX(0%) translateY(150%);
    }
    50% {
      transform: translateX(150%) translateY(50%);
    }
    75% {
      transform: translateX(0%) translateY(150%);
    }
    100% {
      transform: translateX(150%) translateY(0%);
    }
  }

  @keyframes bubbleGrow {
    0% {
      transform: scale(1);
      background-color: var(--startcolor);
    }
    25% {
      background-color: var(--midcolor);
    }
    50% {
      transform: scale(0.8);
      background-color: var(--endcolor);
    }
    75% {
      background-color: var(--midcolor);
    }
    100% {
      transform: scale(1);
      background-color: var(--startcolor);
    }
  }

  @keyframes rotateSpinner {
    0% {
      transform: rotatez(0deg);
    }
    100% {
      transform: rotatez(360deg);
    }
  }
</style>

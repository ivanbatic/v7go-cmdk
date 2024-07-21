<template>
  <div class="progress-bar w-full h-0.5 opacity-25"></div>
</template>

<style scoped>
.progress-bar {
  background: linear-gradient(90deg, #ffc707, #ff206e, #b043ff, #009dff, #ffd33d, #ea4aaa, #b34bff);
  background-size: 300% 100%;
  animation: progress-animation 1s linear infinite;
}

@keyframes progress-animation {
  0% {
    background-position: 100%;
  }
  100% {
    background-position: 0;
  }
}
</style>

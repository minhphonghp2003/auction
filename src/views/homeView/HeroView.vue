<script setup>
// import dynamics from 'dynamics.js'
</script>
  
  <template>
  <header>
    <video
      autoplay
      playsinline
      muted
      loop
      preload

    >
      <source
        src="/src/assets/img/auction1.webm"
      />
     
    </video>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 285 80"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <mask id="mask" x="0" y="0" width="100%" height="100%">
          <rect x="0" y="0" width="100%" height="100%" />
          <text x="72" y="50">Bid_it.</text>
        </mask>
      </defs>
      <rect x="0" y="0" width="100%" height="100%" />
    </svg>
  </header>
</template>
  
  <style scoped>
@font-face {
  font-family: Biko;
  src: url("https://s3-us-west-2.amazonaws.com/s.cdpn.io/4273/biko-black.woff");
}
body {
  background: white;
  margin: 2rem;
}
header {
  width: 100%;
  margin: 0 auto;
  position: relative;
  max-width: 1200px;
}
header video {
  width: 100%;
}
svg {
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
}
svg text {
  font-family: Biko, sans-serif;
  font-weight: 700;
  text-transform: uppercase;
  font-size: 38px;
}
svg rect {
  fill: white;
}
svg > rect {
  -webkit-mask: url(#mask);
  mask: url(#mask);
}
</style>
  
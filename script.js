let count = 0;

function addToCart(){
  count++;
  document.getElementById("cart-count").innerText = count;
  alert("Book Added to Cart");
}

// Hero Background Video Logic
document.addEventListener('DOMContentLoaded', () => {
  const bgVideo = document.getElementById('hero-bg-video');
  if (bgVideo) {
    const videos = ['bgvideo1.mp4', 'bgvideo2.mp4'];
    let currentVideo = 0;
    
    // Set initial playback rate to slow motion (e.g. 0.5x speed)
    bgVideo.playbackRate = 0.5;
    
    // Attempt to play immediately (sometimes needed depending on browser policy)
    bgVideo.play().catch(e => console.log("Autoplay prevented:", e));

    // When the current video ends, switch to the next one
    bgVideo.addEventListener('ended', () => {
      currentVideo = (currentVideo + 1) % videos.length;
      bgVideo.src = videos[currentVideo];
      bgVideo.play();
      bgVideo.playbackRate = 0.5; // re-apply slow motion on new src
    });
  }
});
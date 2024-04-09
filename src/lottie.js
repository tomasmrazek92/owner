class DotLottieConfigurator {
  constructor(configurations) {
    this.configurations = configurations;
    this.init();
  }

  init() {
    this.configurations.forEach((config) => {
      const parentElement = config.target;
      const { properties, src, threshold = 0.5, onReady, onError } = config;
      const player = $(parentElement).find('dotlottie-player')[0];
      if (!player) {
        console.log('DotLottie player not found within the specified target.');
        return;
      }

      // Assuming you want to add event listeners for loaded and error events
      if (onReady) {
        player.addEventListener('ready', onLoaded);
      }

      if (onError) {
        player.addEventListener('error', onError);
      }

      if (src) {
        player
          .load(src, null, properties)
          .then(() => {
            player.playOnShow({ threshold });
            // If you need to emit a custom event after loading, you can do it here
          })
          .catch((error) => {
            console.error('Error loading animation:', error);
            // Emitting or handling error event if provided
            if (onError) {
              onError(error);
            }
          });
      }
    });
  }
}

// Make DotLottieConfigurator globally available
window.DotLottieConfigurator = DotLottieConfigurator;

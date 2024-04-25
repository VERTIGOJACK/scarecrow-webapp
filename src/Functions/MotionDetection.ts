class MotionDetection {
  public sampleSize = 5;
  public threshold = 60;
  public sensitivity = 20;

  private width = 300;
  private height = 150;
  private motionSamplesCount = 0;

  private previousFrame: number[] = [];

  private RGBAverage(r: number, g: number, b: number) {
    return (r + g + b) / 3;
  }

  public setCanvasDimensions(width: number, height: number) {
    this.width = width;
    this.height = height;
  }

  public drawVideoOnCanvas = (
    video: HTMLVideoElement,
    ctx: CanvasRenderingContext2D,
    audio: HTMLAudioElement
  ) => {
    // draw video onto canvas
    ctx.drawImage(video, 0, 0, this.width, this.height);
    // get the canvas pixels data
    const data = ctx.getImageData(0, 0, this.width, this.height).data;
    // nested for loop, rows and columns

    for (var y = 0; y < this.height; y += this.sampleSize) {
      for (var x = 0; x < this.width; x += this.sampleSize) {
        // the data array is a continuous array of red, blue, green
        // and alpha values, so each pixel takes up four values
        // in the array. multiplying y with width flattens the array
        // 10x + (1y*300w)
        var pos = (x + y * this.width) * 4;

        // get red, blue and green pixel value
        var r = data[pos];
        var g = data[pos + 1];
        var b = data[pos + 2];

        // draw the pixels as blocks of colours, if difference from last frame bigger than threshold,
        // draw pixel as red color and play sound, otherwise draw normally
        if (
          this.previousFrame[pos] &&
          Math.abs(this.previousFrame[pos] - this.RGBAverage(r, g, b)) >
            this.threshold
        ) {
          ctx.fillStyle = `rgb(${255},${0},${0})`;
          ctx.fillRect(x, y, this.sampleSize, this.sampleSize);
          this.motionSamplesCount++;
        } else {
          {
            ctx.fillStyle = `rgb(${r},${g},${b})`;
            ctx.fillRect(x, y, this.sampleSize, this.sampleSize);
          }
        }
        // store all these colour values to compare to the next frame
        this.previousFrame[pos] = (r + g + b) / 3;
      }
    }
    if (this.motionSamplesCount > this.sensitivity && audio.paused) {
      audio.play();
    }
    this.motionSamplesCount = 0;
  };
}

export default MotionDetection;

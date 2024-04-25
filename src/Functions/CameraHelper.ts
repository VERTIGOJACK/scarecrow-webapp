class CameraHelper {
  public constraints: MediaStreamConstraints | any;
  public devices: MediaDeviceInfo[] = [];
  public stream: MediaStream = new MediaStream();
  private isFacingEnviroment = true;

  public constructor() {
    this.constraints = this.getDefaultMediaStreamConstraints();
  }

  public setupAsync = async () => {
    if (this.checkCompatibility()) {
      this.constraints = this.getDefaultMediaStreamConstraints();
      await this.getCameraList();
      await this.getStream();
    }
  };

  //get default constraints
  private getDefaultMediaStreamConstraints = () => {
    const constraints = {
      video: {
        width: { min: 1280, max: 1920 },
        height: { min: 720, max: 1080 },
      },
    };
    return constraints;
  };

  //return list of videoinputdevices
  private getCameraList = async () => {
    //get all devices
    const devices = await navigator.mediaDevices.enumerateDevices();
    //filter all devices into those recognized as videoinput
    const videoDevices = devices.filter(
      (device) => device.kind === "videoinput"
    );
    //return list
    this.devices = videoDevices;
  };

  public specifyDeviceID = async (deviceId: number) => {
    if (this.constraints.video.deviceId) {
      this.constraints.video.deviceId.exact = deviceId;
    } else {
      this.constraints = {
        video: {
          ...this.constraints.video,
          deviceId: {
            exact: deviceId,
          },
        },
      };
    }
    await this.getStream();
  };

  public changeFacingDirection = async () => {
    if (this.isFacingEnviroment) {
      this.constraints.video.facingMode.exact = "user";
    } else {
      this.constraints.video.facingMode.exact = "environment";
    }
    await this.getStream();
  };

  //assign media stream
  private getStream = async () => {
    const stream = await navigator.mediaDevices.getUserMedia(this.constraints);
    this.stream = stream;
  };

  //checks for compatibility with getusermedia API
  private checkCompatibility = (): boolean => {
    if (
      "mediaDevices" in navigator &&
      "getUserMedia" in navigator.mediaDevices
    ) {
      return true;
    } else {
      return false;
    }
  };
}

export default CameraHelper;

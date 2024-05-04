import { isMobileClient } from "./DetectMobileBrowsers";

class CameraHelper {
  public constraints: MediaStreamConstraints = { video: {} };
  public devices: MediaDeviceInfo[] = [];
  public stream: MediaStream = new MediaStream();

  private supportedConstraints: MediaTrackSupportedConstraints;
  private mobileClient = false;
  private isFacingUser = false;

  public constructor() {
    //read all supported constraints for video
    //check if on mobile client
    //then get default options
    this.supportedConstraints = navigator.mediaDevices.getSupportedConstraints();
    this.mobileClient = isMobileClient();
    this.constraints.video = this.getDefaultMediaStreamConstraints();
  }

  //get default constraints
  private getDefaultMediaStreamConstraints = (): MediaTrackConstraints => {
    const videoConstraints: MediaTrackConstraints = {
      width: { min: 1280, max: 1920 },
      height: { min: 720, max: 1080 },
    };

    // if on mobile and supported, add facingMode
    if (this.mobileClient && this.supportedConstraints.facingMode) {
      videoConstraints.facingMode = { exact: "environment" };
    }

    return videoConstraints;
  };

  public setupAsync = async () => {
    if (this.checkCompatibility()) {
      //getting stream involves permissions, hence comes first
      await this.getStream();
      await this.getCameraList();
    }
  };

  //get permissions and assign media stream
  private getStream = async () => {
    const stream = await navigator.mediaDevices.getUserMedia(this.constraints);
    this.stream = stream;
  };

  //return list of videoinputdevices
  private getCameraList = async () => {
    //get all devices
    const devices = await navigator.mediaDevices.enumerateDevices();
    //filter all devices into those recognized as videoinput
    const videoDevices = devices.filter((device) => device.kind === "videoinput");
    //return list
    this.devices = videoDevices;
  };

  public specifyDeviceID = async (deviceId: number) => {
    if (typeof this.constraints.video !== "boolean") {
      let videoConstraints: MediaTrackConstraints = this.constraints.video!;
      videoConstraints.deviceId = { exact: deviceId.toString() };
      this.constraints.video = videoConstraints;
    }
    await this.getStream();
  };

  public changeFacingDirection = async () => {
    //type, null, and support checking
    if (typeof this.constraints.video !== "boolean" && this.supportedConstraints.facingMode) {
      //treat as interface
      let videoConstraints: MediaTrackConstraints = this.constraints.video!;
      //toggle
      this.isFacingUser = !this.isFacingUser;
      const direction = this.isFacingUser ? "user" : "environment";
      //assign
      videoConstraints.facingMode = direction;
      this.constraints.video = videoConstraints;
    }
    await this.getStream();
  };

  //checks for compatibility with getusermedia API
  private checkCompatibility = (): boolean => {
    return "mediaDevices" in navigator && "getUserMedia" in navigator.mediaDevices ? true : false;
  };
}

export default CameraHelper;

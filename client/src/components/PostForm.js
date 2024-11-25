import React, { PureComponent } from "react";
import "react-image-crop/dist/ReactCrop.css";
import { Button } from "semantic-ui-react";
import { postActions } from "../actions/postActions";
import { connect } from "react-redux";
import getCroppedImg from "../reusable/cropImage";
import Cropper from "react-easy-crop";

const imageMaxSize = 10485760; // bytes 10MB
const acceptedFileTypes =
  "image/x-png, image/png, image/jpg, image/jpeg, image/gif";
const acceptedFileTypesArray = acceptedFileTypes.split(",").map((item) => {
  return item.trim();
});

class PostForm extends PureComponent {
  imagePreviewCanvasRef = React.createRef();
  fileInputRef = React.createRef();
  state = {
    selectedFile: null,
    crop: { x: 0, y: 0 },
    zoom: 1,
    croppedImage: null,
    aspect: 16 / 9,
    openAspect: false,
    photo: null,
  };
  //<canvas ref={this.imagePreviewCanvasRef} />
  componentDidMount = () => {
    const { dispatch } = this.props;
    dispatch(postActions.canvasHasValue(false));
  };

  handleNextClick = () => {
    const { croppedImage } = this.state;
    const { dispatch } = this.props;
    if (croppedImage) {
      const fd = new FormData();
      fd.append("photo", croppedImage);
    }
    dispatch({ type: "NEXT_PAGE" });
  };

  handleChangeImage = () => {
    this.fileInputRef.current.click();
  };

  handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.setState({
          photo: e.target.result,
          selectedFile: file,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  onCropChange = (crop) => {
    this.setState({ crop });
  };

  onCropComplete = async (croppedArea, croppedAreaPixels) => {
    const { photo } = this.state;
    const { dispatch } = this.props;
    try {
      const croppedImage = await getCroppedImg(photo, croppedAreaPixels);
      this.setState({ croppedImage: croppedImage });
      dispatch(postActions.canvasHasValue(true));
      dispatch(postActions.getCroppedSrc(croppedImage));
    } catch (e) {
      console.error(e);
    }
  };

  onZoomChange = (zoom) => {
    this.setState({ zoom });
  };

  changeAspect = (e) => {
    e.preventDefault();
    if (e.target.name === "1:1") {
      this.setState({ aspect: 1 });
    } else {
      this.setState({ aspect: 16 / 9 });
    }
  };

  toggleAspectOptions = (e) => {
    e.preventDefault();
    this.setState((prevState) => ({ openAspect: !prevState.openAspect }));
  };

  resetReducer = () => {
    const { dispatch } = this.props;
    dispatch({ type: "RESET_IMAGE" });
  };
  render() {
    const { photo } = this.state;
    return (
      <div className="post-crop max-w-[600px] mx-auto flex items-center justify-center">
        {photo !== null ? (
          <div className="relative">
            <h1 className="mb-4 text-[14px] md:text-[16px] font-medium text-center">
              {`<Crop your image>`}
            </h1>
            <div className="">
              <div className="absolute bottom-4 right-2 z-40">
                <label className="ui massive fluid icon button !bg-white hover:!bg-gray-300 !w-10 !h-10 !flex !items-center !justify-center">
                  <span>
                    <i className="fa-solid fa-rotate-left"></i>
                  </span>
                  <input
                    style={{ display: "none" }}
                    ref={this.fileInputRef}
                    type="file"
                    accept={acceptedFileTypes}
                    multiple={false}
                    onChange={this.handleFileChange}
                  />
                </label>
              </div>
              <div className="absolute bottom-4 left-4 z-40">
                <button
                  onClick={this.toggleAspectOptions}
                  className="bg-white hover:bg-gray-300  flex items-center justify-center w-10 h-10 rounded-full"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="size-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15"
                    />
                  </svg>
                </button>

                {this.state.openAspect && (
                  <ul className="mb-2 absolute bottom-full text-[12px] md:text[14px] left-0 w-[80px] bg-black rounded-lg opacity-80 text-white flex flex-col">
                    <Button
                      className="!m-0 !py-3 !flex !items-center !justify-center !p-0 gap-x-2 !bg-transparent !text-white hover:!bg-gray-300 hover:!text-black"
                      name="1:1"
                      onClick={this.changeAspect}
                      size="massive"
                    >
                      1:1
                    </Button>
                    <Button
                      className="!m-0 !py-3 !flex !items-center !justify-center !p-0 gap-x-2 !bg-transparent !text-white hover:!bg-gray-300 hover:!text-black"
                      name="16:9"
                      onClick={this.changeAspect}
                      size="massive"
                    >
                      16:9
                    </Button>
                  </ul>
                )}
              </div>
              <div className="absolute top-14 right-1 z-40">
                <Button
                  className="!py-2 !px-4 !w-11 !rounded-full !flex !items-center !justify-center hover:!bg-gray-300 !bg-white !text-black"
                  onClick={this.resetReducer}
                  size="massive"
                >
                  <i className="fa-solid fa-xmark"></i>
                </Button>
              </div>
            </div>

            <img
              src={this.state.photo}
              alt="Preview"
              style={{
                maxWidth: "100%",
                height: "auto",
                opacity: "0",
              }}
            />
            <Cropper
              image={this.state.photo}
              crop={this.state.crop}
              zoom={this.state.zoom}
              aspect={this.state.aspect}
              onCropChange={this.onCropChange}
              onCropComplete={this.onCropComplete}
              onZoomChange={this.onZoomChange}
              style={{ maxWidth: "100%", height: "auto" }}
            />

            {this.state.croppedImage ? (
              <Button
                className="!absolute top-0 !m-2 !text-[#591bc5] right-0 !w-[46px] !flex !bg-white !rounded-lg !items-center !justify-center"
                size="huge"
                fluid
                onClick={this.handleNextClick}
              >
                Next
              </Button>
            ) : null}
          </div>
        ) : (
          <div>
            <label className="ui massive fluid icon button !bg-white">
              <div className="flex flex-col items-center justify-center">
                <span className="">
                  <svg
                    aria-label="Icon to represent media such as images or videos"
                    className="x1lliihq x1n2onr6 x5n08af"
                    fill="currentColor"
                    height="77"
                    role="img"
                    viewBox="0 0 97.6 77.3"
                    width="96"
                  >
                    <title>
                      Icon to represent media such as images or videos
                    </title>
                    <path
                      d="M16.3 24h.3c2.8-.2 4.9-2.6 4.8-5.4-.2-2.8-2.6-4.9-5.4-4.8s-4.9 2.6-4.8 5.4c.1 2.7 2.4 4.8 5.1 4.8zm-2.4-7.2c.5-.6 1.3-1 2.1-1h.2c1.7 0 3.1 1.4 3.1 3.1 0 1.7-1.4 3.1-3.1 3.1-1.7 0-3.1-1.4-3.1-3.1 0-.8.3-1.5.8-2.1z"
                      fill="currentColor"
                    ></path>
                    <path
                      d="M84.7 18.4 58 16.9l-.2-3c-.3-5.7-5.2-10.1-11-9.8L12.9 6c-5.7.3-10.1 5.3-9.8 11L5 51v.8c.7 5.2 5.1 9.1 10.3 9.1h.6l21.7-1.2v.6c-.3 5.7 4 10.7 9.8 11l34 2h.6c5.5 0 10.1-4.3 10.4-9.8l2-34c.4-5.8-4-10.7-9.7-11.1zM7.2 10.8C8.7 9.1 10.8 8.1 13 8l34-1.9c4.6-.3 8.6 3.3 8.9 7.9l.2 2.8-5.3-.3c-5.7-.3-10.7 4-11 9.8l-.6 9.5-9.5 10.7c-.2.3-.6.4-1 .5-.4 0-.7-.1-1-.4l-7.8-7c-1.4-1.3-3.5-1.1-4.8.3L7 49 5.2 17c-.2-2.3.6-4.5 2-6.2zm8.7 48c-4.3.2-8.1-2.8-8.8-7.1l9.4-10.5c.2-.3.6-.4 1-.5.4 0 .7.1 1 .4l7.8 7c.7.6 1.6.9 2.5.9.9 0 1.7-.5 2.3-1.1l7.8-8.8-1.1 18.6-21.9 1.1zm76.5-29.5-2 34c-.3 4.6-4.3 8.2-8.9 7.9l-34-2c-4.6-.3-8.2-4.3-7.9-8.9l2-34c.3-4.4 3.9-7.9 8.4-7.9h.5l34 2c4.7.3 8.2 4.3 7.9 8.9z"
                      fill="currentColor"
                    ></path>
                    <path
                      d="M78.2 41.6 61.3 30.5c-2.1-1.4-4.9-.8-6.2 1.3-.4.7-.7 1.4-.7 2.2l-1.2 20.1c-.1 2.5 1.7 4.6 4.2 4.8h.3c.7 0 1.4-.2 2-.5l18-9c2.2-1.1 3.1-3.8 2-6-.4-.7-.9-1.3-1.5-1.8zm-1.4 6-18 9c-.4.2-.8.3-1.3.3-.4 0-.9-.2-1.2-.4-.7-.5-1.2-1.3-1.1-2.2l1.2-20.1c.1-.9.6-1.7 1.4-2.1.8-.4 1.7-.3 2.5.1L77 43.3c1.2.8 1.5 2.3.7 3.4-.2.4-.5.7-.9.9z"
                      fill="currentColor"
                    ></path>
                  </svg>
                </span>
                <span className="bg-[#591bc5] mt-4 text-white font-medium py-3 px-5 rounded-lg select-img">
                  Select from computer
                </span>
              </div>
              <input
                style={{ display: "none" }}
                ref={this.fileInputRef}
                type="file"
                accept={acceptedFileTypes}
                multiple={false}
                onChange={this.handleFileChange}
              />
            </label>
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  // logged in user username
  post: state.postUpload,
});

export default connect(mapStateToProps)(PostForm);

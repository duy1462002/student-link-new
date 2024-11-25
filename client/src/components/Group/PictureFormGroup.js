import React, { PureComponent } from "react";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import {
  image64toCanvasRef,
  extractImageFileExtensionFromBase64,
  base64StringtoFile,
} from "../../reusable/ReusableUtils";
import { Button } from "semantic-ui-react";

const imageMaxSize = 10000000; // bytes
const acceptedFileTypes =
  "image/x-png, image/png, image/jpg, image/jpeg, image/gif";
const acceptedFileTypesArray = acceptedFileTypes
  .split(",")
  .map((item) => item.trim());

class PictureFormGroup extends PureComponent {
  imagePreviewCanvasRef = React.createRef();
  fileInputRef = React.createRef();
  state = {
    imgSrc: null,
    imgSrcExt: null,
    crop: { aspect: 1 },
    cropped: false,
  };

  handleOnCropChange = (crop) => this.setState({ crop });

  handleOnCropComplete = (crop, pixelCrop) => {
    const canvasRef = this.imagePreviewCanvasRef.current;
    const { imgSrc } = this.state;
    image64toCanvasRef(canvasRef, imgSrc, pixelCrop);
    this.setState({ cropped: true });
  };

  handleFileSelect = (event) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const currentFile = files[0];
      if (this.verifyFile(currentFile)) {
        const reader = new FileReader();
        reader.onloadend = () => {
          const result = reader.result;
          this.setState({
            imgSrc: result,
            imgSrcExt: extractImageFileExtensionFromBase64(result),
          });
        };
        reader.readAsDataURL(currentFile);
      }
    }
  };

  verifyFile = (file) => {
    const { type, size } = file;
    if (!acceptedFileTypesArray.includes(type)) {
      alert("Tệp này không được phép. Chỉ cho phép hình ảnh.");
      return false;
    }
    if (size > imageMaxSize) {
      alert(`Tệp này quá lớn. ${size} bytes là quá lớn.`);
      return false;
    }
    return true;
  };

  handleUpload = () => {
    const { imgSrc, imgSrcExt } = this.state;
    if (imgSrc) {
      const canvasRef = this.imagePreviewCanvasRef.current;
      const imageData64 = canvasRef.toDataURL("image/" + imgSrcExt);
      const myFilename = "previewFile." + imgSrcExt;
      const myNewCroppedFile = base64StringtoFile(imageData64, myFilename);
      this.props.onImageUpload(myNewCroppedFile);
      this.setState({ imgSrc: null, imgSrcExt: null, cropped: false });
    }
  };

  render() {
    const { imgSrc, cropped } = this.state;
    return (
      <div>
        {imgSrc ? (
          <div>
            <ReactCrop
              src={imgSrc}
              crop={this.state.crop}
              onChange={this.handleOnCropChange}
              onComplete={this.handleOnCropComplete}
            />
            {cropped && (
              <Button primary fluid onClick={this.handleUpload}>
                Tải lên
              </Button>
            )}
            <canvas
              style={{ display: "none" }}
              ref={this.imagePreviewCanvasRef}
            />
          </div>
        ) : (
          <div>
            <label className="ui icon button fluid upload-profile-image py-8 m-0 text-sm font-medium text-blue-500">
              Tải lên ảnh
              <input
                style={{ display: "none" }}
                ref={this.fileInputRef}
                type="file"
                accept={acceptedFileTypes}
                onChange={this.handleFileSelect}
              />
            </label>
          </div>
        )}
      </div>
    );
  }
}

export default PictureFormGroup;

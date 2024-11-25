import React from "react";
import { ModalHeader, Modal } from "semantic-ui-react";
import { connect } from "react-redux";
import { groupActions } from "../../actions/groupActions";
import toast from "react-hot-toast";
import SpinnerLoading from "../SpinnerLoading";
import getCroppedImg from "../../reusable/cropImage";
import Cropper from "react-easy-crop";

function EditCoverModal({
  currentGroup,
  dispatch,
  coverImage,
  loadingCoverImage,
}) {
  const [open, setOpen] = React.useState(false);
  const [photo, setPhoto] = React.useState(null);
  const [file, setFile] = React.useState(null);
  const [crop, setCrop] = React.useState({ x: 0, y: 0 });
  const [zoom, setZoom] = React.useState(1);
  const [croppedImage, setCroppedImage] = React.useState(null);

  const fileInputRef = React.useRef(null);

  const MAX_FILE_SIZE = 10 * 1024 * 1024;

  const handleChangeImage = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        toast.error("File size exceeds 10MB. Please select a smaller file.");
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setPhoto(e.target.result);
        setFile(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadImage = () => {
    // Upload image to server
    if (file) {
      dispatch(
        groupActions.changeCover({ groupId: currentGroup._id, photo: croppedImage })
      );
    } else {
      toast.error("Please select a file to upload!");
    }
  };

  React.useEffect(() => {
    setOpen(false);
  }, [coverImage]);

  const onCropChange = (crop) => {
    setCrop(crop);
  };

  const onCropComplete = async (croppedArea, croppedAreaPixels) => {
    try {
      const croppedImage = await getCroppedImg(photo, croppedAreaPixels);
      setCroppedImage(croppedImage.file);
    } catch (e) {
      console.error(e);
    }
  };

  const onZoomChange = (zoom) => {
    setZoom(zoom);
  };
  console.log(croppedImage);
  return (
    <Modal
      closeIcon={false}
      size="small"
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      trigger={
        <button className="group-btn rounded-lg">
          <i className="fa-solid fa-pen-to-square"></i>
          Edit
        </button>
      }
    >
      <ModalHeader className="!text-[24px] text-center">
        Edit Cover Image
      </ModalHeader>
      <Modal.Content scrolling>
        <Modal.Description className="flex flex-col items-center">
          {photo ? (
            <div className="flex flex-col items-center">
                <div className="relative">
                  <Cropper
                    image={photo}
                    crop={crop}
                    zoom={zoom}
                    aspect={16 / 9}
                    onCropChange={onCropChange}
                    onCropComplete={onCropComplete}
                    onZoomChange={onZoomChange}
                    style={{ maxWidth: "100%", height: "auto" }}
                    classes={{ containerClassName: 'z-10' }}
                  />
                  <img src={photo} alt="" className="opacity-0"/>
                </div>

              <div className="flex items-center gap-4">
                <button
                  className="group-btn rounded-lg mt-6"
                  onClick={handleChangeImage}
                >
                  <i className="fa-solid fa-rotate"></i>
                  Change Image
                </button>

                <button
                  className="group-btn rounded-lg mt-6"
                  onClick={handleUploadImage}
                >
                  <i className="fa-solid fa-upload"></i>
                  {loadingCoverImage ? (
                    <SpinnerLoading size={60} bgColor="#591bc5" />
                  ) : (
                    "Upload Image"
                  )}
                </button>
              </div>
            </div>
          ) : (
            <label
              htmlFor="photo"
              style={{
                border: "1px solid #591bc5",
              }}
              className="flex flex-col w-full h-[140px] rounded-xl items-center justify-center cursor-pointer text-[#591bc5]"
            >
              <i className="fa-regular fa-image text-[32px]"></i>
              <h5>Choose image</h5>
            </label>
          )}

          <input
            id="photo"
            type="file"
            accept="image/*"
            hidden
            ref={fileInputRef}
            onChange={handleFileChange}
          />
        </Modal.Description>
      </Modal.Content>
    </Modal>
  );
}

const mapStateToProps = (state) => ({
  currentGroup: state.groups.currentGroup,
  coverImage: state.groups.coverImage,
  loadingCoverImage: state.groups.loadingCoverImage,
});

export default connect(mapStateToProps)(EditCoverModal);

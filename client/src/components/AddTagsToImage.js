import "mapbox-gl/dist/mapbox-gl.css";
import "react-map-gl-geocoder/dist/mapbox-gl-geocoder.css";
import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import uuid from "uuid";

import { Icon, Button } from "semantic-ui-react";

import { AutosuggestExample } from "./Autosuggestion";

class AddTagsToImage extends Component {
  state = {
    x: 50,
    y: 50,
    value: "",
    displayInput: "none",
    submitOnClick: false,
    open: true,
  };

  handleChange = (value) => {
    this.setState({ value, submitOnClick: false });
  };

  deleteTag = (e) => {
    const { dispatch } = this.props;
    dispatch({ type: "DELETE_IMAGE_TAG", id: e.target.id });
  };

  handleAddAutocompleteTag = (value) => {
    const { x, y } = this.state;
    const { dispatch } = this.props;
    if (value !== "") {
      dispatch({ type: "ADD_IMAGE_TAG", div: { x, y, value, id: uuid.v4() } });
      this.setState({
        displayInput: "none",
        submitOnClick: true,
      });
    }
  };

  handleAddTag = () => {
    const { x, y, value } = this.state;
    const { dispatch } = this.props;
    if (value !== "") {
      dispatch({ type: "ADD_IMAGE_TAG", div: { x, y, value, id: uuid.v4() } });
      this.setState({
        submitOnClick: true,
        displayInput: "none",
      });
    }
  };

  handleClick = (e) => {
    const x = Math.floor((e.nativeEvent.offsetX * 100) / e.target.width);
    const y = Math.floor((e.nativeEvent.offsetY * 100) / e.target.height);
    this.setState({ x, y, displayInput: "inline-block" });
  };
  render() {
    const { cropImgSrc, divs } = this.props;
    const { x, y, submitOnClick } = this.state;

    const renderDivs = divs.map((div) => (
      <div
        key={div.id}
        className="text-box"
        style={{ top: div.y + "%", left: div.x + "%" }}
      >
        <div className="tooltip tooltip-top">
          {div.value}
          <Icon
            id={div.id}
            onClick={this.deleteTag}
            style={{ cursor: "pointer", marginLeft: "2px", color: "red" }}
            name="close"
          />
        </div>
      </div>
    ));
    return (
      <Fragment>
        <div className="add-image-tags ">
          <div className="text-box" style={{ top: y + "%", left: x + "%" }}>
            <div className="tooltip tooltip-top !w-[300px]">
              <div className="add-tag-input !rounded-lg">
                <AutosuggestExample
                  addTagPage={true}
                  submitOnClick={submitOnClick}
                  handleChange={this.handleChange}
                  addAutocompleteTag={this.handleAddAutocompleteTag}
                />
                <Button onClick={this.handleAddTag}>Add</Button>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <img
              className="mt-7 max-w-full h-auto"
              alt=""
              onClick={this.handleClick}
              src={cropImgSrc}
            />
          </div>
          {renderDivs}
        </div>
      </Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  divs: state.postUpload.divs,
});

const connectedAddTagsToImage = connect(mapStateToProps)(AddTagsToImage);
export { connectedAddTagsToImage as AddTagsToImage };

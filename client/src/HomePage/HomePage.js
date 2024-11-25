import React, { Component } from "react";
import { connect } from "react-redux";
import Feed from "../components/Post/Feed";
import { NewUsersList } from "../components/NewUsersLIst";

class HomePage extends Component {
  componentDidMount = () => {
    document.title = "social-network";
  };

  render() {
    return (
      <div id="homepage-container" className="flex flex-row-reverse">
        <div id="left-container" className="shadow-lg border card-border-primary overflow-hidden">
          <NewUsersList></NewUsersList>
        </div>

        <div id="right" style={{marginRight: '23.25rem'}} className="w-full">
          <div className="w-full"><Feed /></div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  fetching: state.post,
});

const connectedHomePage = connect(mapStateToProps)(HomePage);
export { connectedHomePage as default };

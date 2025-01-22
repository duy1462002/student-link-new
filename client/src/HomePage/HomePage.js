import React, { Component } from "react";
import { connect } from "react-redux";
import Feed from "../components/Post/Feed";
import { NewUsersList } from "../components/NewUsersLIst";
import HomePageFormModal from "../components/HomePage/HomePageFormModal";

class HomePage extends Component {
  componentDidMount = () => {
    document.title = "social-network";
  };

  render() {
    const { profilePicture } = this.props.user;

    return (
      <div id="homepage-container" className="flex flex-row-reverse">
        <div
          id="left-container"
          className="shadow-lg border card-border-primary overflow-hidden"
        >
          <NewUsersList></NewUsersList>
        </div>

        <div id="right" style={{ marginRight: "23.25rem" }} className="w-full">
          <div className="w-full">
            <div>
              <div className="bg-white p-4 rounded-xl flex items-center gap-4 card-border-primary mb-5">
                <img
                  src={`/images/profile-picture/100x100/${profilePicture}`}
                  alt="avatar_user"
                  style={{
                    border: "1px solid #ccc",
                  }}
                  className="w-[46px] h-[46px] object-cover rounded-full"
                />
                <HomePageFormModal />
              </div>
            </div>

            <Feed />
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  fetching: state.post,
  user: state.user.data,
});

const connectedHomePage = connect(mapStateToProps)(HomePage);
export { connectedHomePage as default };

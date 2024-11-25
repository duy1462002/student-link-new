import React, { Component } from "react";
import { connect } from "react-redux";
import { userActions } from "../actions/userActions";
import SpinnerLoading from "../components/SpinnerLoading";

class OrganizationPage extends Component {
  componentDidMount = () => {
    document.title = "Organization | social-network";
    this.props.dispatch(userActions.getNewUsers({ initialFetch: true }));
  };

  render() {
    const { newUsers, fetching } = this.props;
    console.log(newUsers);
    return (
      <div className="main pb-[100px] relative bg-white p-4 rounded-xl card-border-primary">
        <div className="w-full  mb-4 px-5 pt-5 flex justify-between">
          <p className="text-3xl font-semibold">Dashboard</p>
          <a className="group-btn rounded-lg hover-text-white" href="/create-class">
            <i className="fa-solid fa-people-roof"></i>
            Create a new class
          </a>
        </div>

        <div className="flex w-100 justify-between">
          <div className="flex flex-wrap justify-start mt-6">
            {[1, 2, 3, 4, 5].map((item) => (
              <div
                key={item}
                className="max-w-[240px] h-[250px] m-4 rounded shadow-lg shadow-gray-200 dark:shadow-gray-900 bg-white dark:bg-gray-800 duration-300 hover:-translate-y-1"
              >
                <a href="/" className="cursor-pointer" alt="">
                  <figure>
                    <img
                      src="https://o.vdoc.vn/data/image/2023/10/26/loi-bai-hat-intro-24k-right.jpg"
                      className="rounded-t w-full object-cover"
                      alt=""
                    />
                    <figcaption className="p-4">
                      <p className="text-lg mb-4 font-bold leading-relaxed text-gray-800 dark:text-gray-300">
                        c oanvcoadsnvodanvoadsov
                      </p>
                      <small className="leading-5 text-gray-500 dark:text-gray-400">
                        hi bae
                      </small>
                    </figcaption>
                  </figure>
                </a>
              </div>
            ))}
          </div>
          <div>
            <h1 className="text-2xl pl-4 font-semibold mb-4 noti-header">
              List members
            </h1>
            <div className="flex flex-col mt-6 w-[250px] relative h-[400px] overflow-y-auto">
              {fetching ? (
                <SpinnerLoading size={90} bgColor="white" />
              ) : (
                newUsers.map((user, index) => (
                  <div
                    key={index}
                    className="mb-2 p-4 rounded-lg shadow bg-white dark:bg-gray-800 flex items-center gap-3"
                  >
                    <img
                      src={`/images/profile-picture/100x100/${user.profilePicture}`}
                      className="rounded-full w-12 h-12 object-cover"
                      alt=""
                    />
                    <h3 className="text-xl font-semibold">
                      {user.username} (Admin)
                    </h3>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.user,
  alert: state.alert,
  newUsers: state.newUsers.users,
  fetching: state.newUsers.fetching,
});

export default connect(mapStateToProps)(OrganizationPage);

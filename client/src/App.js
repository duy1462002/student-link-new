import React, { Fragment, Suspense, lazy } from "react";
import { Router, Route, Switch } from "react-router-dom";
import { connect } from "react-redux";
import { history } from "./_helpers/history";
import { alertActions } from "./actions/alertActions";
import { notificationActions } from "./actions/notificationActions";
import { PrivateRoute } from "./components/PrivateRoute";
import "./styles/index.css";
import { Toaster } from "react-hot-toast";
import SpinnerLoading from "./components/SpinnerLoading";
import OrganizationPage from "./OrganizationPage/OrganizationPage";
import AddOrganization from "./OrganizationPage/AddOrganization";
// import Sidebar from "./components/Sidebar";
const NotFoundPage = lazy(() => import("./NotFoundPage/NotFoundPage"));
const PasswordResetPage = lazy(() =>
  import("./PasswordResetPage/PasswordResetPage")
);
const HomePage = lazy(() => import("./HomePage/HomePage"));
const LoginPage = lazy(() => import("./LoginPage/LoginPage"));
const RegisterPage = lazy(() => import("./RegisterPage/RegisterPage"));
const ProfilePage = lazy(() => import("./ProfilePage/ProfilePage"));
const UserProfile = lazy(() => import("./UserProfile/UserProfile"));
const PostUploadPage = lazy(() => import("./PostUploadPage/PostUploadPage"));
const PostPage = lazy(() => import("./PostPage/PostPage"));
const HashtagPage = lazy(() => import("./HashtagPage/HashtagPage"));
const LocationPage = lazy(() => import("./LocationPage/LocationPage"));
const MessengerPage = lazy(() => import("./MessengerPage/MessengerPage"));
const Navbar = lazy(() => import("./components/Navbar"));
const Sidebar = lazy(() => import("./components/Sidebar"));
const NotificationsPage = lazy(() =>
  import("./NotificationsPage/NotificationsPage")
);
const GroupPage = lazy(() => import("./GroupPage/GroupPage"));
const AddGroupPage = lazy(() => import("./GroupPage/AddGroupPage"));

class App extends React.Component {
  componentDidMount() {
    const { dispatch } = this.props;
    window.addEventListener("scroll", this.handleNotificationPopupClose);
    history.listen((location, action) => {
      // clear alert on location change
      dispatch(alertActions.clear());
    });
  }

  handleNotificationPopupClose = () => {
    const { dispatch, isOpen } = this.props;
    if (isOpen) {
      dispatch(notificationActions.closeNotificationPopup());
    }
  };

  render() {
    const { authentication } = this.props;

    return (
      <div onClick={this.handleNotificationPopupClose}>
        <Router history={history}>
          <Suspense fallback={<SpinnerLoading />}>
            <Fragment>
              <Toaster />
              {authentication.loggedIn ? (
                <div
                  className="!bg-[#591bc5] main-navbar"
                  style={{ height: "6.8rem" }}
                >
                  <Navbar />
                </div>
              ) : null}
              <div className="container relative">
                {authentication.loggedIn ? <Sidebar /> : null}
                <div
                  style={{ marginLeft: "23.25rem" }}
                  className={`${authentication.loggedIn ? "mt-5" : ""}`}
                >
                  <Switch>
                    <PrivateRoute exact path="/" component={HomePage} />
                    <Route exact path="/login" render={() => <LoginPage />} />
                    <Route
                      exact
                      path="/register"
                      render={() => <RegisterPage />}
                    />
                    <PrivateRoute
                      exact
                      path="/profile"
                      component={ProfilePage}
                    />
                    <PrivateRoute
                      path="/group/:groupId"
                      component={GroupPage}
                    />
                    <PrivateRoute
                      exact
                      path="/add-group"
                      component={AddGroupPage}
                    />

                    <PrivateRoute
                      path="/org/:orgId"
                      component={OrganizationPage}
                    />
                    <PrivateRoute
                      exact
                      path="/add-org"
                      component={AddOrganization}
                    />

                    <PrivateRoute
                      exact
                      path="/create-class"
                      component={AddOrganization}
                    />

                    <PrivateRoute
                      exact
                      path="/posts/upload"
                      component={PostUploadPage}
                    />
                    <PrivateRoute
                      exact
                      path="/messages/chat"
                      component={MessengerPage}
                    />
                    <PrivateRoute
                      exact
                      path="/notifications"
                      component={NotificationsPage}
                    />
                    <Route
                      path="/hashtags/:hashtag"
                      render={(props) => {
                        if (!localStorage.getItem("user")) {
                          history.push("/login");
                          window.location.reload();
                        }
                        return (
                          <HashtagPage
                            key={props.match.params.hashtag}
                            {...props}
                          />
                        );
                      }}
                    />
                    <Route
                      path="/p/:postId"
                      render={(props) => {
                        if (!localStorage.getItem("user")) {
                          history.push("/login");
                          window.location.reload();
                        }
                        return (
                          <PostPage
                            key={props.match.params.postId}
                            {...props}
                          />
                        );
                      }}
                    />
                    <Route
                      path="/location/:coordinates"
                      render={(props) => {
                        if (!localStorage.getItem("user")) {
                          history.push("/login");
                          window.location.reload();
                        }
                        return (
                          <LocationPage
                            key={props.match.params.coordinates}
                            {...props}
                          />
                        );
                      }}
                    />
                    <Route
                      exact
                      path="/:username"
                      render={(props) => {
                        if (!localStorage.getItem("user")) {
                          history.push("/login");
                          window.location.reload();
                        }
                        return (
                          <UserProfile
                            key={props.match.params.username}
                            {...props}
                          />
                        );
                      }}
                    />

                    <Route
                      exact
                      path="/auth/reset/password/:jwt"
                      render={(props) => <PasswordResetPage {...props} />}
                    />
                    <Route render={() => <NotFoundPage />} />
                  </Switch>
                </div>
              </div>
            </Fragment>
          </Suspense>
        </Router>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  authentication: state.authentication,
  isOpen: state.notification.isOpen,
});

const connectedApp = connect(mapStateToProps)(App);
export { connectedApp as App };

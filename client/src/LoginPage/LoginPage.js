import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { Button, Form } from "semantic-ui-react";
import { userActions } from "../actions/userActions";
import toast from "react-hot-toast";
import { userConstants } from "../_constants/userConstants";
class LoginPage extends React.Component {
  constructor(props) {
    super(props);

    // reset login status
    this.props.dispatch(userActions.logout());

    this.state = {
      email: "",
      password: "",
      emailToVerify: "",
      forgotPasswordEmail: "",
      submitted: false,
      showForm: false,
      forgotPasswordForm: false,
      loginAttempted: false,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount = () => {
    document.title = "Login | social-network";
  };

  handleChange(e) {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  }

  handleSubmit(e) {
    e.preventDefault();

    this.setState({ submitted: true, loginAttempted: true });
    const { email, password } = this.state;
    const { dispatch } = this.props;
    if (email && password) {
      dispatch(userActions.login(email, password));
    }
  }

  resendEmailVerification = () => {
    this.props.dispatch(
      userActions.sendVerificationEmail(this.state.emailToVerify)
    );
    toast.success("Verification email sent successfully");
  };

  forgotPasswordEmail = () => {
    this.props.dispatch(
      userActions.sendForgotPasswordEmail(this.state.forgotPasswordEmail)
    );
    toast.success("Please check your email");
  };

  toggleEmailVerification = () => {
    this.setState({ showForm: !this.state.showForm });
  };

  toggleForgotPasswordForm = () => {
    this.setState({
      forgotPasswordForm: !this.state.forgotPasswordForm,
    });
  };


  render() {
    const { loggingIn, alert } = this.props;
    const { email, password, submitted, showForm, forgotPasswordForm } =
      this.state;
    return (
      <div className="grid grid-cols-12 form-centered">
        <div className="lg:col-span-7  md:col-span-6 col-span-12  hidden md:flex flex-col justify-center gap-y-[100px] py-[30px] xl:px-[200px] px-[50px]">
          <div className="logo flex flex-col items-center">
            <img
              className="object-cover  rounded-full w-[120px] h-[120px]"
              src="/S-Network-Logo.png"
              alt="logo"
            />
            <h1 className="text-[16px] font-bold">
              Every new friend is a new adventure
            </h1>
          </div>
          <div className="informeson  text-center">
            <div className="animation-text">
              <h1 className="text-color-animation text-[38px] font-bold mb-[40px]">
                Let's Get Connected
              </h1>
              <p className="text-[14px] text-gray-500 mb-[40px] font-medium  leading-8">
                Having a new friend enriches life by bringing fresh perspectives
                and experiences. They offer support, encouragement, and
                companionship, helping to boost mental well-being and happiness.
                New friends expand social networks, foster personal growth, and
                create lasting memories.
              </p>
              <button className="register-btn">
                <Link to="/register">Connect with new account</Link>
              </button>
            </div>
          </div>
        </div>
        <div className="lg:col-span-5 md:col-span-6 col-span-12 side-left flex flex-col items-center justify-center lg:p-[80px] xl:p-[100px] md:p-[40px] p-[40px]">
          {forgotPasswordForm ? (
            <div className="w-full">
              <h1 className="text-[30px] font-semibold text-white mb-[26px]">
                Recover Your Password
              </h1>
              <Form className="w-full" name="form">
                <Form.Field>
                  <label
                    htmlhtmlFor="email"
                    className="!text-[16px] !text-white font-semibold ml-[8px]"
                  >
                    Email
                  </label>
                  <input
                    className="!mt-[8px]"
                    name="forgotPasswordEmail"
                    placeholder="Email"
                    type="email"
                    onChange={this.handleChange}
                  />
                </Form.Field>
                <div className="flex items-center justify-between mt-[16px]">
                  <Button
                    className="!bg-white !text-[#591bc5] !text-[14px] w-[160px] !h-full "
                    primary
                    type="submit"
                    onClick={this.forgotPasswordEmail}
                  >
                    Send Me Email
                  </Button>
                  <span
                    className="text-[14px] font-semibold  text-white  underline"
                    onClick={this.toggleForgotPasswordForm}
                  >
                    Already a member?{" "}
                    <span
                      className="cursor-pointer underline"
                      onClick={this.toggleForgotPasswordForm}
                    >
                      Sign In
                    </span>
                  </span>
                </div>
              </Form>
            </div>
          ) : showForm ? (
            <div className="w-full">
              <h1 className="text-[30px] font-semibold text-white mb-[26px]">
                Verify Your Account
              </h1>
              <Form className="" name="form">
                <Form.Field>
                  <label
                    htmlFor="email"
                    className="!text-[16px] !text-white font-semibold ml-[8px]"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    className="!mt-[8px]"
                    name="emailToVerify"
                    placeholder="Email"
                    type="email"
                    onChange={this.handleChange}
                  />
                </Form.Field>
                <div className="flex items-center justify-between">
                  <Button
                    type="submit"
                    onClick={this.resendEmailVerification}
                    className="!bg-white !text-[#591bc5] !text-[14px] w-[120px] !h-full "
                    primary
                  >
                    Resend
                  </Button>
                  <span
                    className="text-[14px] font-semibold  text-white cursor-pointer underline"
                    onClick={this.toggleEmailVerification}
                  >
                    Sign In
                  </span>
                </div>
              </Form>
            </div>
          ) : (
            <div className="w-full">
              <h1 className="text-[30px] font-semibold text-white mb-[26px]">
                Sign In
              </h1>
              <Form
                success={alert.type === "success" ? true : false}
                error={alert.type === "error" ? true : false}
                className="w-full "
                name="form"
                onSubmit={this.handleSubmit}
              >
                <Form.Group className="!flex !flex-col gap-y-4">
                  <label
                    htmlFor="email"
                    className="text-[16px] text-white font-semibold ml-[8px]"
                  >
                    Email
                  </label>
                  <Form.Input
                    className="text-[14px]"
                    autoCapitalize="none"
                    placeholder="Email or username"
                    type="text"
                    name="email"
                    id="email"
                    value={email}
                    error={submitted && !email ? true : false}
                    onChange={this.handleChange}
                  />
                  <label
                    htmlFor="password"
                    className="text-[16px] text-white font-semibold ml-[8px] mt-[16px]"
                  >
                    Password
                  </label>
                  <Form.Input
                    className="text-[14px]"
                    placeholder="Password"
                    type="password"
                    name="password"
                    value={password}
                    error={submitted && !password ? true : false}
                    onChange={this.handleChange}
                  />
                </Form.Group>
                <div className="flex items-start justify-between mt-[16px]">
                  {loggingIn ? (
                    <Button
                      onClick={this.handleLogin}
                      className="!bg-white !text-[#591bc5] !text-[14px] w-[120px] !h-full login-btn transition relative"
                      primary
                      disabled={email !== "" && password !== "" ? false : true}
                    >
                      Logging in...
                    </Button>
                  ) : (
                    <Button
                      onClick={this.handleLogin}
                      className="!bg-white !text-[#591bc5] !text-[14px] w-[120px] !h-full login-btn transition"
                      primary
                      disabled={email !== "" && password !== "" ? false : true}
                    >
                      Login
                    </Button>
                  )}
                  <span
                    className="text-[14px] font-semibold  text-white cursor-pointer"
                    onClick={this.toggleForgotPasswordForm}
                  >
                    Forgot password
                  </span>
                </div>
                <div className="flex mt-[16px] items-center justify-end">
                  <span
                    className="text-[14px] font-medium  text-white cursor-pointer"
                    onClick={this.toggleEmailVerification}
                  >
                    Verify your account now ?
                  </span>
                </div>
              </Form>
              {/* {alert.type ? <Messages alert={alert} /> : null} */}
            </div>
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  loggingIn: state.authentication.loggingIn,
  alert: state.alert,
});

const connectedLoginPage = connect(mapStateToProps)(LoginPage);
export { connectedLoginPage as default };

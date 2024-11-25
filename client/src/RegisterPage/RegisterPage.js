import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { Button, Form, Message } from "semantic-ui-react";
import { userActions } from "../actions/userActions";
import toast from "react-hot-toast";

class RegisterPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            user: {
                firstName: "",
                lastName: "",
                username: "",
                email: "",
                password: "",
                retypepassword: "",
            },
            submitted: false,
            retTypePasswordError: false,
            registerAttempted: false,
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount = () => {
        document.title = "Register | social-network";
    };

    handleChange = (event) => {
        const { name, value } = event.target;
        const { user } = this.state;
        this.setState({
            user: {
                ...user,
                [name]: value,
            },
        });
    };

    handleRetypePassword = (event) => {
        const { name, value } = event.target;
        const { user } = this.state;
        if (value !== this.state.user.password) {
            this.setState({
                user: {
                    ...user,
                    [name]: value,
                },
                retTypePasswordError: true,
            });
        } else {
            this.setState({
                user: {
                    ...user,
                    [name]: value,
                },
                retTypePasswordError: false,
            });
        }
    };

    handleSubmit(event) {
        event.preventDefault();

        this.setState({ submitted: true, registerAttempted: true });
        const { user } = this.state;
        const { dispatch } = this.props;
        if (
            user.firstName &&
            user.lastName &&
            user.username &&
            user.password &&
            user.retypepassword &&
            !this.state.retTypePasswordError
        ) {
            dispatch(userActions.register(user));
        }
    }

    render() {
        const { registering, alert } = this.props;
        console.log("alert", alert);
        const { user, submitted, retTypePasswordError } = this.state;
        console.log("user", user);
        return (
            <div className="grid grid-cols-12 form-centered">
                <div className="lg:col-span-7  md:col-span-6 col-span-12  hidden md:flex flex-col justify-center gap-y-[100px] py-[30px] px-[50px] ">
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
                        <div className="animation-text ">
                            <h1 className="text-color-animation text-[38px] font-bold mb-[40px]">
                                Let's Get Connected
                            </h1>
                            <p className="text-[14px] text-gray-500 mb-[40px] font-medium  leading-8">
                                Having a new friend enriches life by bringing
                                fresh perspectives and experiences. They offer
                                support, encouragement, and companionship,
                                helping to boost mental well-being and
                                happiness. New friends expand social networks,
                                foster personal growth, and create lasting
                                memories.
                            </p>
                            <button className="register-btn">
                                <Link to="/login">
                                    Connect with your account
                                </Link>
                            </button>
                        </div>
                    </div>
                </div>
                <div className="lg:col-span-5 md:col-span-6 col-span-12 side-left flex flex-col items-center justify-center lg:p-[80px] xl:p-[100px] md:p-[40px] p-[40px]">
                    <h1 className="text-[30px] font-semibold text-white mb-[26px]">
                        Sign Up
                    </h1>
                    <Form
                        className="w-full"
                        name="form"
                        success={
                            alert && alert.type === "success" ? true : false
                        }
                        error={alert && alert.type === "error" ? true : false}
                        onSubmit={this.handleSubmit}
                    >
                        <label className="text-[16px] text-white font-semibold ">
                            First name
                        </label>
                        <Form.Input
                            required
                            className="!mt-[8px]"
                            placeholder="First Name"
                            type="text"
                            name="firstName"
                            value={user.firstName}
                            error={submitted && !user.firstName ? true : false}
                            onChange={this.handleChange}
                        />
                        <label className="text-[16px] text-white font-semibold ">
                            Last name
                        </label>
                        <Form.Input
                            className="!mt-[8px]"
                            required
                            placeholder="Last Name"
                            type="text"
                            name="lastName"
                            value={user.lastName}
                            error={submitted && !user.lastName ? true : false}
                            onChange={this.handleChange}
                        />
                        <label className="text-[16px] text-white font-semibold ">
                            Username
                        </label>
                        <Form.Input
                            className="!mt-[8px]"
                            required
                            autoCapitalize="none"
                            placeholder="Username"
                            type="text"
                            name="username"
                            value={user.username}
                            error={submitted && !user.username ? true : false}
                            onChange={this.handleChange}
                        />
                        <label className="text-[16px] text-white font-semibold ">
                            Email
                        </label>
                        <Form.Input
                            className="!mt-[8px]"
                            required
                            placeholder="Email"
                            type="email"
                            name="email"
                            value={user.email}
                            error={submitted && !user.email ? true : false}
                            onChange={this.handleChange}
                        />
                        <label className="text-[16px] text-white font-semibold ">
                            Password
                        </label>
                        <Form.Input
                            className="!mt-[8px]"
                            required
                            placeholder="Password"
                            type="password"
                            name="password"
                            value={user.password}
                            error={submitted && !user.password ? true : false}
                            onChange={this.handleChange}
                        />
                        <label className="text-[16px] text-white font-semibold ">
                            Re-type password
                        </label>
                        <Form.Input
                            className="!mt-[8px]"
                            required
                            placeholder="Re-type password"
                            type="password"
                            name="retypepassword"
                            value={user.retypepassword}
                            error={
                                (submitted && !user.retypepassword
                                    ? true
                                    : false) || retTypePasswordError
                            }
                            onChange={this.handleRetypePassword}
                        />
                        <div className="flex items-center justify-between mt-[16px]">
                            <Button
                                className=" !bg-white !text-[#591bc5] !text-[14px] w-[120px]"
                                primary
                                disabled={
                                    !retTypePasswordError &&
                                    user.retypepassword !== "" &&
                                    user.password !== "" &&
                                    user.email !== "" &&
                                    user.firstName !== "" &&
                                    user.lastName !== "" &&
                                    user.username !== ""
                                        ? false
                                        : true
                                }
                                loading={registering ? true : false}
                            >
                                Sign Up
                            </Button>
                            <span
                                className="text-[14px] font-semibold  text-white  underline"
                                onClick={this.toggleForgotPasswordForm}
                            >
                                Already a member?{" "}
                                <Link
                                    to="/login"
                                    className="cursor-pointer underline"
                                >
                                    Sign In
                                </Link>
                            </span>
                        </div>
                    </Form>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    registering: state.registration.registering,
    alert: state.alert,
});

const connectedRegisterPage = connect(mapStateToProps)(RegisterPage);
export { connectedRegisterPage as default };

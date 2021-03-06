import React from "react";
import { Link } from "react-router-dom";
import { graphql } from "react-apollo";
import * as Yup from "yup";
import { withFormik, FormikProps } from "formik";

import Form from "../../../styles/components/UI/Form/Form";
import Label from "../../../styles/components/UI/Label/Label";
import Input from "../../../styles/components/UI/Input/Input";
import Button from "../../../styles/components/UI/Button/Button";
import Error from "../../../styles/components/UI/Error/Error";

import { loginUser } from "../../../graphql/mutations";

interface FormValues {
    email: string;
    password: string;
}

interface OtherProps {
    title?: string;
    mutate?: any;
    history?: any;
}

interface MyFormProps {
    initialEmail?: string;
    initialPassword?: string;
    mutate?: any;
    history?: any;
}

const InnerForm = (props: OtherProps & FormikProps<FormValues>) => {
    const {
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        handleSubmit,
        isSubmitting
    } = props;

    return (
        <Form onSubmit={handleSubmit} gridRow="3 / 6">
            <Label>Email address</Label>
            <Input
                type="email"
                name="email"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.email}
            />
            {touched.email && errors.email && (
                <Error>
                    <h2>{errors.email}</h2>
                </Error>
            )}
            <Label>Password</Label>
            <Input
                type="password"
                name="password"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.password}
            />
            {touched.password && errors.password && (
                <Error>
                    <h2>{errors.password}</h2>
                </Error>
            )}
            <Button
                fontSize={1}
                type="submit"
                disabled={
                    isSubmitting ||
                    !!(errors.email && touched.email) ||
                    !!(errors.password && touched.password)
                }
            >
                Sign In
            </Button>
            <Link to="/forgot">Forgot password</Link>
            <Link to="/signup">Don't have an account? Create an account</Link>
        </Form>
    );
};

// Wrap our form with the using withFormik HoC
const SignIn = withFormik<MyFormProps, FormValues>({
    // Transform outer props into form values
    mapPropsToValues: props => ({
        email: props.initialEmail || "",
        password: props.initialPassword || ""
    }),

    validationSchema: Yup.object().shape({
        email: Yup.string()
            .email("Email not valid")
            .required("Email is required"),
        password: Yup.string().required("Password is required")
    }),

    handleSubmit(
        { email, password }: FormValues,
        { props, setSubmitting, setErrors }
    ) {
        props
            .mutate({ variables: { input: { email, password } } })
            .then(({ data }: any) => {
                const { loginUser } = data;

                if (loginUser.token) {
                    localStorage.setItem("token", loginUser.token);
                }
            })
            .then(() => props.history.push("/users"))
            .catch((error: string) => {
                console.log("error", error);
                setSubmitting(false);
                setErrors({ email: "", password: "" });
            });
    }
})(InnerForm);

export default graphql(loginUser)(SignIn);

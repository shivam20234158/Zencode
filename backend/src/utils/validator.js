import validator from "validator";

const validate = (data) => {

    const requiredFields = [
        "firstName",
        "emailId",
        "password",
    ];

    const isAllowed = requiredFields.every((field) =>
        Object.keys(data).includes(field)
    );

    if (!isAllowed) {
        throw new Error("Required fields are missing");
    }

    if (!validator.isEmail(data.emailId)) {
        throw new Error("Invalid Email");
    }

    if (
        !validator.isStrongPassword(data.password, {
            minLength: 8,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1,
        })
    ) {
        throw new Error(
            "Password must contain at least 8 characters, one uppercase, one lowercase, one number and one special character."
        );
    }

};

export default validate;
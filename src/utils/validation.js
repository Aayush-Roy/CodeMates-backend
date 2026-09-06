import validator from "validator";

export const validateSignUpData = (req) => {
    const { firstName, lastname, email, password } = req.body;

    if (!firstName || !lastname) {
        throw new Error("First Name and Last Name are Required");
    }
    else if (!validator.isEmail(email)) {
        throw new Error("Email is Not Valid!");
    }
    else if (!validator.isStrongPassword(password)) {
        throw new Error("Please enter a strong password!");
    }
};

export const validateEditprofileData = (req)=>{
    try{
        const allowedEditFields = ["firstName","lastName","photoUrl","about","skills","age","gender"];
        const isEditAllowed = Object.keys(req.body).every((field)=>{
           return allowedEditFields.includes(field);
        })
        return isEditAllowed;
    }catch(err){
        console.log("Error in validateEditProfile", err)
    }
}
import validator from "validator"
export const validateSignUpData = (req)=>{
    const {firstName, lastName, email, password} = req.body;
    if(!firstName || !lastName){
        throw new Error("First Name and Last Name is Required")
    }
    else if(validator.isEmail(email)){
        throw new Error("Email is Not Valid!");
    }
    else if(!validator.isStrongPassword(password)){
        throw new Error("Please enter a strong password!")
    }
}
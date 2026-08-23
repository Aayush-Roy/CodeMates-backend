export const adminAuth = (req,res,next)=>{
    try{
        const token = "xyz1";
    const isAuthorized = token ==="xyz";
    console.log("Admin auth checked")
    if(!isAuthorized){
        res.status(401).send("Unauthorized");
    }else{
        next();
    }
    }catch(err){
        console.log(err);
    }
   
}
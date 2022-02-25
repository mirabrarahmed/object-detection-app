import React from "react";
import ClimbingBoxLoader from "react-spinners/ClimbingBoxLoader";


const LoadingPage = ({isLoading, color}) => {
    return (
        <div style={{
                display:"flex",
                flexDirection:"column", 
                justifyContent:"center", 
                alignItems:"center",
                width:"100%",
                minHeight:"100vh"}}
        >
            
            <ClimbingBoxLoader color={color} loading={isLoading} size={50} />
            <h1 style={{marginTop:"100px", color:"#123abc"}}>Model is Loading...</h1>
        </div>
    );
}
 
export default LoadingPage;
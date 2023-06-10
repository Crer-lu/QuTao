
export default () => {
  
    console.log("logout")
    localStorage.setItem("name","")
    window.location.href = '/login'
    return (
        <></>
    )
};
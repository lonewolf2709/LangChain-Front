
import {React,useEffect,useState} from "react";
import SmartToyIcon from '@mui/icons-material/SmartToy';
import "./Interface.css"
import {ThreeDots} from "react-loader-spinner";
import HomeIcon from '@mui/icons-material/Home';
import CancelIcon from '@mui/icons-material/Cancel';
// import Loader from 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';
import ButtonPos from "./buttonpos";
import ButtonNeg from "./buttonneg";
import { useNavigate } from "react-router-dom";
import { selectUserName,selectUserEmail,selectUserPhoto,setUserLoginDetails, setSignOutState} from "../features/user/userSlice";
import {auth,provider} from "../firebase";
import {useDispatch,useSelector} from "react-redux";
function Interface()
{
    const [loading,setLoading]=useState(false);
    const dispatch=useDispatch();
    const navigate=useNavigate();
    const userName=useSelector(selectUserName);
    const userPhoto=useSelector(selectUserPhoto);
    useEffect(()=>{
        auth.onAuthStateChanged(async (user)=>{
            if(user){
                setUser(user);
                navigate("/inter");
            }
            else{
                navigate("/");
            }
        })
    },[userName]);
    const signOutWithGoogle=()=>{
        auth
        .signOut()
        .then(()=>{
            dispatch(setSignOutState());
        }).catch((err)=>alert(err.message));
    }
    const setUser=(user)=>{
        dispatch(
            setUserLoginDetails(
                {
                    name: user.displayName,
                    email: user.email,
                    photo: user.photoURL,
                }
            )
        )
    }
    const [input,setInput]=useState("");
    const [chatLog,setChatLog]=useState([]);
    const userEmail=useSelector(selectUserEmail);
    async function handleSubmit(event) {
        event.preventDefault();
        console.log("submit");
        setLoading(true);
        let chatlogNew = [...chatLog, { user: "me", message: `${input}` }];
        setInput("");
        setChatLog(chatlogNew);

        const response = await fetch("http://localhost:8001/query/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ query: input })
        });
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let result = '';
        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            result += decoder.decode(value, { stream: true });
            setChatLog([...chatlogNew, { user: "gpt", message: result }]);
        }
        setLoading(false);
    }
    function handleChange(event){
        setInput(event.target.value);
    }
    async function handlePosSumbit(){
        console.log("clicked")
        if(!userEmail){
            alert("Please Login Again to Provide a Feedback");
        }
        else{
        const response=await fetch("http://localhost:4000/",{
            method:"POST",
            headers: {
                "Content-Type":"application/json"
            },
            body: JSON.stringify({
                message:userEmail,
                isPositive:true
            })
        });
        console.log(response)
    }
    }
    async function handleNegSumbit(){
        console.log("clicked")
        if(!userEmail){
            alert("Please Login Again to Provide a Feedback");
        }
        else{
        const response=await fetch("http://localhost:4000/",{
            method:"POST",
            headers: {
                "Content-Type":"application/json"
            },
            body: JSON.stringify({
                message:userEmail,
                isPositive:false
            })
        });
        console.log(response)
    }
    }
    let a=window.innerWidth;
    return <div className="x">
    <div className="App2">
        {a>768&&<aside className="sidemenu">
            <div onClick={signOutWithGoogle} className="side-menu-button">
            <HomeIcon />
                Logout
            </div>
            <div className="side-menu-button">
            <CancelIcon />
                New Chat
            </div>
            <div className="notes">
            Notes
            <textarea className="note-area">
            </textarea>
            </div>
        </aside>}
        <section className="chat-box">
        <div className="chat-log">
        {chatLog.map((message1,index) => (
            <ChatMessage key={index} message={message1} />
        ))}
        {loading&&<div className="three"><ThreeDots /></div>}
        </div>
        <div onClick={handleNegSumbit}>
            <ButtonNeg />
        </div>
        <div onClick={handlePosSumbit}>
           <ButtonPos />
        </div>
        <div className="chat-input-holder">
           <form onSubmit={handleSubmit}>
            <input value={input} onChange={handleChange} rows="1" className="chat-input-textarea" placeholder="Type your Message here">
            </input>
            </form>
        </div>
        </section>
    </div>
    </div>
}
const ChatMessage=({load,message})=>{
    const userPhoto=useSelector(selectUserPhoto);
    console.log(userPhoto);
    return (
        <div>
    <div className="chat-message">
    <div className="chat-message-center">
        <div className={`avatar ${message.user==="gpt"&&"chatgpt"}`}>
            {message.user=="gpt"&&<SmartToyIcon />}
            {message.user=="me"&&<img className="user-img" src={userPhoto}></img>}
        </div>
        <div className="message">
        {message.message}
        </div>
</div>
</div>
</div> )
}
export default Interface;
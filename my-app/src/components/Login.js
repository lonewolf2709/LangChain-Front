import React,{useEffect,useState} from "react";
import "./Login.css";
import {Link} from "react-router-dom";
// import {signInWithGoogle} from "../firebase"
import {auth,provider} from "../firebase";
import { signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { selectUserName,selectUserEmail,selectUserPhoto,setUserLoginDetails, setSignOutState} from "../features/user/userSlice";
import {useDispatch,useSelector} from "react-redux";
function Login()
{
  const texts = ['Document Search', 'Bing Search','Sql Search'];
  const [index, setIndex] = useState(0);
  const [text, setText] = useState(texts[index]);
  const [showText, setShowText] = useState(false);

  useEffect(() => {
    // Delete text letter by letter
    if (!showText) {
      const interval = setInterval(() => {
        setText((prevText) => prevText.slice(0, -1));
        if (text.length === 0) {
          clearInterval(interval);
          setShowText(true);
        }
      }, 100);
      return () => clearInterval(interval);
    }
  }, [showText, text]);

  useEffect(() => {
    // Display new text letter by letter
    if (showText) {
      const nextIndex=(index+1)%texts.length;
      // setIndex(nextIndex);
      const nextText = texts[nextIndex];
      const interval = setInterval(() => {
        if (text === nextText) {
          clearInterval(interval);
          setIndex(nextIndex);
          setShowText(false);
        }
        else{
        setText((prevText) => prevText + nextText[prevText.length]);
        }
      }, 100);
      return () => clearInterval(interval);
    }
  }, [showText, text, index, texts]);
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
  const signInWithGoogle=()=>{
      signInWithPopup(auth,provider).then((result)=>{
          setUser(result.user);
      }).catch((error)=>{
          alert(error);
      })
  }
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
  var x=window.innerWidth;
    return <div className="outer">
    {x>768&&
        <div className="left">
        <div className="content">
            <h1>ChatBot That Can Perfrom</h1>
            <h1>{text}</h1>
        </div>
        </div>
    }
        <div className="right">
        <h1>Get Started</h1>
        <button className="butt1" onClick={signInWithGoogle}>Log In</button>
        </div>
    </div>
}
export default Login;
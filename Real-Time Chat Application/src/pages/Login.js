import React, {useState} from 'react'
import {Grid,TextField,Button,Collapse, Alert,IconButton} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close';
import {Link,useNavigate} from 'react-router-dom'
import { AiFillEye,AiFillEyeInvisible } from 'react-icons/ai';
import { getAuth, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

const Login = () => {

  const auth = getAuth();
  const [open, setOpen] = React.useState(false);
  let navigate = useNavigate();


  let [email, setEmail] = useState('')
  let [password, setPassword] = useState('')
  
  let [emailerr, setEmailerr] = useState('')
  let [passworderr, setPassworderr] = useState('')
  let [passwordlengtherr, setPasswordlengtherr] = useState('')

  let [checkpassword,setCheckpassword] = useState(false)
  let [wrongemail,setWrongemail] = useState('')
  let [wrongpassword,setWrongpassword] = useState('')
 
  let handleSubmit = ()=>{
    console.log("Password", password.length)

     if (!email){
      setEmailerr('Please Enter An Email')
      
    } else if (!password){
      setPassworderr('Please Enter Your Password')
      setEmailerr('')
      
    } else if (password.length <= 8){
      setPasswordlengtherr('Password Must Be 8 charecter or More')
      setPassworderr('')
      
    }  else {
      setPasswordlengtherr('')
      signInWithEmailAndPassword(auth, email, password) .then ((user)=>{
        
        navigate('/home')
      }).catch ((error)=>{
        const errorCode = error.code;
        if (errorCode.includes('user')){
          setWrongemail('Email Not Found ! Tray Again')
          setOpen(true)
          setWrongpassword('')
        } else if (errorCode.includes('password')){
          setWrongpassword('Wrong Password !')
          setOpen(true)
          setWrongemail('')
        }
      })

    }
  }

    let handleEye = ()=> {
      setCheckpassword(!checkpassword)
    }


    let handleGoogleSignin = ()=>{
      console.log('hello')
      const provider = new GoogleAuthProvider();
      signInWithPopup(auth, provider)
          .then((result) => {
            // This gives you a Google Access Token. You can use it to access the Google API.
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential.accessToken;
            // The signed-in user info.
            const user = result.user;
            navigate('/home')
            // ...
          }).catch((error) => {
            // Handle Errors here.
            const errorCode = error.code;
            const errorMessage = error.message;
            // The email of the user's account used.
            const email = error.customData.email;
            // The AuthCredential type that was used.
            const credential = GoogleAuthProvider.credentialFromError(error);
            // ...
          });
    }

  return (
    <section className='registration-part login-part' >
       <Grid container spacing={2}>
            <Grid item xs={6}>
                <div className='box' >
                  <div className='left' >
                    <h2>Login to your account! </h2>


                    <div className='loginoption' >
                      <div onClick={handleGoogleSignin} className='option' ><img src='./assets/images/google.png'/> Login with Google</div>
                      <div className='option' ><img src='./assets/images/facebook.png'/>Login with Facebook</div>
                    </div>

                    <Collapse in={open}>
                      <Alert
                       variant="filled" 
                       severity="error"
                        action={
                          <IconButton
                            aria-label="close"
                            color="inherit"
                            size="small"
                            onClick={() => {
                              setOpen(false);
                            }}
                          >
                            <CloseIcon fontSize="inherit" />
                            
                            
                          </IconButton>
                        }
                        sx={{ mb: 2 }}
                      >
                        {wrongemail?wrongemail:wrongpassword&&wrongpassword}
                       
                      </Alert>
                    </Collapse>

                    <TextField
                      helperText={emailerr}
                      id="demo-helper-text-misaligned"
                      label="Enter Email"
                      type = "email"
                      style={{width: '360px', marginTop: '61px'}}
                      onChange= {(e)=>setEmail(e.target.value)}
                    /> <br/>
                      <div className='eye'  > 
                      <TextField
                            helperText={passworderr ? passworderr : passwordlengtherr ?
                            passwordlengtherr : "" }
                            id="demo-helper-text-misaligned"
                            label="Enter Password"
                            type= {checkpassword ? 'text' : 'password'}
                            style={{width: '360px', marginTop: '61px'}}
                            onChange= {(e)=>setPassword(e.target.value)}
                    
                          /> 
                          {checkpassword 
                          ?
                          <AiFillEye onClick={handleEye} className='eyeicon'  />
                          :
                          <AiFillEyeInvisible onClick={handleEye} className='eyeicon'  />
                          }
                          
                      </div>
                    <br/>
                    <Button style={{width: '368px', padding: '10px 0', borderRadius: '86px', background: '#5F35F5', marginTop: '30px'}} onClick = {handleSubmit} variant="contained">Login to Continue</Button>
                    <p className='msg'>Don’t have an account ? <Link to = '/'>Sign up</Link></p>
                  </div>
                </div>
            </Grid>
            <Grid item xs={6}>
                <img style={{width : '100%', height : '100vh'}} src = "./assets/images/loginbg.png"/>
            </Grid>
           
        </Grid>
    </section>
  )
}

export default Login
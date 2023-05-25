import React, { useState } from 'react'
import {Grid,TextField,Button,Collapse,Alert,IconButton,setOpen} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close';

import {Link, useNavigate } from 'react-router-dom'
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification,updateProfile } from "firebase/auth";
import { getDatabase, ref, set } from "firebase/database";


const Registration = () => {
  
  const auth = getAuth();
  const db = getDatabase();
  const [open, setOpen] = React.useState(false);
  let navigate = useNavigate();

  let [name, setName] = useState('')
  let [email, setEmail] = useState('')
  let [password, setPassword] = useState('')
  let [confirmpassword, setConfirmpassword] = useState('')

  let [nameerr, setNameerr] = useState('')
  let [emailerr, setEmailerr] = useState('')
  let [passworderr, setPassworderr] = useState('')
  let [confirmpassworderr, setConfirmpassworderr] = useState('')
  let [passwordlengtherr, setPasswordlengtherr] = useState('')
  let [matchpassword, setMatchpassword] = useState('')
  let [existemailerr, setExistemailerr] = useState('')

  let handleSubmit = ()=>{
    console.log("Password", password.length)

    if (!name){
      setNameerr('Please Enter a Name')
    } else if (!email){
      setEmailerr('Please Enter An Email')
      setNameerr('')
      
    } else if (!password){
      setPassworderr('Please Enter Your Password')
      setEmailerr('')
      
    } else if (password.length < 8){
      setPasswordlengtherr('Password Must Be 8 charecter or More')
      setPassworderr('')
      
    } else if (!confirmpassword){
      setConfirmpassworderr('Please Confirm Your Password')
      setPasswordlengtherr('')
      
    } else if ( password !== confirmpassword) {
      setMatchpassword('Password Not Match')
      setConfirmpassworderr('')
      
    } else {
      setMatchpassword('')
      createUserWithEmailAndPassword(auth, email, password).then ((user)=>{
        
        sendEmailVerification(auth.currentUser)
        .then(() => {
          updateProfile(auth.currentUser, {
            displayName: name, 
          }).then(() => {
              console.log("Name Set")
              set(ref(db, 'users/' + auth.currentUser.uid), {
                username: name,
                email: email,
              
              });
          }).catch((error) => {
            console.log(error)
          });
           
        });
        navigate('/login')
      })
      .catch ((error)=>{
        const errorCode = error.code;
        if (errorCode.includes('email')){
          setExistemailerr('Email Already in Used! Please Recheck !')
          setOpen(true)
        }
      })

    }
  }
  
  return (

    <section className='registration-part' >
       <Grid container spacing={2}>
            <Grid item xs={6}>
                <div className='box' >
                  <div className='left' >
                    <h2>Get started with easily register</h2>
                    <p style={{marginBottom:'25px'}} >Free register and you can enjoy it</p>

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
                       { existemailerr}
                      </Alert>
                    </Collapse>

                    <TextField
                      helperText={nameerr}
                      id="demo-helper-text-misaligned"
                      label="Full Name"
                      type = "text"
                      style={{width: '360px', marginTop: '61px'}}
                      onChange= {(e)=>setName(e.target.value)}
                    /> <br/>
                    <TextField
                      helperText={emailerr}
                      id="demo-helper-text-misaligned"
                      label="Enter Email"
                      type = "email"
                      style={{width: '360px', marginTop: '61px'}}
                      onChange= {(e)=>setEmail(e.target.value)}
                    /> <br/>
                    <TextField
                      helperText={passworderr ? passworderr : passwordlengtherr ?
                      passwordlengtherr : "" }
                      id="demo-helper-text-misaligned"
                      label="Enter Password"
                      type= "password"
                      style={{width: '360px', marginTop: '61px'}}
                      onChange= {(e)=>setPassword(e.target.value)}
                    /> <br/>
                    <TextField
                      helperText={confirmpassworderr ? confirmpassworderr : matchpassword ?
                        matchpassword : ""  }
                      id="demo-helper-text-misaligned"
                      label="Confirm Password"
                      type= "password"
                      style={{width: '360px', marginTop: '61px'}}
                      onChange= {(e)=>setConfirmpassword(e.target.value)}
                    /> <br/>
                    <Button style={{width: '368px', padding: '10px 0', borderRadius: '86px', background: '#5F35F5', marginTop: '30px'}} onClick = {handleSubmit} variant="contained" >Sign up</Button>
                    <p className='msg'>Already have an account ? <Link to = '/login'>Login</Link></p>
                  </div>
                </div>
            </Grid>
            <Grid item xs={6}>
                <img style={{width : '100%', height : '100vh'}} src = "./assets/images/registrationbg.png"/>
            </Grid>
           
        </Grid>
    </section>
   
  )
}

export default Registration
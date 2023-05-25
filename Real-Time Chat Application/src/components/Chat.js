import React, { useEffect, useState } from 'react'
import {AiFillMessage} from 'react-icons/ai';
import {BiDotsVerticalRounded} from 'react-icons/bi';
import {FiSend} from 'react-icons/fi';
import {AiOutlineCamera} from 'react-icons/ai';
import { useSelector, useDispatch } from 'react-redux'
import { getAuth } from "firebase/auth";
import { getDatabase, ref , set, push,onValue } from "firebase/database";
import { getStorage, ref as sref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import {Modal, Box,Typography,Button} from '@mui/material'


const Chat = () => {

    const auth = getAuth();
    const db = getDatabase();
    
    const storage = getStorage();

 
    
    const user = useSelector((state) => state.activeChat.active)
    let [msg, setMsg] = useState('')
    let [msglist, setMsglist] = useState([])

    //modalState
    const [open, setOpen] = useState(false);
    
    const [file, setFile] = useState(null);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    let handleMsg = (e)=>{
        setMsg(e.target.value);
    };

    let handleMsgSend = ()=>{
        console.log(user)
        if(msg!=""){
           
            if(user.status == "group"){
                console.log("etaa ekti group mesage")
            }else{
                set(push(ref(db, "singlemsg")), {
                    whosendid: auth.currentUser.uid,
                    whosendname: auth.currentUser.displayName,
                    whoreceivename: user.name,
                    whoreceive: user.id,
                    msg: msg,
                  })

            }
        }
    
    };
    
    useEffect(()=>{
        onValue(ref(db, "singlemsg"), (snapshot) => {
            let msgarr=[];
           snapshot.forEach(item=>{
            if(
                (item.val().whosendid==auth.currentUser.uid && 
                item.val().whoreceive==user.id) || 
                (item.val().whosendid == user.id && 
                item.val().whoreceive == auth.currentUser.uid)
                )
            msgarr.push(item.val());
           });
           setMsglist(msgarr);
          });
    },[user.id]);
    
    //message ImageSend Logic
    let handleSingleImageUpload = (e)=>{
        setFile(e.target.files[0].name)
    };

    let handleImageUpload = ()=>{
            const singleImageRef = sref(storage, 'singleimages/'+ file[0].name);
            const uploadTask = uploadBytesResumable(singleImageRef, file);
                uploadTask.on('state_changed', 
    (snapshot) => {
       
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
    
    }, 
    (error) => {
        console.log(error)
    }, 
    () => {
        // Handle successful uploads on complete
        // For instance, get the download URL: https://firebasestorage.googleapis.com/...
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
        console.log('File available at', downloadURL);
        });
    }
    );
    };
    
  return (
    <>
        <div className='chat'> 
            <div className='toparea'>
                <div className='info'>
                    <div className='img'>
                        <img src='assets/images/friendrequest.png'/>
                        <div className='round'></div>
                    </div>
                    <div className='identity'>
                     <h3>{user.name}</h3>
                     <p>Online</p>
                    </div>
                </div>
                <div className='dots'>
                    <BiDotsVerticalRounded/>
                </div>
            </div>
            <div className='chatarea'>
                {msglist.map((item)=>
                item.whosendid == auth.currentUser.uid ? (
                    <div className='msg' style={alignRight}>
                        <p style={msgsend}>{item.msg}</p>
                        <p className='date' style={dateReceive} >Today, 2:02pm</p>
                    </div>
                ) : (
                    <div className='msg' style={alignLeft}>
                        <p style={msgreceive}>{item.msg}</p>
                        <p className='date' style={dateSend} >Today, 2:02pm</p>
                    </div>
                )
                
               )}
                
       
            </div>

            <div className='msgbox' >
                <div className='msgwrite' >
                    <input onChange={handleMsg} type='text' placeholder='Message'/>
                    <AiOutlineCamera className='camera' onClick={handleOpen}/>
                    
                    {/* Message Send Button */}
                    <button onClick={handleMsgSend} ><FiSend/></button>  
                </div>
            </div>
            
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                >
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                    Send Image
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                    <input type = "file" onChange={handleSingleImageUpload}/>
                    </Typography>
                    <Button onClick={handleImageUpload} style={{marginTop : '20px'}} variant="contained">Upload</Button>
                </Box>
            </Modal>
        </div>
    </>
  );
};

let msgreceive = {
    background: "#F1F1F1",
   
}
let msgsend = {
    background: "#5F35F5",
    color: '#fff',
   
}

let alignLeft = {
    justifyContent: "flex-start",
}

let alignRight = {
    justifyContent: "flex-end",
}

let dateSend ={
    left: "-49px",
}

let dateReceive ={
    right: "-49px",
}
const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

export default Chat
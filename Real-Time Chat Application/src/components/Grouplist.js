import React, { useEffect, useState } from 'react'
import {Modal,TextField} from '@mui/material'
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { getDatabase, ref, set,push,onValue } from "firebase/database";
import { getAuth } from "firebase/auth";

const Grouplist = () => {
    const auth = getAuth();
    const db = getDatabase();
    const [groupname, setGroupName] = useState('');
    const [groupnameerr, setGroupNameerr] = useState('');
    
    const [grouptagline, setGroupTagLine] = useState('');
    const [grouplist, setGroupTaglist] = useState([]);
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    let [check, setCheck] = useState(false)
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
    const inputStyle = {
            width: "100%",
            margin: "10px 0"
      };


      let handleCreateGroup = () =>{
        
         set(push(ref(db, 'groups')), {
            groupname: groupname,
            grouptagline: grouptagline,
            adminid : auth.currentUser.uid,
            adminname: auth.currentUser.displayName,
          }).then(()=>{
            setOpen(false)
            setCheck(!check)
          });
        
    };

    useEffect(()=>{
        let arr = [];
        const groupRef = ref(db, 'groups');
        onValue(groupRef, (snapshot) => {
            snapshot.forEach(item=>{
                console.log( {...item.val()})
                let groupinfo = {
                    adminid: item.val().adminid,
                    adminname: item.val().adminname,
                    groupname: item.val().groupname,
                    grouptagline: item.val().grouptagline,
                    key: item.key,
                }
                arr.push(groupinfo);
            })
        });
        setGroupTaglist(arr);

    },[check])

    let handleGroupJoin =(id , g)=>{
        set(push(ref(db, 'groupjoinrequest')), {
           adminid: id,
           groupid: g,
           userid: auth.currentUser.uid,
           username: auth.currentUser.displayName,
           userprofile: auth.currentUser.photoURL,   // PhotoURL Not Working 
          });
    };

  
 
    return (
        <div className='grouplist'>
            <div style={{display:'flex', justifyContent: 'Space-between'}}>
            <h2>Groups List</h2>
                <div className='button'>
                    <button  onClick={handleOpen}>Create Group</button>
                    
                </div>
        </div>

       {grouplist.map((item)=>(
        item.adminid != auth.currentUser.uid &&
            <div className='box'>
            <div className='img'>
                <img src='assets/images/groupimg.png'/>
            </div>
            <div className='name'>
                <h1>{item.groupname}</h1>
                <h4>{item.grouptagline}</h4>
                {/* <h4>Admin : {item.key}</h4> */}
            </div>
            <div className='button'>
                <button onClick={()=>handleGroupJoin(item.adminid, item.key )}>Join</button>
            </div>
            </div>

       ))} 
       
      
 
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            >
            <Box sx={style} >
            <Typography id="modal-modal-title" variant="h6" component="h2">
                Fiil The Field With Proper Information
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                <TextField 
                    helperText=""
                    id="outlined-basic" 
                    label="Group Name" 
                    variant="outlined" 
                    sx={inputStyle}
                    onChange={(e)=>setGroupName(e.target.value)}
                />
                <TextField 
                   helperText=""
                    id="outlined-basic" 
                    label="Group TagLine" 
                    variant="outlined" 
                    sx={inputStyle}
                    onChange={(e)=>setGroupTagLine(e.target.value)}
                />

                <div className='groupbutton'>
                    <button onClick={handleCreateGroup} >Create Group</button>
                </div>
            </Typography>
            </Box>
      </Modal>
    </div>
  )
}

export default Grouplist
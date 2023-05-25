import React, { useEffect, useState } from 'react'
import { getDatabase, ref, onValue} from "firebase/database";
import { getAuth } from "firebase/auth";
import {Alert} from '@mui/material'
import {AiFillMessage} from 'react-icons/ai';
import { useSelector, useDispatch } from 'react-redux'
import { activeChat } from '../slice/activeChatSlice';




const Friends = (props) => {
  
    const dispatch = useDispatch()
    const db = getDatabase();
    const auth = getAuth();
    const [friends, setFriends]=useState([])
    // Get data from firebase
    useEffect(()=>{
        let friendsArray=[] // declare array
        const friendsRef = ref(db, 'friends');
            onValue(friendsRef, (snapshot) => {
            // const data = snapshot.val();
            snapshot.forEach(item=>{
                console.log(item.val())
            if(auth.currentUser.uid == item.val().receiverid || auth.currentUser.uid == item.val().senderid){
                friendsArray.push(item.val())
            }
            
        })
                setFriends(friendsArray)
                // console.log(data)
        });
    },[])
    
    let handleActivechat = (item)=>{
        let userInfo = {};

        if(item.receiverid == auth.currentUser.uid){
            userInfo.status = "single"
            userInfo.id = item.senderid;
            userInfo.name = item.sendername;

        }else{
            userInfo.status = "single"
            userInfo.id = item.receiverid;
            userInfo.name = item.receivername;
        }
        dispatch(activeChat(userInfo))
    };
    

  return (
    <div className='grouplist friendlist'>
        <h2>{friends.length} {friends.length > 1 ? 'Friends' : 'Friend'}</h2>
        
        {friends.length==0&&
            <Alert style={{marginTop: "50px"}} severity="info">You Have No Friends</Alert>
        }
        
        {friends.map(item=>(
              <div className='box' onClick={()=> handleActivechat(item)} >
                <div className='img'>
                    <img src='assets/images/groupimg.png'/>
                </div>
                <div className='name'>
                    {auth.currentUser.uid==item.senderid
                    ?
                    <h1>{item.receivername}</h1>
                    :
                    <h1>{item.sendername}</h1>
                    }
                    <h4>Hi Guys, Wassup!</h4>
                </div>
                <div className='button'>
                    {props.item == "date" ? <p>{item.date}</p> : <button><AiFillMessage/></button>}
                
                
                </div>
          </div>

        )) }
      

    </div>
  )
}

export default Friends
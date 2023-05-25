import React, { useEffect, useState } from 'react'
import { getDatabase, set, ref, push, onValue, remove} from "firebase/database";
import { getAuth } from "firebase/auth";
import {Alert} from '@mui/material'

const FriendRequest = () => {
    const auth = getAuth();
    const db = getDatabase();
    let [friendrequest, setFriendrequest] = useState([])
    let [dlt, setDlt] = useState(true)
   
    useEffect(()=>{
        let friendRequestArr = []
        const friendRequestRef = ref(db, 'friendrequest/');
            onValue(friendRequestRef, (snapshot) => {
            // const data = snapshot.val();
           
            snapshot.forEach((item)=>{
                console.log("Random Id" , item.key)
                if(item.val().receiverid == auth.currentUser.uid){
                    friendRequestArr.push({
                        id : item.key,
                        sendername: item.val().sendername,
                        senderid : item.val().senderid,
                        receiverid: item.val().receiverid,
                        receivername: item.val().receivername,
                     })
                }

                })
                
            setFriendrequest(friendRequestArr)
          
        });
    },[dlt])

    let handleAcceptFriend = (friend)=>{
        let d = new Date();
        console.log(friend)
        set(push(ref(db, 'friends')), {
            id : friend.id,
            sendername: friend.sendername,
            senderid : friend.senderid,
            receiverid: friend.receiverid,
            receivername: friend.receivername,
            date: `${d.getDate()}/ ${d.getMonth()+1}/${d.getFullYear()}`
        
          }).then(()=>{
            remove(ref(db,'friendrequest/' + friend.id)).then(()=>{
                setDlt(!dlt)
            })
          })

    }

  return (
    
    <div className='grouplist'>
        <h2>Friend  Request</h2>
       {friendrequest.map(item=>(
        
        <div className='box'>
            <div className='img'>
                <img src='assets/images/friendrequest.png'/>
            </div>
            <div className='name'>
                <h1>{item.sendername}</h1>
                <h4>Hi Guys, Wassup!</h4>
            </div>
            <div className='button'>
                <button onClick={()=>handleAcceptFriend(item)} >Accept</button>
            </div>
        </div>
        
       ))}
        
      {friendrequest.length ==0 &&
        <Alert style={{marginTop: "50px"}} severity="info">No Friend Request!</Alert>
      }  
    </div>
  )
}

export default FriendRequest
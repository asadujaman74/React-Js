import React, { useEffect, useState } from 'react'
import { getDatabase, ref, set, onValue, push} from "firebase/database";
import { getAuth } from "firebase/auth";
import {BsCheckLg } from 'react-icons/bs';
import {FaUserFriends } from 'react-icons/fa';


const UserList = () => {
    const auth = getAuth();
    const db = getDatabase();
    // console.log(auth.currentUser)
    let [friendrequest, setFriendrequest] = useState([])
    let [friend, setFriend] = useState([])
    let [userlist,setUserlist] = useState([])
    let [change,setChange] = useState(false)

    useEffect(()=> {
        let userArr= []
        const userRef = ref(db, 'users/');
        onValue(userRef, (snapshot) => {
             snapshot.forEach((item)=>{
                userArr.push({
                    username: item.val().username,
                    email: item.val().email,
                    id : item.key
                 })
                })
                
            setUserlist(userArr)
          });
    },[])

    useEffect(()=>{
        let friendRequestArr =[] 
        // let friendRequestArr2 =[] 
        const friendRequestRef = ref(db, 'friendrequest/');
            onValue(friendRequestRef, (snapshot) => {
            // const data = snapshot.val();
            snapshot.forEach((item)=>{
                console.log("item.receiverid", item.receiverid)
                console.log("auth.currenUser.uid", auth.currentUser.uid)
              
                    friendRequestArr.push(item.val().receiverid + item.val().senderid)
                    // friendRequestArr2.push(item.val().senderid + item.val().receiverid)
                    })
                
                setFriendrequest(friendRequestArr)
                // setFriendrequest2(friendRequestArr2)
          });
    },[change])


   
    useEffect(()=>{
        let friendArr =[] 
        // let friendRequestArr2 =[] 
        const friendRef = ref(db, 'friends/');
            onValue(friendRef, (snapshot) => {
            // const data = snapshot.val();
            snapshot.forEach((item)=>{
               friendArr.push(item.val().receiverid + item.val().senderid)
                    
                })
                
                setFriend(friendArr)
              
          });
    },[])




    let handleFriendRequest = (info)=>{
        set(push(ref(db, 'friendrequest/')), {
            sendername: auth.currentUser.displayName,
            senderid: auth.currentUser.uid, 
            receiverid: info.id,
            receivername: info.username,
          });
          setChange (!change)
    }
  return (
    
    <div className='grouplist friendlist userlist'>
        <h2>User List</h2>

        {userlist.map(item=>(
            auth.currentUser.uid !== item.id && 
            <div className='box'>
                <div className='img'>
                    <img src='assets/images/groupimg.png'/>
                </div>
                <div className='name'>
                    <h1>{item.username}</h1> 
                    <h4>{item.email}</h4>
                </div>

                {friend.includes(item.id + auth.currentUser.uid) || friend.includes(auth.currentUser.uid + item.id) 
                ?
                <div className='button'>
                    <button ><FaUserFriends/></button>
                </div>
                :
                friendrequest.includes(item.id + auth.currentUser.uid) || friendrequest.includes(auth.currentUser.uid + item.id) ?
                <div className='button'>
                    <button ><BsCheckLg/></button>
                </div>
                
                   :
                   <div className='button'>
                        <button onClick={()=>handleFriendRequest(item)}>+</button>
                    </div>
                
                }
                
            </div>
            
        ))}
    
    </div>
  )
}

export default UserList
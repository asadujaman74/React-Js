import React, {useEffect, useState} from 'react'
import {AiFillMessage} from 'react-icons/ai';
import { getDatabase, ref, set,push,onValue } from "firebase/database";
import { getAuth } from "firebase/auth";
import { useSelector, useDispatch } from 'react-redux'
import { activeChat } from '../slice/activeChatSlice';
const JoinGroupList = () => {
    const dispatch = useDispatch()
    const db = getDatabase();
    const auth = getAuth();
    const [grouplist, setGroupTaglist] = useState([]);

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

    },[])

    let handleActivechat = (item)=>{
        let userInfo = {
            status: 'group',
            name: item.groupname,
            groupid: item.key,
            groupadminid: item.adminid,
        };
        dispatch(activeChat(userInfo))
    };

  return (
    <div className='grouplist'>
            <div style={{display:'flex', justifyContent: 'Space-between'}}>
            <h2>Groups List</h2>
             
        </div>

        {grouplist.map((item)=>(
       
            <div className='box' onClick={()=> handleActivechat(item)}>
            <div className='img'>
                <img src='assets/images/groupimg.png'/>
            </div>
            <div className='name'>
                <h1>{item.groupname}</h1>
                <h4>{item.grouptagline} {item.adminid != auth.currentUser.uid?"":"(Admin)"}</h4>
                {/* <h4>Admin : {item.key}</h4> */}
            </div>
            <div className='button'>
            <button><AiFillMessage/></button>
            </div>
            </div>

       ))}

     
            {/* <div className='box'>
            <div className='img'>
                <img src='assets/images/groupimg.png'/>
            </div>
            <div className='name'>
                <h1>MERN</h1>
                <h4>Be a Mern Star</h4>
            </div>
            <div className='button'>
                <button><AiFillMessage/></button>
            </div>
            </div>
            <div className='box'>
            <div className='img'>
                <img src='assets/images/groupimg.png'/>
            </div>
            <div className='name'>
                <h1>MERN</h1>
                <h4>Be a Mern Star</h4>
            </div>
            <div className='button'>
                <button><AiFillMessage/></button>
            </div>
            </div>
            <div className='box'>
            <div className='img'>
                <img src='assets/images/groupimg.png'/>
            </div>
            <div className='name'>
                <h1>MERN</h1>
                <h4>Be a Mern Star</h4>
            </div>
            <div className='button'>
                <button><AiFillMessage/></button>
            </div>
            </div>
            <div className='box'>
            <div className='img'>
                <img src='assets/images/groupimg.png'/>
            </div>
            <div className='name'>
                <h1>MERN</h1>
                <h4>Be a Mern Star</h4>
            </div>
            <div className='button'>
                <button><AiFillMessage/></button>
            </div>
            </div>
            <div className='box'>
            <div className='img'>
                <img src='assets/images/groupimg.png'/>
            </div>
            <div className='name'>
                <h1>MERN</h1>
                <h4>Be a Mern Star</h4>
            </div>
            <div className='button'>
                <button><AiFillMessage/></button>
            </div>
            </div>
            <div className='box'>
            <div className='img'>
                <img src='assets/images/groupimg.png'/>
            </div>
            <div className='name'>
                <h1>MERN</h1>
                <h4>Be a Mern Star</h4>
            </div>
            <div className='button'>
                <button><AiFillMessage/></button>
            </div>
            </div>
            <div className='box'>
            <div className='img'>
                <img src='assets/images/groupimg.png'/>
            </div>
            <div className='name'>
                <h1>MERN</h1>
                <h4>Be a Mern Star</h4>
            </div>
            <div className='button'>
                <button><AiFillMessage/></button>
            </div>
            </div> */}
        </div>
 
  );
};

export default JoinGroupList
import React , {useEffect, useState}from 'react'
import { getDatabase, ref, set,push,onValue } from "firebase/database";
import { getAuth } from "firebase/auth";

const MyGroup = () => {
    const auth = getAuth();
    const db = getDatabase();
    const [grouplist, setGroupTaglist] = useState([]);
    
    
    useEffect(()=>{
        let arr = [];
        const starCountRef = ref(db, 'groups/');
        onValue(starCountRef, (snapshot) => {
            snapshot.forEach(item=>{
                let groupinfo = {
                    adminid: item.val().adminid,
                    adminname: item.val().adminname,
                    groupname: item.val().groupname,
                    grouptagline: item.val().grouptagline,
                    key: item.key,
                }
                arr.push(groupinfo);
            });
        });
        setGroupTaglist(arr);

    },[])
  return (
    <div className='grouplist mygroup'>
        <h2>My Group</h2>

        {grouplist.map((item)=>(
        item.adminid == auth.currentUser.uid &&
            <div className='box'>
            <div className='img'>
                <img src='assets/images/groupimg.png'/>
            </div>
            <div className='name'>
                <h1>{item.groupname}</h1>
                <h4>{item.grouptagline}</h4>
                {/* <h4>Admin : {item.adminname}</h4> */}
            </div>
            <div className='button'>
                <button>Info</button>
            </div>
            </div>

       ))} 

    </div>
  )
}

export default MyGroup
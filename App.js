import React, { useState } from 'react';
import './app.css'
import {createUserWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  signInWithEmailAndPassword} from 'firebase/auth';
import {auth} from './firebase-config'
import { getDocs ,setDoc , doc, query, where,collection} from "firebase/firestore";
import { db} from './firebase-config';



const App = () =>{

  const [registerName,setRegisterName]=useState("");
  const [registerEmail,setRegisterEmail]=useState("");
  const [registerPassword,setRegisterPassword]=useState("");
  const [registerDesignation,setRegisterDesignation]=useState("");

  const [loginEmail,setLoginEmail]=useState("");
  const [loginPassword,setLoginPassword]=useState("");

  const [user,setUser]=useState({});

  const usersCollectionRef = collection(db, "User");


  onAuthStateChanged(auth, (currentUser)=>{
    setUser(currentUser)
  })

  const register = async () =>{
    try{
      const user = await createUserWithEmailAndPassword(auth,registerEmail,registerPassword).then(cred => {
        setDoc(doc(db, 'User', cred.user.uid),{
          Name: registerName, 
          Email: registerEmail, 
          Designation: registerDesignation
        })

      });
      console.log(user)
    }catch(error){
      console.log(error)
    }
  }
  const login = async () =>{
    try{
      await signInWithEmailAndPassword(auth,loginEmail,loginPassword);
      
      const q = query(usersCollectionRef, where("Email", "==", loginEmail));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        const data = (doc.id, " => ", doc.data());
        console.log(data.Designation)
      });
    }catch(error){
      alert("wrong email or password")
      console.log(error)
    }

  }
  const logout = async () =>{
    await signOut(auth)
  }
  return(
    <div className='app'>
      <div>
        <h1>Register User</h1>
        <input type='Name' placeholder='Name..' onChange={(event)=> setRegisterName(event.target.value)}/> <br/>
        <input type='Email' placeholder='Email..' onChange={(event)=> setRegisterEmail(event.target.value)}/> <br/>
        <input type='Password' placeholder='Password..' onChange={(event)=> setRegisterPassword(event.target.value)}/> <br/>
        <input type='Designation' placeholder='Designation..' onChange={(event)=> setRegisterDesignation(event.target.value)}/> <br/>
        <button onClick={register}>create user</button>
      </div>

      <div>
        <h1>login User</h1>
        <input type='email' onChange={(event)=> setLoginEmail(event.target.value)} /> <br/>
        
        <input type='password' onChange={(event)=> setLoginPassword(event.target.value)} /><br/>
        <button onClick={login} >Login</button>
      </div>

      <h2>Logged in</h2>
      {user?.email}

      <button onClick={logout}>SignOut:</button>

</div>
  );
}

export default App;
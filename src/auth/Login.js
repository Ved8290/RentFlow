

const Login = async (email, password) => {
  try {
    const ROOT = import.meta.env.VITE_API_URL;

    const res = await fetch(`${ROOT}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    // handle HTTP errors (VERY IMPORTANT)
    if (!res.ok) {
      return {
        success: false,
        message: data.message || "Login failed"
      };
    }

    return data;

  } catch (err) {
    console.error("Error:", err);

    return {
      success: false,
      message: "Server not reachable"
    };
  }
};

const Signup=(email,name,password ,uid )=>{
    
    const ROOT= import.meta.env.VITE_API_URL;
     return fetch(`${ROOT}/auth/signup`,{
        method:'POST',
        headers:{
            'Content-Type':'application/json'
        },
        body:JSON.stringify({email,name,password,uid})
    }).then(res=>res.json())
    .catch(err=>console.error('Error:',err));
    
}   

const AddProperty=(city,numberOfRooms,name,owner)=>{
    const ROOT= import.meta.env.VITE_API_URL;
     const uid = Date.now().toString(); 
    return fetch(`${ROOT}/api/add`,{    
        method:'POST',
        headers:{
            'Content-Type':'application/json'
        },
        body:JSON.stringify({city,numberOfRooms,name,owner,uid})
    }).then(res=>res.json())
    .catch(err=>console.error('Error:',err));
}


export {Login,Signup,AddProperty};


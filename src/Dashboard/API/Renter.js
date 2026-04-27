const Root = import.meta.env.VITE_API_URL;
const newRenter = async (renter) => {
    const response = await fetch('/api/add/newrenter', {
        method: 'POST', 
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(renter)
    });
    return response.json();
}

const getRenters = async (ownerID) => {
    const response = await fetch(`${Root}/api/renters/${ownerID}`);
    const data=await response.json();
    return data;
}

const deleteRenters = async (Rid) => {
  const response = await fetch(`${Root}/api/renter/delete/${Rid}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Failed to delete renter');
  }

  return await response.json();
};

const markAPaid=async(id)=>{
    
    const response= await fetch(`${Root}/api/renter/markPaid/${id}`,{
        method:"PATCH"
    });

     if (!response.ok) {
    throw new Error('Failed to Update');
  }

  return await response.json();
}

const searchRenters=async(id)=>{
    const response= await fetch(`${Root}/api/renters/search/${id}`);
      const data=await response.json();
    return data;
}

export { newRenter, getRenters ,deleteRenters ,markAPaid  , searchRenters};

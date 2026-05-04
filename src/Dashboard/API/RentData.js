const Root = import.meta.env.VITE_API_URL;

 const newRentData = async ({ id, ownerID, data }) => {
  const response = await fetch(`${Root}/api/renter/${id}/pay/${ownerID}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to create rent data');
  }

  return await response.json();
}


 const updateRent = async ({ id, status }) => {
  const response = await fetch(`${Root}/api/renter/${id}/${status}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id, status }),
  });

  if (!response.ok) {
    throw new Error('Failed to create rent data');
  }

  return await response.json();
}

const paymentList=async(id)=>{
  try {
    const response = await fetch(`${Root}/api/renters/rentData/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch payment data');
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching payment data:", error);
    return null;
  }
};

export {newRentData, updateRent, paymentList};
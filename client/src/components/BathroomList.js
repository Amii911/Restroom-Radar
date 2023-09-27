import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function BathroomList({ bathrooms, handleDeleteBathroom }) {
  const [allBathrooms, setAllBathrooms] = useState(bathrooms);
  const navigate = useNavigate();

  const handleDelete = (id) => {
    fetch(`/bathrooms/${id}`, {
      method: 'DELETE',
    })
      .then((id) => {
        handleDeleteBathroom(id);
        navigate('/bathrooms');
      })
      .catch((error) => {
        console.error('Error deleting bathroom:', error);
      });
  };

  useEffect(() => {
    // Fetch and update the bathroom data when the component mounts
    fetch('/bathrooms')
      .then((resp) => resp.json())
      .then((data) => setAllBathrooms(data))
      .catch((error) => {
        console.error('Error fetching bathrooms:', error);
      });
  }, []);

  return (
    <div className="bathroom-list">
      {allBathrooms.map((bathroom, i) => (
        <div className="bathroom-preview" key={i}>
          <Link to={`/bathrooms/${bathroom.id}`}>
            <h2>{bathroom.bathroom_name}</h2>
            <p>Address: {bathroom.street_num} {bathroom.street_name}</p>
            <p>City: {bathroom.city}</p>
            <p>Zip Code: {bathroom.zip_code}</p>
            </Link>
            <button onClick={() => handleDelete(bathroom.id)} className="btn-primary">Delete</button>
        </div>
      ))}
    </div>
  );
}

export default BathroomList;
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Reviews from './Reviews';
import EditBathroom from './EditBathroom';

const BathroomDetails = ({ currentUser }) => {
  const navigate = useNavigate()
  const { id } = useParams();
  const [bathroom, setBathroom] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetch(`/bathrooms/${id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        setBathroom(data);
      })
      .catch((error) => {
        console.error('Fetch error:', error);
      });
  }, [id]);

  const handleEditBathroomClick = () => {
    // Navigate to the EditBathroom route when the button is clicked
    navigate(`/bathrooms/${id}/edit`);
  };
  const handleUpdate = (updatedBathroom) => {
    setBathroom(updatedBathroom);
    setIsEditing(false);
    navigate(`/bathrooms`);
  };

  return (
    <div className="bathroom-details">
      {!bathroom && <div>Loading...</div>}
      {bathroom && (
        <div>
          <h2>{bathroom.bathroom_name}</h2>
          {isEditing ? (
            <EditBathroom bathroom={bathroom} handleUpdate={handleUpdate} />
          ) : (
            <div>
              <p>Address: {bathroom.street_num} {bathroom.street_name}</p>
              <p>City: {bathroom.city}</p>
              <p>Zip Code: {bathroom.zip_code}</p>
              <hr />
              <Reviews reviews={bathroom.reviews} bathroom={bathroom} user={currentUser} />
              <button onClick={handleEditBathroomClick}>Edit Bathroom</button>
              <Link to="/">Back to Home</Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BathroomDetails;
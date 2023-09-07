import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useFetch from './useFetch';

const BathroomDetails = ({data}) => {
    const { id } = useParams();
    const bathroom = data.find((bathroom) => bathroom.id===parseInt(id))

    const navigate = useNavigate();
    
    const handleClick = () => {
        fetch('http://127.0.0.1:5555/bathrooms/' + bathroom.id, { // Fixed the URL and used 'bathroom.id'
            method: 'DELETE'
        }).then(() => {
            navigate('/bathrooms');
        });
    };

    return (
        <div className="blog-details">
            {!bathroom && <div>Loading...</div>}
            {bathroom && ( 
                <article>
                    <h2>{bathroom.bathroom_name}</h2>
                    <div>{bathroom.bathroom_review}</div> 
                    <button onClick={handleClick}>delete</button>
                </article>
            )}
        </div>
    );
};

export default BathroomDetails;
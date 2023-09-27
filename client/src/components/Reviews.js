import React, { useState } from 'react';

function Reviews({ reviews, bathroom, user }) {
  let initialState = {
    content: '',
    bathroom_id: bathroom ? bathroom.id : null, // Check if bathroom is null
    user_id: user ? user.id : null, // Check if user is null
  };

  const [newReview, setNewReview] = useState(initialState);
  const [allReviews, setAllReviews] = useState(reviews);

  function updatedReviews(str) {
    let updatedReviews = [...allReviews, str];
    setAllReviews(updatedReviews);
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewReview({ ...newReview, [name]: value });
  };

  const handleSubmit = () => {
    fetch("/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newReview),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        updatedReviews(data);
        setNewReview(initialState);
      })
      .catch((error) => {
        console.error("Fetch error:", error);
      });
  };

  return (
    <div>
      <h3>REVIEWS:</h3>
      <textarea
        name="content"
        value={newReview.content}
        onChange={handleInputChange}
        placeholder="Write your review here"
      ></textarea>
      <br/>
      <button onClick={handleSubmit} className="btn-primary">
        Create a Review
      </button>
      <ul>
        {allReviews.map((review) => (
          <li key={review.id}>{review.content}</li>
        ))}
      </ul>
    </div>
  );
}

export default Reviews;




// import React from 'react';
// import { useFormik } from 'formik';

// function Reviews({ reviews }) {
//   const handleDelete = (id) => {
//     // Add your delete logic here using the review id
//     console.log(`Deleting review with ID: ${id}`);
//   };

//   const handleEdit = (id) => {
//     // Add your edit logic here using the review id
//     console.log(`Editing review with ID: ${id}`);
//   };

//   const initialValues = {
//     reviewContent: '',
//   };

//   const onSubmit = (values, { resetForm }) => {
//     // Handle the submission of the review content here
//     console.log('Review submitted:', values.reviewContent);
//     resetForm();
//   };

//   const formik = useFormik({
//     initialValues,
//     onSubmit,
//   });

//   return (
//     <div className="reviews">
//       <h3>REVIEWS:</h3>
//       <form className="review-form" onSubmit={formik.handleSubmit}>
//         <div className="form-group">
//           <label htmlFor="reviewContent">Add a Review:</label>
//           <input
//             id="reviewContent"
//             name="reviewContent"
//             type="text"
//             className="form-control"
//             onChange={formik.handleChange}
//             value={formik.values.reviewContent}
//           />
//         </div>
//         <button type="submit" className="btn btn-primary">Submit</button>
//       </form>
//       <ul className="review-list">
//         {reviews.map((review) => (
//           <li key={review.id} className="review-item">
//             {review.content}
//             <button onClick={() => handleDelete(review.id)} className="btn btn-danger">Delete</button>
//             <button onClick={() => handleEdit(review.id)} className="btn btn-secondary">Edit</button>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }

// export default Reviews;
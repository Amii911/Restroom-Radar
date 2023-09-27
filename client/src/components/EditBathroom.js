import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

function EditBathroom() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [bathroom, setBathroom] = useState(null);

  const initialValues = {
    bathroom_name: bathroom ? bathroom.bathroom_name : "",
    street_num: bathroom ? bathroom.street_num : "",
    street_name: bathroom ? bathroom.street_name : "",
    city: bathroom ? bathroom.city : "",
    zip_code: bathroom ? bathroom.zip_code : "",
  };

  const validationSchema = Yup.object().shape({
    bathroom_name: Yup.string().required("Bathroom Name is required"),
    street_num: Yup.string().required("Street Number is required"),
    street_name: Yup.string().required("Street Name is required"),
    city: Yup.string().required("City is required"),
    zip_code: Yup.string().max(5).required("Zip Code is required"),
  });

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

  const handleSubmit = (values) => {
    fetch(`/bathrooms/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then(() => {
        navigate(`/bathrooms/${id}`); // Redirect to BathroomDetails after successful update
      })
      .catch((error) => {
        console.error("Fetch error:", error);
      });
  };

  const cityOptions = [
    "Brooklyn",
    "Queens",
    "New York",
    "Staten Island",
    "Bronx",
  ];

  return (
    <div className="primary-btn">
      <h2>Edit Bathroom</h2>
      {bathroom ? (
        <div>
          <h3>Bathroom Details</h3>
          <p>Bathroom Name: {bathroom.bathroom_name}</p>
          <p>Street Number: {bathroom.street_num}</p>
          <p>Street Name: {bathroom.street_name}</p>
          <p>City: {bathroom.city}</p>
          <p>Zip Code: {bathroom.zip_code}</p>
        </div>
      ) : (
        <div>Loading bathroom details...</div>
      )}
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {(formik) => (
          <Form className="form">
            <label htmlFor="bathroom_name">Bathroom Name:</label>
            <Field
              type="text"
              id="bathroom_name"
              name="bathroom_name"
              placeholder="Edit bathroom"
              required
            />
            <ErrorMessage
              name="bathroom_name"
              component="div"
              className="error"
            />

            <label htmlFor="street_num">Street Number:</label>
            <Field
              type="text"
              id="street_num"
              name="street_num"
              placeholder="Edit street number"
              required
            />
            <ErrorMessage name="street_num" component="div" className="error" />

            <label htmlFor="street_name">Street Name:</label>
            <Field
              type="text"
              id="street_name"
              name="street_name"
              placeholder="Edit street name"
              required
            />
            <ErrorMessage
              name="street_name"
              component="div"
              className="error"
            />

            <label htmlFor="city">City:</label>
            <Field as="select" id="city" name="city" required>
              <option value="">Select a city</option>
              {cityOptions.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </Field>
            <ErrorMessage name="city" component="div" className="error" />

            <label htmlFor="zip_code">Zip Code:</label>
            <Field
              type="text"
              id="zip_code"
              name="zip_code"
              placeholder="Edit zip code"
              required
            />
            <ErrorMessage name="zip_code" component="div" className="error" />

            <button type="submit">Save Changes</button>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default EditBathroom;
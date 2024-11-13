import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const HomePage = () => {
  const [forms, setForms] = useState([]);

  useEffect(() => {
    const fetchForms = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_SERVER_URL}/forms`
        );
        setForms(response.data);
      } catch (error) {
        console.error("Error fetching forms", error);
      }
    };
    fetchForms();
  }, []);

  const deleteForm = async (id) => {
    try {
      await axios.delete(`${process.env.REACT_APP_SERVER_URL}/forms/${id}`);
      setForms(forms.filter((form) => form._id !== id));
    } catch (error) {
      console.error("Error deleting form", error);
    }
  };

  return (
    <div className="flex flex-col justify-center min-h-screen  mx-auto bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500">
      <div className="p-4 text-center text-white">
        <h1 className="text-5xl font-bold mb-2 animate-pulse">
          Welcome to Form.com
        </h1>
        <h2 className="mb-6 text-xl">This is a simple form builder</h2>

        <Link to="/form/create">
          <button className="bg-white text-pink-500 px-6 py-2 rounded-full shadow-lg hover:bg-pink-100 transition duration-300">
            Create New Form
          </button>
        </Link>
      </div>

      <div className="mt-10">
        {forms.length > 0 && (
          <h1 className="text-3xl font-semibold my-6 text-white text-center">
            Forms
          </h1>
        )}

        <div className="flex flex-wrap justify-center">
          {forms.map((form) => (
            <div
              key={form._id}
              className="m-4 p-6 bg-white rounded-2xl shadow-2xl transform hover:scale-105 transition duration-300"
            >
              <Link to={`/form/${form._id}`}>
                <h2 className="text-2xl font-bold text-pink-500 mb-4">
                  {form.formName}
                </h2>
              </Link>
              <div className="flex justify-center">
                <Link
                  to={`/form/${form._id}`}
                  className="text-white bg-green-400 px-4 py-2 rounded-full mx-2 hover:bg-green-500 transition duration-300"
                >
                  VIEW
                </Link>
                <Link
                  to={`/form/${form._id}/edit`}
                  className="text-white bg-blue-400 px-4 py-2 rounded-full mx-2 hover:bg-blue-500 transition duration-300"
                >
                  EDIT
                </Link>
                <button
                  onClick={() => deleteForm(form._id)}
                  className="text-white bg-red-400 px-4 py-2 rounded-full mx-2 hover:bg-red-500 transition duration-300"
                >
                  DELETE
                </button>
              </div>
            </div>
          ))}

          {forms.length === 0 && (
            <div className="text-white text-center w-full">
              Create a new form to get started.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;

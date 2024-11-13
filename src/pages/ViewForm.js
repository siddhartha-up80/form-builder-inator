import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const ViewForm = () => {
  const { id } = useParams();
  const [formName, setFormName] = useState("");
  const [fields, setFields] = useState([]);

  useEffect(() => {
    const fetchForm = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_SERVER_URL}/forms/${id}`
        );
        setFormName(response.data.formName);
        setFields(response.data.fields);
      } catch (error) {
        console.error("Error fetching form", error);
      }
    };
    fetchForm();
  }, [id]);

  return (
    <div className="flex flex-col items-center min-h-screen p-8 bg-gradient-to-br from-green-200 via-blue-200 to-purple-200">
      <form className="w-full max-w-lg bg-white rounded-3xl shadow-xl p-6">
        <h1 className="text-4xl font-bold text-center text-purple-600 mb-6 ">
          {formName}
        </h1>
        <div className="grid grid-cols-2 gap-6">
          {fields.map((field, index) => (
            <div key={index}>
              <label
                htmlFor={`field-${index}`}
                className="block text-xl font-medium text-gray-700 mb-2"
              >
                {field.title}
              </label>
              <input
                type={field.type.toLowerCase()}
                placeholder={field.placeholder}
                id={`field-${index}`}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300"
              />
            </div>
          ))}
        </div>
        <div className="flex justify-center mt-8">
          <button className="bg-green-500 text-white px-6 py-3 rounded-full shadow-lg hover:bg-green-600 transition duration-300">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default ViewForm;

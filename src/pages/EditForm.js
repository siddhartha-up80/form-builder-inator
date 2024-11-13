import { GripVertical, Pencil, Trash } from "lucide-react";
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import axios from "axios";

const EditForm = () => {
  const { id } = useParams();
  const [formName, setFormName] = useState("Form Name");
  const [fields, setFields] = useState([]);
  const [selectedField, setSelectedField] = useState(null);
  const [fieldType, setFieldType] = useState("");
  const [title, setTitle] = useState("");
  const [placeholder, setPlaceholder] = useState("");
  const navigate = useNavigate();

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

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const reorderedFields = Array.from(fields);
    const [movedField] = reorderedFields.splice(result.source.index, 1);
    reorderedFields.splice(result.destination.index, 0, movedField);
    setFields(reorderedFields);
  };

  const editField = (index) => {
    setSelectedField(index);
    setFieldType(fields[index].type);
    setTitle(fields[index].title);
    setPlaceholder(fields[index].placeholder);
  };

  const updateField = () => {
    const updatedFields = fields.map((field, index) =>
      index === selectedField ? { ...field, title, placeholder } : field
    );
    if (selectedField === "Form Name") {
      setFormName(title);
    }
    setFields(updatedFields);
    setSelectedField(null);
    setTitle("");
    setPlaceholder("");
  };

  const deleteField = (index) => {
    const updatedFields = fields.filter((_, i) => i !== index);
    setFields(updatedFields);
  };

  const handleSave = async () => {
    try {
      await axios.put(`${process.env.REACT_APP_SERVER_URL}/forms/${id}`, {
        formName,
        fields,
      });
      navigate("/");
    } catch (error) {
      console.error("Error updating form", error);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen p-8 bg-gradient-to-br from-pink-200 via-purple-200 to-indigo-200">
      <h1 className="text-4xl font-bold text-purple-700 mb-6 animate-bounce">
        Edit Form
      </h1>

      <div className="flex gap-6 w-full max-w-5xl">
        <div className="w-2/3 bg-white rounded-3xl shadow-xl p-6">
          <div className="text-3xl font-semibold text-center text-purple-600 flex items-center justify-center mb-6">
            {formName}
            <Pencil
              className="ml-2 cursor-pointer"
              onClick={() => {
                setSelectedField("Form Name");
                setFieldType("Form Name");
                setTitle(formName);
                setPlaceholder(null);
              }}
            />
          </div>

          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="droppable">
              {(provided) => (
                <div
                  className="grid grid-cols-1 gap-4"
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  {fields.map((field, index) => (
                    <Draggable
                      key={index}
                      draggableId={String(index)}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className="flex justify-between items-center p-4 bg-purple-50 rounded-xl shadow-md"
                        >
                          <div className="flex items-center">
                            <div {...provided.dragHandleProps}>
                              <GripVertical className="text-purple-400 mr-2 cursor-move" />
                            </div>
                            <span className="text-purple-700 font-medium">
                              {field.title || field.type}
                            </span>
                          </div>
                          <div className="flex gap-2">
                            <Pencil
                              className="text-blue-500 cursor-pointer"
                              onClick={() => editField(index)}
                            />
                            <Trash
                              className="text-red-500 cursor-pointer"
                              onClick={() => deleteField(index)}
                            />
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>

          <div className="flex justify-center mt-8">
            <button
              onClick={handleSave}
              className="bg-green-500 text-white px-6 py-3 rounded-full shadow-lg hover:bg-green-600 transition duration-300"
            >
              Save
            </button>
          </div>
        </div>

        <div className="w-1/3 bg-white rounded-3xl shadow-xl p-6">
          <h1 className="text-2xl font-semibold text-center text-purple-600 mb-6">
            Form Editor
          </h1>

          {selectedField !== null ? (
            <div>
              <h2 className="text-xl font-bold text-center text-gray-700 mb-4">
                {fieldType}
              </h2>
              <label className="block text-gray-600 mb-2">Title</label>
              <input
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-3 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300"
              />
              {placeholder !== null && (
                <>
                  <label className="block text-gray-600 mb-2">
                    Placeholder
                  </label>
                  <input
                    type="text"
                    placeholder="Placeholder"
                    value={placeholder}
                    onChange={(e) => setPlaceholder(e.target.value)}
                    className="w-full p-3 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300"
                  />
                </>
              )}
              <button
                onClick={updateField}
                className="w-full bg-blue-500 text-white px-4 py-2 rounded-full shadow hover:bg-blue-600 transition duration-300"
              >
                Update Field
              </button>
            </div>
          ) : (
            <div className="text-center text-gray-500 mt-6">
              Select a field to edit
            </div>
          )}
        </div>
      </div>

      <div className="mt-8">
        <button
          className="bg-green-500 text-white px-6 py-3 rounded-full shadow-lg hover:bg-green-600 transition duration-300"
          onClick={handleSave}
        >
          Save Form
        </button>
      </div>
    </div>
  );
};

export default EditForm;

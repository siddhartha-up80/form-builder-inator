import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import CreateForm from "./pages/CreateForm";
import EditForm from "./pages/EditForm";
import ViewForm from "./pages/ViewForm";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/form/create" element={<CreateForm />} />
          <Route path="/form/:id/edit" element={<EditForm />} />
          <Route path="/form/:id" element={<ViewForm />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

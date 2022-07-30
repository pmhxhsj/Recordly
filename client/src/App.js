import React from "react";
import { Route, Routes } from "react-router-dom";
import LoginPage from "pages/loginPage";
import Main from "pages/main";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/main" element={<Main />} />
    </Routes>
  );
};

export default App;
import { Route, Routes, HashRouter } from "react-router-dom";
import "./App.css";
import Homepage from "./Homepage";
import React from "react";
import { Provider } from "react-redux";
import store from "../redux/store";

function Layout() {
  const MyRoutes = () => {
    return (
      <Routes>
        <Route path="/" element={<Homepage />} />
      </Routes>
    );
  };

  return (
    <div className="container">
      <MyRoutes></MyRoutes>
    </div>
  );
}

function App() {
  try {
    return (
      <Provider store={store}>
        <HashRouter>
          <Layout></Layout>
        </HashRouter>
      </Provider>
    );
  } catch (error) {
    console.error(error);
  }
}

export default App;

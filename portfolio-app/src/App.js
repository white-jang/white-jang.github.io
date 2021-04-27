import React from "react";
import Header from "./components/Header";
import { HashRouter as Router, Route } from "react-router-dom";
import "./App.scss";
import "./components/reset.css";
import PageList from "./components/PageList";

function App() {
  return (
    <Router>
      <Route
        render={({ location }) =>
          (
            <div>
              <Header />
              <PageList location={location} />
            </div>
          ).props.children
        }
      />
    </Router>
  );
}

export default App;

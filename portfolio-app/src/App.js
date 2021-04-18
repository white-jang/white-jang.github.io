import "./App.scss";
import "./components/reset.css";
import Header from "./components/Header";
import { Route } from "react-router-dom";
import About from "./containers/About";
import Memo from "./containers/Memo";

function App() {
  return (
    <>
      <Header />
      <Route path="/" component={About} exact={true} />
      <Route path="/memo" component={Memo} />
    </>
  );
}

export default App;

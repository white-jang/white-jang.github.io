import React from "react";
import { Switch, Route } from "react-router-dom";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import About from "../containers/About";
import Memo from "../containers/Memo";
import Todo from "../containers/Todo";

// eslint-disable-next-line import/no-anonymous-default-export
export default ({ location }) => (
  <TransitionGroup>
    <CSSTransition
      key={location.pathname}
      timeout={{ enter: 300, exit: 300 }}
      classNames="frame"
    >
      <Switch location={location}>
        <Route path="/" component={About} exact={true} />
        <Route path="/memo" component={Memo} />
        <Route path="/todo" component={Todo} />
      </Switch>
    </CSSTransition>
  </TransitionGroup>
);

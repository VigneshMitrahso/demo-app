import { createStore, compose, applyMiddleware } from "redux";
import thunk from "redux-thunk";

import reducers from "./reducer/index";
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(reducers, composeEnhancers(applyMiddleware()));

const customMiddleWare = (store) => (next) => (action) => {
  next(action, store);
};

const configStore = () => {
  const store = createStore(
    reducers,
    {},
    compose(applyMiddleware(thunk, customMiddleWare)),
  );
  return store;
};
export default configStore;

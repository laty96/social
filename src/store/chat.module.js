import db from "../database/firestore";
import query from "../database/db.actions";
import { CREATE_CONVERSATION } from "./actions.type";

var state = {};
var getters = {};
var mutations = {};
var actions = {
  [CREATE_CONVERSATION](c, i) {
    console.log(i);
  }
};

var plugins = {};

export default {
  state,
  getters,
  mutations,
  actions,
  plugins
};

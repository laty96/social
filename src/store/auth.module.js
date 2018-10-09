import {
  USER_LOGIN_G_AUTH,
  USER_LOGOUT_G_AUTH,
  REMOVE_USER,
  USER_ONLINE,
  GET_USER_LIST,
  LOGIN_WITH_G
} from "./actions.type";

import { SET_USER, UNSET_USER, SET_USER_LIST } from "./mutations.type";

import db from "../database/firestore";
import query from "../database/db.actions";

import router from "../router/index";

var state = {
  user: "",
  userInfo: {
    name: "",
    email: "",
    status: "",
    imgURL: ""
  },
  userList: []
};
var getters = {
  isSigned() {
    return JSON.parse(localStorage.getItem("signed"));
  },
  userInfo: state => state.userInfo,
  getUserList: state => state.userList
};
var mutations = {
  [SET_USER](state, u) {
    u.status = true;
    state.userInfo = u;
  },
  [UNSET_USER](state) {
    state.userInfo = {};
  },
  [SET_USER_LIST](state, u) {
    state.userList = u;
  }
};
var actions = {
  [USER_LOGIN_G_AUTH](c, u) {
    // if (this.isSigned) {
    //   return;
    // } else {
    localStorage.setItem("signed", true);
    query.searchQuery(
      "users",
      "email",
      "==",
      u.email,
      db,
      doc => {
        if (!doc.length) {
          query.addUser(
            db,
            u,
            s => {
              let a = u;
              a.id = s.id;
              c.commit(SET_USER, s);
            },
            err => console.log("err: " + err)
          );
        } else {
          c.commit(SET_USER, doc[0]);
        }
      },
      err => console.log(err),
      "name"
    );
    c.dispatch(USER_ONLINE, u);
    c.dispatch(GET_USER_LIST, u);

    router.push("/");
    // }
  },
  [USER_LOGOUT_G_AUTH](c) {
    console.log(this.isSigned);
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(() => {
      window.location = "/";
      console.log("User signed out.");
      localStorage.setItem("signed", false);
      // if (this.isSigned) {
      // 	localStorage.setItem("signed", false);
      // } else {
      // 	return;
      // }
    });
  },
  [REMOVE_USER](c, u) {
    query.userOffline(db, u.email, () => {
      // c.commit(UNSET_USER);
      c.dispatch(USER_LOGOUT_G_AUTH);
    });
  },
  [USER_ONLINE](c, u) {
    query.userOnline(db, u.email);
  },
  [GET_USER_LIST](c, u) {
    query.getUserList(
      db,
      u,
      doc => {
        c.commit(SET_USER_LIST, doc);
      },
      err => console.log(err)
    );
  },
  [LOGIN_WITH_G](c) {
    gapi.signin2.render("my-signin2", {
      scope: "profile email",
      width: 240,
      height: 50,
      longtitle: true,
      theme: "dark",
      onsuccess: googleUser => {
        var profile = googleUser.getBasicProfile();
        let u = {
          name: profile.getName(),
          imgURL: profile.getImageUrl(),
          email: profile.getEmail(),
          status: true
        };
        c.dispatch(USER_LOGIN_G_AUTH, u);
      },
      onfailure: error => {
        console.log(error);
      }
    });
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

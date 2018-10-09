import { f } from "../database/firestore";
import userModel from "../models/user.model";

function deletePost(document, field, operator, value, db, errorCallback) {
  db.collection(document)
    .where(field, operator, value)
    .get()
    .then(querySnapshot => {
      querySnapshot.forEach(doc => {
        doc.ref.delete();
      });
    })
    .catch(err => errorCallback(err));
}

function fetchPosts(document, field, db, callback, errorCallback, order, time) {
  if (!order) order = "asc";
  let a = [];
  db.collection(document)
    .where("createdDate", "<", time)
    .orderBy(field, order)
    // .limit(10)
    .get()
    .then(function(querySnapshot) {
      querySnapshot.forEach(function(doc) {
        let i = doc.data();
        i.id = doc.id;
        a.push(i);
      });
      callback(a);
    })
    .catch(err => errorCallback(err));
}

function searchQuery(
  document,
  field,
  operator,
  value,
  db,
  callback,
  errorCallback,
  orderField = "id",
  order = "asc"
) {
  let a = [];
  db.collection(document)
    .where(field, operator, value)
    .orderBy(orderField, order)
    .get()
    .then(function(querySnapshot) {
      let a = [];
      querySnapshot.forEach(function(doc) {
        let b = doc.data();
        b.id = doc.id;
        a.push(b);
      });
      callback(a, querySnapshot);
    })
    .catch(err => errorCallback(err));
}

function createPost(document, payload, db, callback, errorCallback) {
  db.collection(document)
    .add(Object.assign({}, payload))
    .then(function(doc) {
      callback(doc);
    })
    .catch(err => errorCallback(err));
}

function addUser(db, userInfo, callback, errorCallback) {
  let u = new userModel(userInfo);
  db.collection("users")
    .add(Object.assign({}, u))
    .then(function(doc) {
      callback(doc);
    })
    .catch(err => errorCallback(err));
}

function postComment(document, db, id, c, callback, errorCallback) {
  let cmt = Object.assign({}, c);
  db.collection(document)
    .doc(id)
    .update({
      comment: f.FieldValue.arrayUnion(cmt),
      time: f.FieldValue.serverTimestamp()
    })
    .then(doc => callback(doc))
    .catch(err => errorCallback(err));
}

function likePost(document, db, id, user, callback, errorCallback) {
  let isLiked = false;
  db.collection(document)
    .doc(id)
    .get()
    .then(doc => {
      let a = doc.data();
      a.like.forEach(u => {
        if (u == user) {
          isLiked = true;
        }
      });
      if (isLiked) {
        db.collection(document)
          .doc(id)
          .update({
            like: f.FieldValue.arrayRemove(user)
          })
          .then(doc => {
            callback(doc);
          })
          .catch(err => errorCallback(err));
      } else {
        db.collection(document)
          .doc(id)
          .update({
            like: f.FieldValue.arrayUnion(user)
          })
          .then(doc => {
            callback(doc);
          })
          .catch(err => errorCallback(err));
      }
    });
}

function getPostComment(document, db, id, callback, errorCallback) {
  db.collection(document)
    .doc(id)
    .get()
    .then(doc => {
      let a = doc.data();
      callback(a.comment);
    })
    .catch(err => errorCallback(err));
}

function userOffline(db, email, callback) {
  db.collection("users")
    // .doc(id)
    .where("email", "==", email)
    .get()
    .then(querySnapshot => {
      let a = querySnapshot.docs[0].id;
      db.collection("users")
        .doc(a)
        .update({ status: false });
      callback();
    });
}

function userOnline(db, email) {
  db.collection("users")
    .where("email", "==", email)
    .get()
    .then(querySnapshot => {
      if (querySnapshot.docs) {
        let a = querySnapshot.docs[0].id;
        db.collection("users")
          .doc(a)
          .update({
            status: true,
            lastLogedIn: Date.now()
          });
      }
    });
}

function getUserList(db, u, callback, errorCallback) {
  db.collection("users").onSnapshot(function(querySnapshot) {
    let a = [];
    querySnapshot.forEach(doc => {
      let b = doc.data();
      b.id = doc.id;
      if (u.email != b.email) a.push(b);
    });
    callback(a);
  });
}

function createConversation(db, data, callback, errorCallback) {
  db.collection("conversations")
    .add(Object.assign({}, data))
    .then(function(doc) {
      callback(doc);
    })
    .catch(err => errorCallback(err));
}

const dataQuery = {
  searchQuery,
  fetchPosts,
  deletePost,
  createPost,
  addUser,
  postComment,
  likePost,
  getPostComment,
  userOffline,
  userOnline,
  getUserList,
  createConversation
};
export default dataQuery;

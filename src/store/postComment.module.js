import {
	POST_COMMENT,
	FETCH_COMMENT,
	FETCH_POST_LIST
} from "../store/actions.type";
import { POSTS } from "../database/db.documents";
import { SET_MODAL_COMMENT } from "./mutations.type";

import commentModel from "../models/comment.model";

import db from "../database/firestore";
import query from "../database/db.actions";

var state = {
	comment: []
};
var getters = {
	comment() {
		return state.comment;
	}
};
var mutations = {
	[SET_MODAL_COMMENT](state, i) {
		state.comment = i;
	}
};
var actions = {
	[POST_COMMENT](c, d) {
		// query.
		let cmt = new commentModel(d);
		query.postComment(
			POSTS,
			db,
			d.id,
			cmt,
			() => {
				c.dispatch(FETCH_POST_LIST);
				console.log("update success");
			},
			err => console.log(err)
		);
	},
	[FETCH_COMMENT](c, id) {
		console.log(id);
		query.getPostComment(
			POSTS,
			db,
			id,
			doc => {
				c.commit(SET_MODAL_COMMENT, doc);
				console.log(doc);
			},
			err => console.log(err)
		);
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

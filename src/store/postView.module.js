import {
	FETCH_POST_LIST,
	FETCH_POST_LIST_SCROLL,
	LIKE_POST,
	SEARCH_POST
} from "./actions.type";
import { SET_POST, SET_POST_SCROLL } from "./mutations.type";

import db from "../database/firestore";
import query from "../database/db.actions";

import { POSTS } from "../database/db.documents";
var state = {
	postList: []
};
var getters = {
	post() {
		return state.postList;
	}
};
var mutations = {
	[SET_POST](state, post) {
		state.postList = post;
	}
	// [SET_POST_SCROLL](state, post) {
	// 	state.postList = state.postList.concat(post);
	// }
};
var actions = {
	[FETCH_POST_LIST](c, i = Date.now()) {
		query.fetchPosts(
			POSTS,
			"createdDate",
			db,
			d => {
				c.commit(SET_POST, d);
			},
			e => {},
			"desc",
			i
		);
	},
	// [FETCH_POST_LIST_SCROLL](c, i = Date.now()) {
	// 	console.log(i);
	// 	query.fetchPosts(
	// 		POSTS,
	// 		"createdDate",
	// 		db,
	// 		d => {
	// 			console.log(d);

	// 			c.commit(SET_POST_SCROLL, d);
	// 		},
	// 		e => {},
	// 		"desc",
	// 		i
	// 	);
	// },
	[LIKE_POST](c, i) {
		query.likePost(
			POSTS,
			db,
			i.id,
			i.user,
			doc => console.log(doc),
			err => console.log(err)
		);
		c.dispatch(FETCH_POST_LIST);
	}
	// [SEARCH_POST](c, text) {
	// 	query.searchQuery(POSTS, 'title', ;
	// }
};
var plugins = {};

export default {
	state,
	getters,
	mutations,
	actions,
	plugins
};

import { randomID } from "../utilities/index";

export default class Comment {
	constructor(a) {
		this.commentID = randomID();
		this.owner = a.owner;
		this.createdTime = Date.now();
		this.like = [];
		this.content = a.content;
		this.reply = [];
		this.floor = a.floor++ || 0;
	}
}

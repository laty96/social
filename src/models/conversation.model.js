import { randomID } from "../utilities/index";

export default class Conversation {
	constructor(a) {
		this.commentID = randomID();
		this.owner = a.owner;
		this.createdTime = Date.now();
		this.content = a.content;
	}
}

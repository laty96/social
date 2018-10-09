import { randomID } from "../utilities/index";

export default class Post {
	constructor(a) {
		this.id = randomID();
		this.createdDate = Date.now();
		this.owner = a.owner;
		this.title = a.title;
		this.content = a.content;
		this.comment = [];
		this.like = [];
		this.img = a.img || [];
		this.tag = a.tag || [];
		this.flair = a.flair || [];
	}
}

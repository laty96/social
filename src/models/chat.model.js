export default class Conversation {
	constructor(a) {
		this.owner = a.owner;
		this.ownerId = a.ownerId;
		this.createdTime = Date.now();
		this.content = a.content;
		this.img = [];
	}
}

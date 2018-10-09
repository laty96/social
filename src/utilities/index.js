export function randomID() {
	return "_" + (Math.random() * Date.now()).toString(36).replace(".", "");
}

export function sortCmt(arr, field, order = true) {
	return arr.sort(function(a, b) {
		if (field == "like") return b.like.length - a.like.length;
		if (order) {
			return new Date(b[field]) - new Date(a[field]);
		} else {
			return new Date(a[field]) - new Date(b[field]);
		}
	});
}

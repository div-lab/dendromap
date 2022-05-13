class Link {
	constructor(data) {
		this.data = data;
		this.prev = undefined;
		this.next = undefined;
	}
}

// this can be improved by making it singly linked probably
export default class Queue {
	constructor() {
		this.start = new Link(undefined);
		this.end = new Link(undefined);
		this.size = 0;

		// connect the starts
		this.start.next = this.end;
		this.end.prev = this.start;
	}
	push(data) {
		let a = this.end.prev;
		let b = new Link(data);
		let c = this.end;

		// insert
		b.prev = a;
		b.next = c;

		// change the links around the insert
		a.next = b;
		c.prev = b;

		this.size++;
	}
	pop() {
		if (this.isEmpty()) return;

		let firstElem = this.start.next;
		let nextElem = firstElem.next;

		this.start.next = nextElem;
		nextElem.prev = this.start;

		this.size--;

		return firstElem.data;
	}
	isEmpty() {
		return this.size == 0;
	}
	print() {
		let curr = this.start.next;
		while (curr.next !== undefined) {
			console.log(curr.data);
			curr = curr.next;
		}
	}
}

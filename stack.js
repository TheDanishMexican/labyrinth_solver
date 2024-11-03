export default class Stack {
    constructor() {
        this.top = null;
        this.size = 0;
    }

    push(data) {
        const newNode = new Node(data);
        newNode.next = this.top;
        this.top = newNode;
        this.size++;
    }

    pop() {
        if (this.isEmpty()) {
            throw new Error("Stack is empty");
        }
        const dataToReturn = this.top.data;
        this.top = this.top.next;
        this.size--;
        return dataToReturn;
    }


    peek() {
        if (this.isEmpty()) {
            throw new Error("Stack is empty");
        }
        return this.top.data;
    }


    isEmpty() {
        return this.size === 0;
    }

    getSize() {
        return this.size;
    }
}

class Node {
    constructor(data) {
        this.data = data;
        this.next = null;
    }
}
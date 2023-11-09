
export default class SiriQueue {
    constructor({ handler }) {
        this.events     = [];
        this.handler    = handler;
    }

    push = (event) => {
        const id = Math.random().toString(16).substr(2, 8);
        const TIMEOUT_TO_CLEAR_FROM_QUEUE = 30000;
        const timeout = setTimeout(() => {
            const index = this.events.findIndex(e => e.id === id);

            this.events.splice(index, 1);
        }, TIMEOUT_TO_CLEAR_FROM_QUEUE);

        this.events.push({ ...event, id, timeout });
    }

    reduce = () => {
        let event;

        while (event = this.events.shift()) { // eslint-disable-line no-cond-assign
            const {  timeout, ...rest } = event;

            clearTimeout(timeout);
            this.handler(rest);
        }
    }
}

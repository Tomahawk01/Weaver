namespace Weaver {

    /** Represents message manager responsible for sending messages across the system */
    export class MessageBus {

        private static s_Subscriptions: { [code: string]: IMessageHandler[] } = {};

        private static s_NormalQueueMessagePerUpdate: number = 10;
        private static s_NormalMessageQueue: MessageSubscriptionNode[] = [];

        /** Constructor hidden to prevent instantiation */
        private constructor() {
        }

        /**
         * Adds a subscription to the privided code using provided handler
         * @param code Code to listen for
         * @param handler Handler to be subscribed
         */
        public static addSubscription(code: string, handler: IMessageHandler): void {
            if (MessageBus.s_Subscriptions[code] === undefined) {
                MessageBus.s_Subscriptions[code] = [];
            }

            if (MessageBus.s_Subscriptions[code].indexOf(handler) !== -1) {
                console.warn("Attempting to add a duplicate handler to code: " + code + ". Subscription not added");
            }
            else {
                MessageBus.s_Subscriptions[code].push(handler);
            }
        }

        /**
         * Removes a subscription to the privided code using provided handler
         * @param code Code to no longer listen for
         * @param handler Handler to be unsubscribed
         * @returns
         */
        public static removeSubscription(code: string, handler: IMessageHandler): void {
            if (MessageBus.s_Subscriptions[code] === undefined) {
                console.warn("Cannot unsubscribe handler from code: " + code + ". That code is not subscribed to");
                return;
            }

            let nodeIndex = MessageBus.s_Subscriptions[code].indexOf(handler);
            if (nodeIndex !== -1) {
                MessageBus.s_Subscriptions[code].splice(nodeIndex, 1);
            }
        }

        /**
         * Posts the provided message to the message system
         * @param message Message to be sent
         */
        public static post(message: Message): void {
            console.log("Message posted: ", message);
            let handlers = MessageBus.s_Subscriptions[message.code];
            if (handlers === undefined) {
                return;
            }

            for (let h of handlers) {
                if (message.priority === MessagePriority.HIGH) {
                    h.onMessage(message);
                }
                else {
                    MessageBus.s_NormalMessageQueue.push(new MessageSubscriptionNode(message, h));
                }
            }
        }

        /**
         * Performs update logic on this message bus
         * @param time Delta time in milliseconds since the last update
         */
        public static update(time: number): void {
            if (MessageBus.s_NormalMessageQueue.length === 0) {
                return;
            }

            let messageLimit = Math.min(MessageBus.s_NormalQueueMessagePerUpdate, MessageBus.s_NormalMessageQueue.length);
            for (let i = 0; i < messageLimit; ++i) {
                let node = MessageBus.s_NormalMessageQueue.pop();
                node.handler.onMessage(node.message);
            }
        }
    }
}
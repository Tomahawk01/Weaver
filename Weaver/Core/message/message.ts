namespace Weaver {

    /** Represents message priorities */
    export enum MessagePriority {
        /** Normal message priority, message will be sent as soon as the queue allows */
        NORMAL,
        /** High message priority, message will be sent immediately */
        HIGH
    }

    /** Represents a message which can be sent and processed across the system */
    export class Message {

        /** Code for this message, which is subscribed to and listened for */
        public code: string;
        /** Free-form context data to be included with this message */
        public context: any;
        /** Class instance which sent this message */
        public sender: any;
        /** Priority of this message */
        public priority: MessagePriority;

        /**
         * Creates a new message
         * @param code Code for this message, which is subscribed to and listened for
         * @param sender Class instance which send this message
         * @param context Free-form context data to be included with this message
         * @param priority Priority of this message
         */
        public constructor(code: string, sender: any, context?: any, priority: MessagePriority = MessagePriority.NORMAL) {
            this.code = code;
            this.sender = sender;
            this.context = context;
            this.priority = priority;
        }

        /**
         * Sends a normal-priority message with provided parameters
         * @param code Code for this message, which is subscribed to and listened for
         * @param sender Class instance which send this message
         * @param context Free-form context data to be included with this message
         */
        public static send(code: string, sender: any, context?: any): void {
            MessageBus.post(new Message(code, sender, context, MessagePriority.NORMAL));        
        }

        /**
         * Sends a high-priority message with provided parameters
         * @param code Code for this message, which is subscribed to and listened for
         * @param sender Class instance which send this message
         * @param context Free-form context data to be included with this message
         */
        public static sendPriority(code: string, sender: any, context?: any): void {
            MessageBus.post(new Message(code, sender, context, MessagePriority.HIGH));
        }

        /**
         * Subscribes the provided handler to listen for the message
         * @param code Code to listen for
         * @param handler Message handler to be called when a message containing the provided code is sent
         */
        public static subscribe(code: string, handler: IMessageHandler): void {
            MessageBus.addSubscription(code, handler);
        }

        /**
         * Unsubscribes the provided handler from listening for the message
         * @param code Code to no longer listen for
         * @param handler Message handler to unsubscribe
         */
        public static unsubscribe(code: string, handler: IMessageHandler): void {
            MessageBus.removeSubscription(code, handler);
        }
    }
}
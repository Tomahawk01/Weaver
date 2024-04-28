namespace Weaver {

    export interface IMessageHandler {

        onMessage(message: Message): void;
    }
}
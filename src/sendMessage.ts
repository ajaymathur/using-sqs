import { SQSClient, SendMessageCommand, ReceiveMessageCommand, DeleteMessageCommand } from '@aws-sdk/client-sqs';
require("dotenv").config();

const credentials = {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
};

async function sendMessage() {
    const client = new SQSClient({
        credentials,
        region: "ap-southeast-2",
    });

    for(let i = 0; i < 100; i++) {

        const sendMessageCommand = new SendMessageCommand({
            QueueUrl: process.env.QUEUE_URL,
            MessageBody: JSON.stringify({ id: i, message: `Message ${i}` })
        });

    await client.send(sendMessageCommand);
    }

    console.log("Message sent")
}

sendMessage().catch(err => console.log(err));

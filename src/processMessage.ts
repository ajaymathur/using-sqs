import { SQSClient, SendMessageCommand, ReceiveMessageCommand, DeleteMessageCommand } from '@aws-sdk/client-sqs';
require("dotenv").config();

const credentials = {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
};

const QueueUrl = process.env.QUEUE_URL;

function sleep(ms: number) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

async function processMessage() {
    const client = new SQSClient({
        credentials,
        region: "ap-southeast-2",
    });

    while (true) {
        await sleep(100);
        const receiveMessageCommand = new ReceiveMessageCommand({
            QueueUrl,
            MaxNumberOfMessages: 10
        })

        const data = await client.send(receiveMessageCommand);

        if (data === undefined || data.Messages === undefined || data.Messages.length === 0) continue;

        data.Messages.map(message => console.log(message.Body));

        if (data && data.Messages) {

            await Promise.all(data.Messages.map(async message => {
                const messageBody = JSON.parse(message.Body);
                if (messageBody.id %2 !== 0){
                    return;
                }
                const deleteMessage = new DeleteMessageCommand({
                    QueueUrl,
                    ReceiptHandle: message.ReceiptHandle
                });
    
                await client.send(deleteMessage); 
                console.log(`deleted: ${message.Body}`)
            }));
        }

    }
}

processMessage().catch(err => console.log(err));

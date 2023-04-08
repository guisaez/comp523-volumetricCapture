import { FileUpdatedListener } from "../file-updated-listener";
import { FileUpdatedEvent, FileTypes } from "@teamg2023/common";
import { File } from "../../../models/file";
import mongoose from "mongoose";
import { natsWrapper } from "../../../nats-wrapper";
import { Message } from 'node-nats-streaming';

const setup = async () => {

    const listener = new FileUpdatedListener(natsWrapper.client);

    const file = await File.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        type: FileTypes.INTRINSIC,
        userId: new mongoose.Types.ObjectId().toHexString(),
        name: 'intri.yml'
    })

    await file.save();

    const data: FileUpdatedEvent['data'] = {
        id: file.id,
        version: file.version + 1,
        name: 'intri_updated.yml',
        type: file.type,
        userId: file.userId
    }

    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }

    return { listener, data, file, msg };
}

it('finds, updates and saves a file', async () => {
    const { listener, data, msg, file } = await setup();

    await listener.onMessage(data, msg);

    const updatedTicket = await File.findById(file.id);

    expect(updatedTicket).toBeDefined();
    expect(updatedTicket!.version).toEqual(data.version);
    expect(updatedTicket!.name).toEqual(data.name);
});

it('acks the message', async () => {
    const { listener, data, msg } = await setup();

    await listener.onMessage(data, msg);

    expect(msg.ack).toHaveBeenCalled();
})

it('does not call ack if the event has a skipped version number', async () => {
    const { listener, data, msg } = await setup();

    data.version = 10;

    try{
        await listener.onMessage(data, msg);
    }catch(err){

    }
    
    expect(msg.ack).not.toHaveBeenCalled();
});
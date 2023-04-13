import { FileUploadedListener } from "../file-uploaded-listener";
import { natsWrapper } from "../../../nats-wrapper";
import { FileTypes, FileUploadedEvent } from "@teamg2023/common";
import { File } from "../../../models/file";
import { Project } from "../../../models/project";
import { Message } from 'node-nats-streaming';
import mongoose from "mongoose";

const setup = async () => {
    const listener = new FileUploadedListener(natsWrapper.client);

    const userId = new mongoose.Types.ObjectId().toHexString();

    const project = Project.build({
        userId : userId,
        projectName: 'Test'
    })

    await project.save();

    const data: FileUploadedEvent['data'] = {
        id: new mongoose.Types.ObjectId().toHexString(),
        version: 0,
        projectId: project.id,
        type: FileTypes.INTRINSIC,
        userId: project.userId,
        name: 'intri.yml'
    }

    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }

    return { listener, data, msg }

}

it('creates and saves a file', async () => {
    const { listener, data, msg } = await setup();

    await listener.onMessage(data, msg);

    const file = await File.findById(data.id);

    expect(file).toBeDefined();
    expect(file!.userId).toEqual(data.userId);
    expect(file!.type).toEqual(data.type);
    expect(file!.name).toEqual(data.name);

    const project = await Project.findById(data.projectId);

    expect(project).toBeDefined()
    expect(project!.intrinsic_fileId).toBeDefined()
})

it('ack the message', async () => {
    const { listener, data, msg } = await setup();

    await listener.onMessage(data, msg);

    expect(msg.ack).toHaveBeenCalled();

})
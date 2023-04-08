import { FileDeletedEvent, FileTypes } from "@teamg2023/common";
import { FileDeletedListener } from "../file-deleted-listener";
import mongoose from "mongoose";
import { File } from "../../../models/file";
import { Project } from "../../../models/project";
import { natsWrapper } from "../../../nats-wrapper";
import { Message } from 'node-nats-streaming';

const setup = async () => {
    const listener = new FileDeletedListener(natsWrapper.client);

    const userId = new mongoose.Types.ObjectId().toHexString();
    
    const project = Project.build({
        projectName: 'TEST',
        userId: userId
    });

    await project.save();

    const file = File.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        type: FileTypes.INTRINSIC,
        userId: userId,
        name: 'intri.yml'
    });

    await file.save();

    project.set({
        intrinsic_fileId: file
    });

    await project.save();

    const data: FileDeletedEvent['data'] = {
        id: file.id,
        projectId: project.id
    }

    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }

    return { data, msg, file, project, listener };
}

it('deletes a file and updates the project info', async () => {
    const { data, msg, file, project, listener } = await setup();

    await listener.onMessage(data, msg);

    const deletedFile = await File.findById(file.id);

    expect(deletedFile).toBeNull();

    const updatedProject = await Project.findById(project.id);

    expect(updatedProject!.intrinsic_fileId).toBeNull();
})

it('ack the message', async () => {
    const { listener, data, msg } = await setup();

    await listener.onMessage(data, msg);

    expect(msg.ack).toHaveBeenCalled();

})
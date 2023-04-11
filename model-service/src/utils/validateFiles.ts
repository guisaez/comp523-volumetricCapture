import { FileDoc } from "../models/file"
import { FileTypes } from "@teamg2023/common";

export const validateFiles = (files: FileDoc[]): boolean => {

    let zip = false;
    let extri = false;
    let intri = false;

    for(let file of files){
        switch(file.type){
            case FileTypes.ZIP:
                zip = true;
                break;
            case FileTypes.EXTRINSIC:
                extri = true;
                break;
            case FileTypes.INTRINSIC:
                intri = true;
                break;
            default: 
                break;
        }
    }

    return zip && extri && intri;
}
import { FileTypes } from "@teamg2023/common";

export function handleFileName(type: FileTypes): string {
    switch(type){
        case FileTypes.EXTRINSIC:
            return "extri.yml"
        case FileTypes.INTRINSIC:
            return "intri.yml"
        case FileTypes.ZIP:
            return "zip.zip"
        case FileTypes.OUTPUT:
            return "output.zip"
        case FileTypes.MULTI_VIEW_CONFIG:
            return "multi_view_config.yml"
    }
}
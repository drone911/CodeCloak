import { IdetectionData } from "../schemas/FileSchema";

export interface IdetectionContent extends IdetectionData {
    paddedContentBefore: string,
    maliciousContent: string,
    maliciousContentContinue?: string,
    paddedContentAfter: string
}
const getRelaventFileContent = (fileContent: string, detections: IdetectionData[], malicious_characters_threshold: number, padding_character_threshold: number): IdetectionContent[] => {
    return detections.map((detection) => {
        let result: IdetectionContent = {
            paddedContentBefore: fileContent.substring(Math.max(0, detection.startIndex - padding_character_threshold), detection.startIndex),
            paddedContentAfter: fileContent.substring(detection.endIndex + 1, Math.min(detection.endIndex + 1 + padding_character_threshold, fileContent.length)),
            maliciousContent: "",
            startIndex: detection.startIndex,
            endIndex: detection.endIndex
        }
        if (detection.endIndex - detection.startIndex + 1 > malicious_characters_threshold) {
            result.maliciousContent = fileContent.substring(detection.startIndex, detection.startIndex + Math.floor(malicious_characters_threshold / 2));
            result.maliciousContentContinue = fileContent.substring(detection.endIndex - Math.floor(malicious_characters_threshold / 2) + 1, detection.endIndex + 1);

        } else {
            result.maliciousContent = fileContent.substring(detection.startIndex, detection.endIndex)
        }
        return result;
    });
}

const getFileHeader = (fileContent: string, characters: number): string => {
    return fileContent.substring(0, Math.min(fileContent.length, characters));
}

export { getRelaventFileContent, getFileHeader };
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
            paddedContentBefore: fileContent.substring(Math.max(0, detection.startIndex - padding_character_threshold), detection.startIndex - 1),
            paddedContentAfter: fileContent.substring(detection.endIndex + 1, Math.max(detection.endIndex + padding_character_threshold, fileContent.length - 1)),
            maliciousContent: "",
            ...detection
        }
        if (detection.endIndex - detection.startIndex + 1 > malicious_characters_threshold) {
            result.maliciousContent = fileContent.substring(detection.startIndex, detection.startIndex + Math.floor(malicious_characters_threshold / 2));
            result.maliciousContentContinue = fileContent.substring(detection.startIndex + Math.floor(malicious_characters_threshold / 2) + 1, detection.endIndex);

        } else {
            result.maliciousContent = fileContent.substring(detection.startIndex, detection.endIndex)
        }
        return result;
    });
}

const getFileHeader = (fileContent: string, characters: number): string => {
    return fileContent.substring(0, Math.max(fileContent.length, characters));
}

export { getRelaventFileContent, getFileHeader };
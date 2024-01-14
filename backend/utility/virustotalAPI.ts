import axios, { AxiosError } from "axios";

interface VirusTotalInterestedAttributes {
    names: string[],
    tags: string[],
    type_tags: string[],
    reputation: Number
};

interface VirusTotalApiResponse {
    data: {
        attributes: VirusTotalInterestedAttributes;
    };
    error: {
        message: string,
        code: string
    }
};

const apiUrl = process.env.NODE_VIRUSTOTAL_URL;
const apiKey = process.env.NODE_VIRUSTOTAL_API_KEY;

const getFileInfoFromVirusTotal = async (hash: string): Promise<VirusTotalInterestedAttributes> => {
    const response = await axios.get<VirusTotalApiResponse>(`${apiUrl}/files/${hash}`, {
        headers: {
            'x-apikey': apiKey,
        },
    });
    const { names, tags, type_tags, reputation } = response.data.data.attributes;

    const metadata: VirusTotalInterestedAttributes = { names, tags, type_tags, reputation };

    return metadata;
};

export { getFileInfoFromVirusTotal };
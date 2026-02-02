declare module '@usebruno/converters' {
    export function postmanToBrunoEnvironment(postmanEnvironmentJson: any): any;
    export function postmanToBruno(postmanCollectionJson: any): Promise<any>;
    // Add other functions you use here if needed, like insomniaToBruno
}
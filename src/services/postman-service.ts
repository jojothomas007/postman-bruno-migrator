import type { AxiosResponse } from "axios";
import { RequestSender } from "./../utils/request-sender.js";
import { Config } from "./../config.js";

export class PostmanService {
  private requestSender: RequestSender;
  private postmanApiUrl: string;
  private postmanApiKey: string;
  private headers: Record<string, string>;

  constructor() {
    this.requestSender = new RequestSender();
    this.postmanApiUrl = Config.postman_api_url;
    this.postmanApiKey = Config.postman_api_key;
    this.headers = {
      Authorization: `Bearer ${this.postmanApiKey}`,
      "Content-Type": "application/json",
    };
  }

  async getWorkspaces(): Promise<AxiosResponse | null> {
    const requestUrl = `${this.postmanApiUrl}/workspaces`;
    console.info(`GET ${requestUrl}`);
    return this.requestSender.getRequest(requestUrl, this.headers);
  }

  async getWorkspace(id: string): Promise<AxiosResponse | null> {
    const requestUrl = `${this.postmanApiUrl}/workspaces/${id}`;
    console.info(`GET ${requestUrl}`);
    return this.requestSender.getRequest(requestUrl, this.headers);
  }

  async getCollections(): Promise<AxiosResponse | null> {
    const requestUrl = `${this.postmanApiUrl}/collections`;
    console.info(`GET ${requestUrl}`);
    return this.requestSender.getRequest(requestUrl, this.headers);
  }

  async getCollection(id: string): Promise<AxiosResponse | null> {
    const requestUrl = `${this.postmanApiUrl}/collections/${id}`;
    console.info(`GET ${requestUrl}`);
    return this.requestSender.getRequest(requestUrl, this.headers);
  }

  async getEnvironment(id: string): Promise<AxiosResponse | null> {
    const requestUrl = `${this.postmanApiUrl}/environments/${id}`;
    console.info(`GET ${requestUrl}`);
    return this.requestSender.getRequest(requestUrl, this.headers);
  }

  async getGlobalVariables(workspaceId: string): Promise<AxiosResponse | null> {
    const requestUrl = `${this.postmanApiUrl}/workspaces/${workspaceId}`;
    console.info(`GET ${requestUrl}`);
    return this.requestSender.getRequest(requestUrl, this.headers);
  }
}
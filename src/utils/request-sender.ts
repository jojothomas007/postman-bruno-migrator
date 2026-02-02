import axios from "axios";
import type { AxiosRequestConfig, AxiosResponse } from "axios";

export class RequestSender {
  
  async postRequestJson(
    requestUrl: string,
    headers: Record<string, string>,
    payload: object,
    auth?: { username: string; password: string }
  ): Promise<AxiosResponse | null> {
    console.info(`Request URL: POST ${requestUrl}`);
    console.info("Request Headers:", headers);
    console.info("Request Payload:", payload);

    const config: AxiosRequestConfig = { headers };
    if (auth) {
      config.auth = auth; // only set if defined
    }
    try {
      const response = await axios.post(requestUrl, payload, config);
      console.info("Response:", response.data);
      return response;
    } catch (error: any) {
      if (error.response) {
        console.error(`HTTP error occurred: ${error.message}`, error.response.data);
      } else {
        console.error(`Request error occurred: ${error.message}`);
      }
      return null;
    }
  }

  async postRequest(
    requestUrl: string,
    headers: Record<string, string>,
    payload: string,
    auth?: { username: string; password: string }
  ): Promise<AxiosResponse | null> {
    console.info(`Request URL: POST ${requestUrl}`);
    console.info("Request Headers:", headers);
    console.info("Request Payload:", payload);

    const config: AxiosRequestConfig = { headers };
    if (auth) {
      config.auth = auth; // only set if defined
    }
    try {
      const response = await axios.post(requestUrl, payload, config);
      console.info("Response:", response.data);
      return response;
    } catch (error: any) {
      console.error(`Error occurred: ${error.message}`);
      return null;
    }
  }

  async putRequest(
    requestUrl: string,
    headers: Record<string, string>,
    payload: string,
    auth?: { username: string; password: string }
  ): Promise<AxiosResponse | null> {
    console.info(`Request URL: PUT ${requestUrl}`);
    console.info("Request Headers:", headers);
    console.info("Request Payload:", payload);

    const config: AxiosRequestConfig = { headers };
    if (auth) {
      config.auth = auth; // only set if defined
    }
    try {
      const response = await axios.put(requestUrl, payload, config);
      console.info("Response:", response.data);
      return response;
    } catch (error: any) {
      console.error(`Error occurred: ${error.message}`);
      return null;
    }
  }

  async putRequestJson(
    requestUrl: string,
    headers: Record<string, string>,
    payload: object,
    auth?: { username: string; password: string }
  ): Promise<AxiosResponse | null> {
    console.info(`Request URL: PUT ${requestUrl}`);
    console.info("Request Headers:", headers);
    console.info("Request Payload:", payload);

    const config: AxiosRequestConfig = { headers };
    if (auth) {
      config.auth = auth; // only set if defined
    }
    try {
      const response = await axios.put(requestUrl, payload,  config);
      console.info("Response:", response.data);
      return response;
    } catch (error: any) {
      console.error(`Error occurred: ${error.message}`);
      return null;
    }
  }

  async getRequest(
    requestUrl: string,
    headers: Record<string, string>,
    auth?: { username: string; password: string }
  ): Promise<AxiosResponse | null> {
    console.info(`Request URL: GET ${requestUrl}`);
    console.info("Request Headers:", headers);

    const config: AxiosRequestConfig = { headers };
    if (auth) {
      config.auth = auth; // only set if defined
    }
    try {
      const response = await axios.get(requestUrl, config);
      console.info("Response:", response.data);
      return response;
    } catch (error: any) {
      console.error(`Error occurred: ${error.message}`);
      return null;
    }
  }
}
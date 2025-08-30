import { AxiosRequestConfig } from "axios";

export type ApiResponse<T = any> =
  | { success: true; data?: T }
  | { success: false; error: string };

export type API = {
  get<T>({
    entity,
    options,
  }: {
    entity: string;
    options?: AxiosRequestConfig;
  }): Promise<ApiResponse<T>>;

  post<T>({
    entity,
    data,
    options,
  }: {
    entity: string;
    data: Record<string, unknown>;
    options?: AxiosRequestConfig;
  }): Promise<ApiResponse<T>>;

  patch<T>({
    entity,
    data,
    options,
  }: {
    entity: string;
    data: Record<string, unknown>;
    options?: AxiosRequestConfig;
  }): Promise<ApiResponse<T>>;

  delete<T>({
    entity,
    options,
  }: {
    entity: string;
    options?: AxiosRequestConfig;
  }): Promise<ApiResponse<T>>;
};

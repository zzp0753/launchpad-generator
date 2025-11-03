import { apiClient } from "./api-client";

export interface LaunchpadDto {
  id: string;
  name: string;
  chain: string;
  startTime: string;
  endTime: string;
  createdAt: string;
  updatedAt: string;
}

export async function fetchLaunchpads(): Promise<LaunchpadDto[]> {
  const response = await apiClient.get<LaunchpadDto[]>("/api/v1/launchpads");
  return response.data;
}

export interface CreateLaunchpadInput {
  name: string;
  chain: string;
  startTime: string;
  endTime: string;
}

export async function createLaunchpad(
  payload: CreateLaunchpadInput,
): Promise<LaunchpadDto> {
  const response = await apiClient.post<LaunchpadDto>(
    "/api/v1/launchpads",
    payload,
  );
  return response.data;
}

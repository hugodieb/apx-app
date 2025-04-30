import { useMock } from "@/lib/utils/useMock"
import * as mockApi from "./apiMock"
import * as apiClient from "./api"

export const authApi = useMock() ? mockApi : apiClient.authApi

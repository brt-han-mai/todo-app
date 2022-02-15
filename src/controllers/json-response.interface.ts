import { EErrorCode } from "./error-code.enum";

export interface IJsonResponse {
    ok: boolean;
    errorCode?: EErrorCode;
    message?: string;
    details?: object;
}

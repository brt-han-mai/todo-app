import { EErrorCode } from "./error-code.enum";
import { IJsonResponse } from "./json-response.interface";

export class BaseController {
    public makeResponse(isOk: boolean, errorCode?: EErrorCode, message?: string, details?: object): IJsonResponse {
        const response: IJsonResponse = { ok: isOk };

        if (errorCode !== undefined) { response.errorCode = errorCode; }
        if (message !== undefined) { response.message = message; }
        if (details !== undefined) { response.details = details; }

        return response;
    }

    public makeOkResponse(message?: string, details?: object): IJsonResponse {
        return this.makeResponse(true, undefined, message, details);
    }

    public makeNegativeResponse(errorCode?: EErrorCode, message?: string, details?: object): IJsonResponse {
        return this.makeResponse(false, errorCode, message, details);
    }
}

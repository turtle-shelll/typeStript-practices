
export class ApiError extends Error {
    constructor(public statusCode: number, errMessage: string){
        super(errMessage);
        Object.setPrototypeOf(this, ApiError.prototype);
    };
};


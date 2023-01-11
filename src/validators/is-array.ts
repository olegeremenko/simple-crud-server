import ArgumentValidateError from "../errors/argument-validate-error";

function assertIsArray(value: any, message: string): asserts value is number {
    if (value === null || value === undefined || !Array.isArray(value)) {
        throw new ArgumentValidateError(message);
    }
}

export default assertIsArray;
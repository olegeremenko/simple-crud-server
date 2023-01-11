import ArgumentValidateError from "../errors/argument-validate-error";

function assertIsNumeric(value: any, message: string): asserts value is number {
    if (value === null || value === undefined || !Number.parseInt(value)) {
        throw new ArgumentValidateError(message);
    }
}

export default assertIsNumeric;
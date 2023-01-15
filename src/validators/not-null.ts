import ArgumentValidateError from "../errors/argument-validate-error";

function assertNotNull<TValue>(value: TValue, message: string): asserts value is NonNullable<TValue> {
    if (value === null || value === undefined) {
        throw new ArgumentValidateError(message);
    }
}

export default assertNotNull;
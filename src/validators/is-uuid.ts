import { validate as validateUuid } from 'uuid';
import ArgumentValidateError from '../errors/argument-validate-error';

function assertIsValidUuid(value: any): asserts value is string {
    if (!validateUuid(value)) {
        throw new ArgumentValidateError('Invalid UUID.');
    }
}

export default assertIsValidUuid;

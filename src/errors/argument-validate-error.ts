class ArgumentValidateError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'ArgumentValidateError';
    }
  }
  
  export default ArgumentValidateError;
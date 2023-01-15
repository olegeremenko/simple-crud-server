class ErrorHandler {
    static async handle(err: Error) {
      /* eslint-disable no-console */
      console.error(`${new Date().toISOString()}: ${err}`);
    }
  }
  
  export default ErrorHandler;
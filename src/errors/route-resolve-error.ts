class RouteResolveError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'RouteResolveError';
    }
  }
  
  export default RouteResolveError;
import ActionResult from "./action-result";
import Request from "./http/request";

type ActionHandler = (request: Request) => Promise<ActionResult>;

export default ActionHandler;

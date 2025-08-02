import Parse from "parse";
import {authProvider} from "./authProvider";

export const apiProvider = (config: {
    appId: string;
    javascriptKey: string;
    serverURL: string;
}) => {

    // Initialize Parse SDK
    Parse.initialize(config.appId, config.javascriptKey);
    Parse.serverURL = config.serverURL;

    Parse.secret = config.appId + config.javascriptKey;
    // Optional: Enable LocalDatastore if offline support is needed
    Parse.enableLocalDatastore();
    // Optional: Enable secure user storage (encrypted in localStorage)
    Parse.enableEncryptedUser();

    return [
        authProvider,
        // dataProvider
    ]
}
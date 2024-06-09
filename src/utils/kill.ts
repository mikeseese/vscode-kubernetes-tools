import {  exec } from 'child_process';

export function killProcessTree(pid: number | undefined, signal: string = "SIGKILL", callback: (error: Error | null) => void = () => {}) {
    if (pid === undefined) {
        return;
    }

    if (Number.isNaN(pid)) {
        // if (callback) {
        //     return callback(new Error("pid must be a number"));
        // } else {
            throw new Error("pid must be a number");
        // }
    }

    switch (process.platform) {
        case "win32": {
            exec(`taskkill /pid ${pid} /T /F`, callback);
            break;
        }
        default: {
            exec(`pkill -${signal} -P ${pid}`, callback); // kill direct child processes; no need to kill entire process tree
            exec(`kill -${signal} -P ${pid}`, callback); // kill parent process
            break;
        }
    }
}
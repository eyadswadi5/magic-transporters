import "reflect-metadata"
import "./di/container";
import app from "./app"
import { connect_db } from "./config/db";
import { config } from "./config/env";

const port = config.port;


(async () => {
    await connect_db()
    app.listen(port, () => {
        console.log(`listening on port ${port}`)
    })
})();


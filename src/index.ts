import dotenv from "dotenv";
import App from "./App/App";


dotenv.config();

const port = process.env.PORT || 3000;

App.listen(port, () => {
   console.log(`Listening: http://localhost:${port}`);
});

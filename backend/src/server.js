// import dotenv from "dotenv";
// dotenv.config(); // must be first
import "dotenv/config"; // MUST be first import (side-effect)
import { app } from "./app.js";

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`API: http://localhost:${PORT}`));

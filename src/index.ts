
import Express from "express";
import router from "./routes";
import {connectToMongo} from "./config/database";
import path from "path";
const app = Express();
const { PORT } = require("./config/serverConfig");
const cors=require('cors');
var bodyParser = require("body-parser");

app.use(cors({ origin: 'http://localhost:3000' }));
app.use(bodyParser.json({ limit: "50mb" })); // Increase limit to 50MB for JSON
app.use(bodyParser.urlencoded({
  limit: "50mb",          // Increase request body size limit
  extended: true,
  parameterLimit: 100000,  // Increase the parameter limit (default is 1000)
}));

app.use('/uploads/images',Express.static(path.join(__dirname,'../uploads/images')));
app.use("/uploads/files", Express.static("uploads/files"));
app.use('/uploads/images',Express.static("uploads/images"));

app.use("/api", router);
app.get("/", (req, res) => {
  res.send("Welcome to Examcell ");
});
console.log(process.env.MONGODB_URI);
console.log(process.env.PORT);
app.listen(PORT, async () => {
  console.log(`app listening at port ${PORT}`);
  await connectToMongo();
});

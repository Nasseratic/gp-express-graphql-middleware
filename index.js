import express from"express";
import mongoose from "mongoose";
import keys from "./config/keys";
import middlewares from"./middlewares";
import user from"./routes/user.router";
import auth from "./routes/auth.router";
import { graphqlExpress , graphiqlExpress } from "apollo-server-express";

// Db connection
mongoose.Promise = global.Promise;
mongoose
  .connect(keys.db)
  .then(() => {
    console.log("DB Connected");
  })
  .catch(err => {
    if (err) throw err;
    console.log("Connection error");
  });

const app = express();

app.use(express.static("./uploads"));

// --------------------- Middlewares Before the Application Routes --------------------
middlewares.atFirst.forEach( middleware => app.use("/" , middleware ) );


// --------- GRAPHQL ------------
app.use("/graphi" , graphiqlExpress({
    endpointURL:"/graphql"
}));
app.use("/graphql", graphqlExpress({}));

// -----------------------------AUTH ROUTES --------------------
app.use("/", auth);

// ---------------------------- USER ROUTES --------------------
app.use("/user", middlewares.isAuthenticated, user);

// --------------------- Middlewares After the Application Routes --------------------
middlewares.atLast.forEach( middleware => app.use("/" , middleware ) );



// --- ---------- ------------ --------------- -------- //
app.listen(3000, () => {
  console.log("Server ready");
});

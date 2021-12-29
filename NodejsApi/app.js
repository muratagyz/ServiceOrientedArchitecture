const dboperations = require("./CRUD/dboperations");

var express = require("express");
var bodyParser = require("body-parser");
var cors = require("cors");
var soap = require("soap");
var fs = require("fs");
const { request, response } = require("express");
var app = express();
var router = express.Router();

var serviceObject = {
  MessageSplitterService: {
    MessageSplitterServiceSoapPort: {
      MessageSplitter: dboperations.splitter_function,
    },
    MessageSplitterServiceSoap12Port: {
      MessageSplitter: dboperations.splitter_function,
    },
  },
};
var xml = fs.readFileSync("service.wsdl", "utf8");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use("/api", router);

router.use((request, response, next) => {
  console.log("middleware");
  next();
});

router.route("/orders").get((request, response) => {
  dboperations.GetOrders().then((result) => {
    response.json(result);
  });
});

router.route("/order/:id").get((request, response) => {
  dboperations.GetOrder(request.params.id).then((result) => {
    response.json(result);
  });
});

router.route("/addOrder").post((request, response) => {
  let order = { ...request.body };

  dboperations.AddOrder(order).then((result) => {
    response.status(201).json(result);
  });
});

router.route("/deleteOrder/:id").get((request, response) => {
  dboperations.DeleteOrder(request.params.id).then((result) => {
    response.status(200).json(result);
  });
});

router.route("/updateOrder/:id").post((request, response) => {
  let order = { ...request.body };

  dboperations.UpdateOrder(request.params.id, order).then((result) => {
    response.status(200).json(result);
  });
});

router.route("/").get((request, response) => {
  response.send(
    'Node Soap Example!<br /><a href="https://github.com/macogala/node-soap-example#readme">Git README</a>'
  );
});

var port = 8090;
app.listen(port, function () {
  console.log("Listening on port " + port);
  var wsdl_path = "/wsdl";
  soap.listen(app, wsdl_path, serviceObject, xml);
  console.log(
    "Check http://localhost:" +
      port +
      wsdl_path +
      "?wsdl to see if the service is working"
  );
});

const sqlite3 = require("sqlite3").verbose();
var order = require("../Model/Order");

let db = new sqlite3.Database(
  "./Db/Products.db",
  sqlite3.OPEN_READWRITE,
  (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log("Connected to the chinook database.");
  }
);

async function GetOrders() {
  db.serialize(() => {
    db.all("SELECT * from Orders", function (err, rows) {
      if (err) {
        console.log(err);
      } else {
        console.log(rows);
      }
    });
  });
}

async function GetOrder(orderId) {
  db.serialize(() => {
    db.each("SELECT * FROM Orders WHERE id =?", [orderId], function (err, row) {
      if (err) {
        res.send("Error encountered while displaying");
        return console.error(err.message);
      } else {
        console.log(row);
      }
    });
  });
}

async function AddOrder(order) {
  db.serialize(() => {
    db.run(
      "INSERT INTO Orders (Title,Quantity,Message,City) VALUES(?,?,?,?)",
      [order.Title, order.Quantity, order.Message, order.City],
      function (err) {
        if (err) {
          return console.log(err.message);
        }
        console.log("Entry added");
      }
    );
  });
}

async function DeleteOrder(orderId) {
  db.serialize(() => {
    db.run("DELETE FROM Orders WHERE id =?", [orderId], function (err) {
      if (err) {
        return console.log(err.message);
      }
      console.log("Entry deleted");
    });
  });
}

async function UpdateOrder(orderId, order) {
  db.serialize(() => {
    db.run(
      "UPDATE Orders SET Title = ?, Quantity = ?, Message = ?, City = ? WHERE id = ?",
      [order.Title, order.Quantity, order.Message, order.City, orderId],
      function (err) {
        if (err) {
          return console.log(err.message);
        }
        console.log("Entry updated");
      }
    );
  });
}

async function splitter_function(args) {
  console.log("splitter_function");
  var splitter = args.splitter;
  var splitted_msg = args.message.split(splitter);
  var result = [];
  for (var i = 0; i < splitted_msg.length; i++) {
    result.push(splitted_msg[i]);
  }
  return {
    result: result,
  };
}

module.exports = {
  GetOrders: GetOrders,
  AddOrder: AddOrder,
  GetOrder: GetOrder,
  DeleteOrder: DeleteOrder,
  UpdateOrder: UpdateOrder,
  splitter_function: splitter_function,
};

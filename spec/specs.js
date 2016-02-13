describe('Pizza', function() {

  it("has a size", function() {
    var testPizza = new Pizza(1, "Large");
    expect(testPizza.pizzaSize).to.equal("Large");
  });

  it("receives toppings and returns them", function() {
    var testPizza = new Pizza(1, "Large");
    testPizza.pizzaToppings.push("anchovies");
    expect(testPizza.pizzaToppings[0]).to.equal("anchovies");
  });

  it("returns total cost based on size and toppings", function() {
    var testPizza = new Pizza(1, "Large");
    testPizza.pizzaToppings.push("anchovies");
    testPizza.pizzaToppings.push("mushrooms");
    testPizza.pizzaToppings.push("pepperoni");
    testPizza.pizzaToppings.push("sausage");
    expect(testPizza.cost()).to.equal(1450);
  });

  it("returns a formatted cost for DOM use", function() {
    var testPizza = new Pizza(1, "Large");
    testPizza.pizzaToppings.push("anchovies");
    testPizza.pizzaToppings.push("mushrooms");
    testPizza.pizzaToppings.push("pepperoni");
    testPizza.pizzaToppings.push("sausage");
    expect(formatCost(testPizza.cost())).to.equal("$14.50");
  });

  it("allows toppings to be removed", function() {
    var testPizza = new Pizza(1, "Large");
    testPizza.pizzaToppings.push("anchovies");
    testPizza.pizzaToppings.push("mushrooms");
    testPizza.pizzaToppings.push("pepperoni");
    testPizza.pizzaToppings.push("sausage");
    testPizza.removeTopping("sausage");
    expect(testPizza.cost()).to.equal(1350);
    expect(testPizza.pizzaToppings.length).to.equal(3);
  });

  it("can have multiple copies of the same topping", function() {
    var testPizza = new Pizza(1, "Large");
    testPizza.pizzaToppings.push("anchovies");
    testPizza.pizzaToppings.push("anchovies");
    expect(testPizza.pizzaToppings[1]).to.equal("anchovies");
    expect(testPizza.cost()).to.equal(1350);
  });

});

describe('Order', function() {

  it("contains an array of pizza objects", function() {
    var testPizza = new Pizza(1, "Large");
    testPizza.pizzaToppings.push("anchovies");
    var testOrder = new Order();
    testOrder.addPizza(testPizza);
    expect(testOrder.pizzas[0].pizzaToppings[0]).to.equal("anchovies");
    expect(testOrder.pizzas.findIndex(function(elem, index, arr) {
      return elem.pizzaSize === "Large" && elem.pizzaToppings[0] === "anchovies";
    })).to.equal(0);
  });

  it("allows pizzas to be removed", function() {
    var testPizza = new Pizza(1, "Large");
    testPizza.pizzaToppings.push("anchovies");
    var testOrder = new Order();
    testOrder.addPizza(testPizza);
    testOrder.pizzas.splice(0, 1);
    expect(testOrder.pizzas.length).to.equal(0);
  });

  it("returns the total cost of the order", function() {
    var testOrder = new Order();
    var firstPizza = new Pizza(1, "Large");
    var secondPizza = new Pizza(2, "Medium");
    testOrder.addPizza(firstPizza);
    testOrder.addPizza(secondPizza);
    expect(testOrder.cost()).to.equal(2200);
  });

  it("returns a formatted cost for DOM use", function() {
    var testOrder = new Order();
    var firstPizza = new Pizza(1, "Large");
    var secondPizza = new Pizza(2, "Medium");
    testOrder.addPizza(firstPizza);
    testOrder.addPizza(secondPizza);
    expect(formatCost(testOrder.cost())).to.equal("$22.00");
  });

  it("adds a charge for delivery orders", function() {
    var testOrder = new Order();
    var firstPizza = new Pizza(1, "Large");
    var secondPizza = new Pizza(2, "Medium");
    testOrder.addPizza(firstPizza);
    testOrder.addPizza(secondPizza);
    testOrder.delivery = true;
    expect(testOrder.cost()).to.equal(2400);
  });

});

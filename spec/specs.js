describe('Pizza', function() {

  it("has a size", function() {
    var testPizza = new Pizza();
    testPizza.pizzaSize = "large";
    expect(testPizza.pizzaSize).to.equal("large");
  });

  it("receives toppings and returns them", function() {
    var testPizza = new Pizza();
    testPizza.pizzaToppings.push("anchovies");
    expect(testPizza.pizzaToppings[1]).to.equal("anchovies");
  });

  it("returns total cost based on size and toppings", function() {
    var testPizza = new Pizza();
    testPizza.pizzaSize = "large";
    testPizza.pizzaToppings.push("anchovies");
    testPizza.pizzaToppings.push("mushrooms");
    testPizza.pizzaToppings.push("pepperoni");
    testPizza.pizzaToppings.push("sausage");
    expect(testPizza.getCost()).to.equal(1450);
  });

  it("allows toppings to be removed", function() {
    var testPizza = new Pizza();
    testPizza.pizzaSize = "large";
    testPizza.pizzaToppings.push("anchovies");
    testPizza.pizzaToppings.push("mushrooms");
    testPizza.pizzaToppings.push("pepperoni");
    testPizza.pizzaToppings.push("sausage");
    testPizza.removeTopping("sausage");
    expect(testPizza.getCost()).to.equal(1350);
    expect(testPizza.pizzaToppings.length).to.equal(4);
  });

  it("can have multiple copies of the same topping", function() {
    var testPizza = new Pizza();
    testPizza.pizzaSize = "large";
    testPizza.pizzaToppings.push("anchovies");
    testPizza.pizzaToppings.push("anchovies");
    expect(testPizza.pizzaToppings[2]).to.equal("anchovies");
    expect(testPizza.getCost()).to.equal(1350);
  });

});

function Pizza() {
  this.pizzaToppings = ["cheese"];
  this.pizzaSize;
};

var sizeCosts = {
  "small": 800,
  "medium": 1000,
  "large": 1200
};

var toppingCosts = {
  "cheese": 0,
  "anchovies": 75,
  "mushrooms": 25,
  "pepperoni": 50,
  "sausage": 100
};

Pizza.prototype.getCost = function () {
  var runningTotal = sizeCosts[this.pizzaSize];
  for (var topping of this.pizzaToppings) {
    runningTotal += toppingCosts[topping];
  }
  return runningTotal;
};

Pizza.prototype.removeTopping = function (topping) {
  var toppingIndex = this.pizzaToppings.indexOf(topping);
  if (toppingIndex > -1)  {
    this.pizzaToppings.splice(toppingIndex, 1);
  }
};

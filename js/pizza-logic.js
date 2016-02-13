function Pizza(pizzaId, size) {
  this.pizzaId = pizzaId;
  this.pizzaToppings = [];
  this.pizzaSize = size;
}

var sizeCosts = {
  "Small": 800,
  "Medium": 1000,
  "Large": 1200
};

var toppingCosts = {
  "cheese": 0,
  "extra cheese": 50,
  "anchovies": 75,
  "mushrooms": 25,
  "pepperoni": 50,
  "sausage": 100
};

Pizza.prototype.cost = function () {
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

function Order() {
  this.pizzas = [];
  this.delivery = false;
}

var DELIVERY_CHARGE = 200;

Order.prototype.addPizza = function (pizza) {
  var pizzaToAdd = new Pizza(pizza.pizzaId, pizza.pizzaSize);
  pizza.pizzaToppings.forEach(function(topping) {
    pizzaToAdd.pizzaToppings.push(topping);
  });
  this.pizzas.push(pizzaToAdd);
};

Order.prototype.cost = function () {
  var runningTotal = 0;
  for (var pizza of this.pizzas) {
    runningTotal += pizza.cost();
  }
  if (this.delivery) {
    runningTotal += DELIVERY_CHARGE;
  }
  return runningTotal;
};

var formatCost = function(cost) {
  return "$" + (cost / 100).toFixed(2);
};

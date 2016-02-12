function Order() {
  this.pizzas = [];
}

Order.prototype.addPizza = function (pizza) {
  var pizzaToAdd = new Pizza(pizza.pizzaId, pizza.pizzaSize);
  pizza.pizzaToppings.forEach(function(topping) {
    pizzaToAdd.pizzaToppings.push(topping);
  });
  this.pizzas.push(pizzaToAdd);
};

function Pizza(pizzaId, size) {
  this.pizzaId = pizzaId;
  this.pizzaToppings = [];
  this.pizzaSize = size;
};

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

var formatCost = function(cost) {
  return "$" + (cost / 100).toFixed(2);
};

//USER INTERFACE

var setupPizzaBuilder = function(pizza) {
  $(".topping-checkboxes").empty();
  $(".working-toppings").empty();
  for (var topping in toppingCosts) {
    if (toppingCosts.hasOwnProperty(topping)) {
      $(".topping-checkboxes").append(
        "<div class='checkbox'>" +
          "<label>" +
            "<input type='checkbox' class='pizza-topping' value='" + topping + "'>" + topping + " (" + formatCost(toppingCosts[topping]) + ")" +
          "</label>" +
        "</div>"
      );
    }
  }
  $("#" + pizza.pizzaSize).prop("checked", true)
  $("input[value='cheese']").prop("checked", true);
  pizza.pizzaToppings.push("cheese");
  addToppingToPizzaBuilderList("cheese");
  updateCost(pizza);
  beginSizeListener(pizza);
  beginToppingListener(pizza);
};

var beginSizeListener = function(pizza) {
  $(".pizza-size").change(function() {
    pizza.pizzaSize = $(this).val();
    $(".working-size").empty().append(pizza.pizzaSize);
    updateCost(pizza);
  });
}

var beginToppingListener = function(pizza) {
  $(".pizza-topping").change(function() {
    var thisTopping = $(this).val();
    if (pizza.pizzaToppings.indexOf(thisTopping) > -1) {
      pizza.removeTopping(thisTopping);
      removeToppingFromPizzaBuilderList(thisTopping);
      updateCost(pizza);
    } else {
      pizza.pizzaToppings.push(thisTopping);
      addToppingToPizzaBuilderList(thisTopping);
      updateCost(pizza);
    }
  });
}

var addToppingToPizzaBuilderList = function(topping) {
  $(".working-toppings").append("<li class='working-topping'>" + topping + "</li>");
};

var removeToppingFromPizzaBuilderList = function(topping) {
  $(".working-topping:contains(" + topping + ")").remove();
};

var updateCost = function(pizza) {
  $(".working-cost").empty().append(formatCost(pizza.cost()));
};

var updateOrderList = function(pizza, order) {

  $(".order-pizzas").empty();
  for (var eachPizza of order.pizzas) {
    $(".order-pizzas").append(
      "<div class='order-pizza'>" +
        "<strong>" + eachPizza.pizzaSize + "&nbsp;Pizza</strong> " +
        "<ul class='list-inline order-pizza-toppings' id='toppings"+ eachPizza.pizzaId + "'></ul>" +
        formatCost(eachPizza.cost()) +
      "</div>"
    );
    for (var topping of eachPizza.pizzaToppings) {
      $("#toppings" + eachPizza.pizzaId).append("<li class='order-pizza-topping'>" + topping + "</li>");
    }
  }
};

//DOCUMENT READY

$(function() {

  var idCounter = 0;
  var workingOrder = new Order();
  var workingPizza = new Pizza(idCounter, "Medium");
  setupPizzaBuilder(workingPizza);

  $("#add-to-order").on("submit", function(event) {
    event.preventDefault();
    console.log("Submission received");
    workingOrder.addPizza(workingPizza);
    updateOrderList(workingPizza, workingOrder);
    idCounter++;
    workingPizza = new Pizza(idCounter, "Medium");
    setupPizzaBuilder(workingPizza);
  });
});

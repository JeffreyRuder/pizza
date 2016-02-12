function Order() {
  this.pizzas = [];
  this.delivery;
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
  updatePizzaCost(pizza);
  beginSizeListener(pizza);
  beginToppingListener(pizza);
};

var beginSizeListener = function(pizza) {
  $(".pizza-size").change(function() {
    pizza.pizzaSize = $(this).val();
    $(".working-size").empty().append(pizza.pizzaSize);
    updatePizzaCost(pizza);
  });
}

var beginToppingListener = function(pizza) {
  $(".pizza-topping").change(function() {
    var thisTopping = $(this).val();
    if (pizza.pizzaToppings.indexOf(thisTopping) > -1) {
      pizza.removeTopping(thisTopping);
      removeToppingFromPizzaBuilderList(thisTopping);
    } else {
      pizza.pizzaToppings.push(thisTopping);
      addToppingToPizzaBuilderList(thisTopping);
    }
    updatePizzaCost(pizza);
  });
}

var addToppingToPizzaBuilderList = function(topping) {
  $(".working-toppings").append("<li class='working-topping'>" + topping + "</li>");
};

var removeToppingFromPizzaBuilderList = function(topping) {
  $(".working-topping:contains(" + topping + ")").remove();
};

var updatePizzaCost = function(pizza) {
  $(".working-cost").empty().append(formatCost(pizza.cost()));
};

var updateOrderList = function(order) {
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

var beginDeliveryListener = function(order) {
  $(".order-type").change(function() {
    var orderType = $(this).val();
    if (orderType === "delivery") {
      order.delivery = true;
      if (DELIVERY_CHARGE > 0) {
        $(".delivery-charge").append("<p>A delivery charge of " +
          formatCost(DELIVERY_CHARGE) + " will be added to your order. This delivery charge is not a tip paid to your driver.</p>"
        );
      }
      $(".address-inputs").show();
    } else {
      order.delivery = false;
      $(".delivery-charge").empty();
      $(".address-inputs").hide();
    }
    updateOrderCost(order);
  });
}

var updateOrderCost = function(order) {
  $(".order-total-cost").empty().append(formatCost(order.cost()));
};

var close_box = function() {
	window.location.reload(true);
};


//DOCUMENT READY

$(function() {

  var idCounter = 0;
  var workingOrder = new Order();
  var workingPizza = new Pizza(idCounter, "Medium");
  setupPizzaBuilder(workingPizza);

  $("#add-to-order").on("submit", function(event) {
    event.preventDefault();

    workingOrder.addPizza(workingPizza);
    updateOrderList(workingOrder);
    updateOrderCost(workingOrder);
    beginDeliveryListener(workingOrder);
    $(".current-order").show();

    idCounter++;
    workingPizza = new Pizza(idCounter, "Medium");
    setupPizzaBuilder(workingPizza);
  });

  $(".lightbox").on("submit", function(event) {
    event.preventDefault();

    $('.backdrop, .box').animate({'opacity':'.50'}, 100, 'linear');
    $('.box').animate({'opacity':'1.00'}, 100, 'linear');
    $('.backdrop, .box').css('display', 'block');
    if (workingOrder.delivery) {
      $(".confirmation").append("Your order has been confirmed!<br><br>If Epic Pizza were real, it would be on its way to " + $("#inputAddress1").val() + " in 30 minutes or less!<br><br>");
    } else {
      $(".confirmation").append("Your order has been confirmed!<br><br>If Epic Pizza were real, it would be available for carryout in 30 minutes or less!<br><br>");
    }
    $(".confirmation").append(" Your order total is " + formatCost(workingOrder.cost()) + ".");
  });

  $(".close").on("click", function() {
    close_box();
  });

  $(".backdrop").on("click", function() {
    close_box();
  });
});

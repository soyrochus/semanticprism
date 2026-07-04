package com.example.orders;

public class SubmitOrderAction {
  private final OrderService orderService = new OrderService();

  public String execute(OrderForm form) {
    Customer customer = orderService.findCustomer(form.getCustomerId());
    if (form.getOrderTotal() > customer.getCreditLimit()) {
      return "failure";
    }
    orderService.submitOrder(form.getCustomerId(), form.getOrderTotal());
    return "success";
  }
}

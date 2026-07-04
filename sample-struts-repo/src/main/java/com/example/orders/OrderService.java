package com.example.orders;

public class OrderService {
  private final OrderDao orderDao = new OrderDao();

  public Customer findCustomer(String customerId) {
    return orderDao.findCustomer(customerId);
  }

  public void submitOrder(String customerId, double orderTotal) {
    orderDao.insertOrder(customerId, orderTotal);
  }
}

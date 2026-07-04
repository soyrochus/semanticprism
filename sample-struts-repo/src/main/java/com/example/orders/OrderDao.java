package com.example.orders;

public class OrderDao {
  public Customer findCustomer(String customerId) {
    return new Customer(customerId, 1000.00);
  }

  public void insertOrder(String customerId, double orderTotal) {
    // Fixture method intentionally does not modify local source files.
  }
}

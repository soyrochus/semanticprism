<%@ taglib uri="/WEB-INF/struts-html.tld" prefix="html" %>
<html:form action="/submitOrder">
  <label>Customer</label>
  <html:text property="customerId" />
  <label>Order total</label>
  <html:text property="orderTotal" />
  <html:submit>Submit order</html:submit>
</html:form>

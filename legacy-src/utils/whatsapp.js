/**
 * Formats order details for WhatsApp
 */
export const formatWhatsAppMessage = (customerInfo, cartItems, total) => {
  const orderItems = cartItems.map((item, index) => {
    return `${index + 1}. ${item.name} - ${item.quantity}x - $${item.price}`;
  }).join('\n');

  const message = `Hello,

I would like to place an order from your jewellery collection.

*Customer Details:*
Name: ${customerInfo.name}
Phone: ${customerInfo.phone}
Address: ${customerInfo.address}

*Order Details:*
${orderItems}

*Total:* $${total.toLocaleString()}

*Additional Notes:*
${customerInfo.notes || 'None'}

Thank you.`;

  return encodeURIComponent(message);
};

export const getWhatsAppUrl = (businessPhone, encodedMessage) => {
  return `https://wa.me/${businessPhone}?text=${encodedMessage}`;
};

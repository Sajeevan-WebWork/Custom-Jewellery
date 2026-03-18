type CustomerInfo = {
  name: string;
  phone: string;
  address: string;
  notes: string;
};

type CartItem = {
  name: string;
  quantity: number;
  price: number;
};

export function formatWhatsAppMessage(customerInfo: CustomerInfo, cartItems: CartItem[], total: number) {
  const orderItems = cartItems
    .map((item, index) => `${index + 1}. ${item.name} - ${item.quantity}x - $${item.price}`)
    .join("\n");

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
${customerInfo.notes || "None"}

Thank you.`;

  return encodeURIComponent(message);
}

export function getWhatsAppUrl(businessPhone: string, encodedMessage: string) {
  return `https://wa.me/${businessPhone}?text=${encodedMessage}`;
}


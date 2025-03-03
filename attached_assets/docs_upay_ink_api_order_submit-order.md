URL: https://docs.upay.ink/api/order/submit-order
---
> Used to generate payment data of specified digital currency, merchants can guide users to jump to the UPay checkout counter for payment through the payment link. After the user's payment is successful, the system will immediately issue a **callback notification**.
>
> Note: Users must pay strictly according to the order amount. If the payment amount is inconsistent, the **order will not be processed**.

**URL：**/v1/api/open/order/apply

**Method：** POST

**Parameter Type：** application/json

**Parameter ：**

Field Name

Field Type

Required

Signature

Instruction

appId

string(8)

**True**

**True**

Merchant APP ID

merchantOrderNo

string(14-32)

**True**

**True**

The order number generated independently by the merchant must be unique on the merchant's end.

chainType

string(1)

**True**

**True**

Network:

1: Tron (TRC20)

2: Ethereum (ERC20)

3: PayPal (PYUSD)

fiatAmount

string(10)

**True**

**True**

Legal currency amount, accurate to 4 decimal places

fiatCurrency

string(3)

**True**

**True**

USD (US Dollars)

CNY (Chinese Yuan Renminbi)

INR (Indian Rupee)

JPY (Japanese Yen)

KRW (South Korean Won)

PHP (Philippine Peso)

EUR (Euro)

GBP (British Pound)

CHF (Swiss Franc)

TWD (New Taiwan Dollar)

HKD (Hong Kong dollar)

MOP (Macau Pataca)

SGD (Singapore Dollar )

NZD (New Zealand Dollar)

THB (Thai Baht)

CAD (Canadian Dollar)

ZAR (South African Rand)

BRL (Brazilian Real)

attach

string(64)

False

False

User-defined data, if it is not empty, will be returned as is when calling back to notifyUrl.

productName

string(32)

False

False

Product name

notifyUrl

string(256)

**True**

**True**

The callback address for receiving asynchronous notifications. It must be a directly accessible URL and cannot contain parameters, session verification, or csrf verification.

redirectUrl

string(256)

False

False

After the payment is successful, the front-end redirects the address. Be sure to include "http://" or "https://" at the beginning

signature

string(32)

**True**

**True**

Data signature, see: [Signature Algorithm](https://docs.upay.ink/api/introduction/signature)

**Return value data parameter：**

Field Name

Field Type

Instruction

appId

string

Merchant APP ID

orderNo

string

UPay order number

merchantOrderNo

string

Merchant order number

exchangeRate

string

Fiat currency exchange rate when placing order

crypto

string

Order amount, unit USDT / PYUSD

status

string

Order status, for details, see: [Order Status](https://docs.upay.ink/api/order/order-inquiry#order-status)

payUrl

string

Cashier address, merchants can jump directly to this address for users to pay.

[PreviousPublic Parameters](https://docs.upay.ink/api/introduction/public-parameters) [NextOrder Inquiry](https://docs.upay.ink/api/order/order-inquiry)

Last updated 4 months ago

* * *
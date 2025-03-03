URL: https://docs.upay.ink/api/introduction/signature
---
## [Direct link to heading](https://docs.upay.ink/api/introduction/signature\#general-steps-for-signature-generation)    General steps for signature generation:

1. Assume that all data sent or received is a set M, and the parameters that **need to be signed** in the set M are sorted from small to large according to the ASCII code of the parameter name (lexicographic order), using the format of URL key-value pairs (i.e. key1=value1&key2=value2… ) are spliced into a string stringA.

2. Splice `&appSecret=key` at the end of stringA to get the stringSignTemp string, perform an MD5 operation on stringSignTemp, and then convert all characters in the string to uppercase to get the signature value.


## [Direct link to heading](https://docs.upay.ink/api/introduction/signature\#important-rules-to-note)    Important Rules to Note

- Parameter name ASCII codes are sorted from small to large (lexicographic order);

- Parameter names are case-sensitive;

- The transmitted signature parameter does not participate in the signature, and the generated signature is verified against the signature value;

- The interface may add fields, and the added extension fields must be supported when verifying signatures.


## [Direct link to heading](https://docs.upay.ink/api/introduction/signature\#example-php)    Example(PHP)

For example, the parameters passed are as follows:

Copy

```inline-grid min-w-full grid-cols-[auto_1fr] p-2 [count-reset:line]
appId: 12345
chainType: 1
merchantOrderNo: 123123123123
productName：Goods
```

Step 1: Remove the parameters that do **not need to be signed**, follow the key=value format for the parameters that **need to be signed**, and sort them in ASCII dictionary order as follows:

Copy

```inline-grid min-w-full grid-cols-[auto_1fr] p-2 [count-reset:line] whitespace-pre-wrap
$stringA = 'appId=12345&chainType=1&merchantOrderNo=123123123123';
```

Step 2: Splice &appSecret=key to the string in the previous step:

Copy

```inline-grid min-w-full grid-cols-[auto_1fr] p-2 [count-reset:line] whitespace-pre-wrap
$stringSignTemp = $stringA.'&appSecret=Key';
```

Step 3: Perform the md5 value operation on the string in the previous step:

Copy

```inline-grid min-w-full grid-cols-[auto_1fr] p-2 [count-reset:line] whitespace-pre-wrap
$signature = md5($stringSignTemp);
```

Step 4: Convert the above md5 value to uppercase:

Copy

```inline-grid min-w-full grid-cols-[auto_1fr] p-2 [count-reset:line]
$signature = strtoupper($signature);
```

[PreviousSecurity Notes](https://docs.upay.ink/api/introduction/security) [NextPublic Parameters](https://docs.upay.ink/api/introduction/public-parameters)

Last updated 1 year ago

* * *
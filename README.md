Express Statuses
================

A very simple collection of statuses suitable to be used with the
[express-errorlog](https://www.npmjs.com/package/express-errorlog) package.

* [Install and use](#install-and-use)
* [Statuses](#statuses)
  * [Getting Statuses](#getting-statuses)
  * Overriding [Messages](#messages)
  * Wrapping [Errors](#errors)
  * [Multiple overrides](#multiple-overrides)
* [License (MIT)](#license-mit-)



Install and use
---------------

Install as usual with _NPM_:

```bash
npm install --save express-statuses
```

Then use it in your express app!

```javascript
var S = require('express-statuses');
...
app.get('/foobar', function(req, res, next) {
  next(S.BAD_REQUEST);
})
```

The application error handler will see an object containing the following:

```javascript
app.use(function(err, req, res, next) {
  // err will be { status: 400, message: 'Bad Request' }
  ...
})
```

#### Getting statuses

Statuses can be referenced by name:

```javascript
S.NOT_FOUND;
```

Or can be accessed by status code:

```javascript
S(404);
```

All returned statuses can be passed to `next(...)` as-is or (being functions)
can be used to further customize what is passed to the error handler.

Customization and inclusion can be done in few ways:

#### Messages

Messages can be overridden by simply invoking a status as a function:

```javascript
next(S.NOT_FOUND('Something is amiss'));
```

will result in the error handler receiving the following as its first parameter:

```json
{
  "status": 404,
  "message": "Something is amiss"
}
```

#### Errors

Errors can be nested for further logging by the error handler:

```javascript
try {
  ...
} catch (error) {
  next(S.BAD_REQUEST(error));
}
```

will result in the error handler receiving the following as its first parameter:

```javascript
{
  "status": 400,
  "message": "Bad Request"
  "error": ... // reference to the error for logging
}
```

#### Multiple overrides

For better [express-errorlog](https://www.npmjs.com/package/express-errorlog)
integration, a number of parameters can be specified as options:

```javascript
next(S.UNAUTHORIZED({
  message: 'No way I am letting you in',
  details: { key: 'Some extra stuff here' }
  error: myCaughtException
}));
```

will result in the error handler receiving the following as its first parameter:

```javascript
{
  "status": 400,
  "message": "No way I am letting you in",
  "details": { "key": "Some extra stuff here" }
  "error": // reference to myCaughtException
}
```


Statuses
---------

Listed here are all currently configured statuses:

* Informational
  * `CONTINUE`: 100
  * `SWITCHING_PROTOCOLS`: 101
  * `PROCESSING`: 102
* Successful
  * `OK`: 200
  * `CREATED`: 201
  * `ACCEPTED`: 202
  * `NON_AUTHORITATIVE_INFORMATION`: 203
  * `NO_CONTENT`: 204
  * `RESET_CONTENT`: 205
  * `PARTIAL_CONTENT`: 206
  * `MULTI_STATUS`: 207
  * `ALREADY_REPORTED`: 208
  * `IM_USED`: 226
* Redirection
  * `MULTIPLE_CHOICES`: 300
  * `MOVED_PERMANENTLY`: 301
  * `FOUND`: 302
  * `SEE_OTHER`: 303
  * `NOT_MODIFIED`: 304
  * `USE_PROXY`: 305
  * `_UNUSED_`: 306
  * `TEMPORARY_REDIRECT`: 307
  * `PERMANENT_REDIRECT`: 308
* Client Errors
  * `BAD_REQUEST`: 400
  * `UNAUTHORIZED`: 401
  * `PAYMENT_REQUIRED`: 402
  * `FORBIDDEN`: 403
  * `NOT_FOUND`: 404
  * `METHOD_NOT_ALLOWED`: 405
  * `NOT_ACCEPTABLE`: 406
  * `PROXY_AUTHENTICATION_REQUIRED`: 407
  * `REQUEST_TIMEOUT`: 408
  * `CONFLICT`: 409
  * `GONE`: 410
  * `LENGTH_REQUIRED`: 411
  * `PRECONDITION_FAILED`: 412
  * `PAYLOAD_TOO_LARGE`: 413
  * `URI_TOO_LONG`: 414
  * `UNSUPPORTED_MEDIA_TYPE`: 415
  * `RANGE_NOT_SATISFIABLE`: 416
  * `EXPECTATION_FAILED`: 417
  * `I_AM_A_TEAPOT`: 418
  * `UNPROCESSABLE_ENTITY`: 422
  * `LOCKED`: 423
  * `FAILED_DEPENDENCY`: 424
  * `UNORDERED_COLLECTION`: 425
  * `UPGRADE_REQUIRED`: 426
  * `PRECONDITION_REQUIRED`: 428
  * `TOO_MANY_REQUESTS`: 429
  * `REQUEST_HEADER_FIELDS_TOO_LARGE`: 431
  * `UNAVAILABLE_FOR_LEGAL_REASONS`: 451
* Server Errors
  * `INTERNAL_SERVER_ERROR`: 500
  * `NOT_IMPLEMENTED`: 501
  * `BAD_GATEWAY`: 502
  * `SERVICE_UNAVAILABLE`: 503
  * `GATEWAY_TIMEOUT`: 504
  * `HTTP_VERSION_NOT_SUPPORTED`: 505
  * `VARIANT_ALSO_NEGOTIATES`: 506
  * `INSUFFICIENT_STORAGE`: 507
  * `LOOP_DETECTED`: 508
  * `BANDWIDTH_LIMIT_EXCEEDED`: 509
  * `NOT_EXTENDED`: 510
  * `NETWORK_AUTHENTICATION_REQUIRED`: 511






License (MIT)
-------------

Copyright (c) 2015 USRZ.com and Pier Paolo Fumagalli

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.


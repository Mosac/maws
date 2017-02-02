> utilities for aws lambda function.

## String to Ziped base64

```js
import {Zlib} from "maws";
```

* Compress

```js
Zlib.toBase64("string");
```

* Decompress

```js
Zlib.toString("{base64string}");
```

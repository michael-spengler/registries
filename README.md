# Registries
This module helps to synchronize Deno registries - e.g. https://deno.land and https://nest.land

## Usage Example

```ts
import { ModuleInfoProvider } from 'https://deno.land/x/registries/module-info-provider.ts'

const repository = await ModuleInfoProvider.getRepository('sleep')

console.log(repository)
```

## Contributions
Contributions are welcome.

import { Request } from 'https://deno.land/x/request@1.3.0/request.ts'
import { Persistence } from "https://deno.land/x/persistence@1.1.0/persistence.ts"

const nestLandModules = await Request.get('https://x.nest.land/api/packages/')

console.log(nestLandModules.length)

await Persistence.saveToLocalFile("./synch-deno-registries/nest.land-modules.json", JSON.stringify(nestLandModules))

// tbd
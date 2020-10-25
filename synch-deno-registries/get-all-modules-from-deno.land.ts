import { Request } from 'https://deno.land/x/request@1.3.0/request.ts'
import { sleep } from "https://deno.land/x/sleep/mod.ts";
import { Persistence } from "https://deno.land/x/persistence@1.1.0/persistence.ts"
import { ModuleInfoProvider } from "../module-info-provider.ts"

let numberOfPagesToBeProcessed = 12
let limitPerPageAnyhowMax100 = 100

const baseURL = "https://api.deno.land/modules?limit=limitPerPage&page=pageNumber"


interface IDenoModuleResult {
    name: string,
    description: string,
    star_count: number
}

interface IDenoModulesWithRepo {
    repository: string,
    denoModuleResult: IDenoModuleResult
}

let allResults: IDenoModuleResult[] = []


while (numberOfPagesToBeProcessed > 0) {
    const url = baseURL
                .replace("limitPerPage", limitPerPageAnyhowMax100.toString())
                .replace("pageNumber", numberOfPagesToBeProcessed.toString())

    console.log(`request url: ${url}`)
    const result = await Request.get(url)
    allResults = allResults.concat(result.data.results)
    await sleep(10)
    numberOfPagesToBeProcessed--
}

await Persistence.saveToLocalFile("./synch-deno-registries/deno-modules-without-repo.json", JSON.stringify(allResults))


// const denoModulesWithRepo: IDenoModulesWithRepo[] = []

// for (const result of allResults) {
//     console.log(`adding repository for ${result.name}`)
//     const denoModuleWithRepo: IDenoModulesWithRepo = {
//         denoModuleResult: result,
//         repository: await ModuleInfoProvider.getRepository(result.name)
//     }

//     await sleep(2)

//     denoModulesWithRepo.push(denoModuleWithRepo)
// }

// await Persistence.saveToLocalFile("./synch-deno-registries/deno-modules-with-repo.json", JSON.stringify(denoModulesWithRepo))



// deno run --allow-net --unstable --allow-read --allow-write synch-deno-registries/get-all-modules-from-deno.land.ts 
// https://api.deno.land/modules/lodash
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

// let allResults: IDenoModuleResult[] = []


// while (numberOfPagesToBeProcessed > 0) {
//     const url = baseURL
//                 .replace("limitPerPage", limitPerPageAnyhowMax100.toString())
//                 .replace("pageNumber", numberOfPagesToBeProcessed.toString())

//     console.log(`request url: ${url}`)
//     const result = await Request.get(url)
//     allResults = allResults.concat(result.data.results)
//     await sleep(10)
//     numberOfPagesToBeProcessed--
// }

// await Persistence.saveToLocalFile("./synch-deno-registries/deno-modules-without-repo.json", JSON.stringify(allResults))

const allResults: IDenoModuleResult[] = JSON.parse(await Persistence.readFromLocalFile("./synch-deno-registries/deno-modules-without-repo.json"))
const alreadyCompletedResults: IDenoModulesWithRepo[] = JSON.parse(await Persistence.readFromLocalFile("./synch-deno-registries/deno-modules-with-repo.json"))

console.log(`allResults.length: ${allResults.length}`)
console.log(`alreadyCompletedResults.length: ${alreadyCompletedResults.length}`)

const denoModulesWithRepo: IDenoModulesWithRepo[] = []

for (const result of allResults) {
    console.log(`adding repository for ${result.name}`)

    const existingAlready = alreadyCompletedResults.filter((e: IDenoModulesWithRepo) => e.denoModuleResult.name === result.name)[0]
    if (existingAlready === undefined) {
        try {
            const denoModuleWithRepo: IDenoModulesWithRepo = {
                denoModuleResult: result,
                repository: await ModuleInfoProvider.getRepository(result.name)
            }

            await sleep(7)

            denoModulesWithRepo.push(denoModuleWithRepo)

            await Persistence.saveToLocalFile("./synch-deno-registries/deno-modules-with-repo.json", JSON.stringify(denoModulesWithRepo))
        } catch (error) {
            console.log(error.message)
        }
    } else {
        denoModulesWithRepo.push(existingAlready)
    }
}




// deno run --allow-net --unstable --allow-read --allow-write synch-deno-registries/get-all-modules-from-deno.land.ts 
// https://api.deno.land/modules/lodash
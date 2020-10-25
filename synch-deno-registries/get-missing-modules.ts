import { Persistence } from "https://deno.land/x/persistence@1.1.0/persistence.ts"

export async function getModulesMissingInDenoLand() {
    const modulesInDenoLand = JSON.parse(await Persistence.readFromLocalFile("./synch-deno-registries/deno-modules-with-repo.json"))
    const modulesInNestLand = JSON.parse(await Persistence.readFromLocalFile("./synch-deno-registries/nest.land-modules.json"))

    const missing = []
    for (const moduleInDeno of modulesInDenoLand) {
        if (modulesInNestLand.filter((m: any) => m.name === moduleInDeno.name)[0] === undefined) {
            missing.push(moduleInDeno)
        }
    }
    return missing
}

export async function getModulesMissingInNestLand() {

    const modulesInDenoLand = JSON.parse(await Persistence.readFromLocalFile("./synch-deno-registries/deno-modules-with-repo.json"))
    const modulesInNestLand = JSON.parse(await Persistence.readFromLocalFile("./synch-deno-registries/nest.land-modules.json"))

    const missing = []
    const eggsForMissingModules = []

    for (const moduleInDeno of modulesInDenoLand) {
        if (modulesInNestLand.filter((m: any) => m.name === moduleInDeno.denoModuleResult.name)[0] === undefined) {
            missing.push(moduleInDeno)
            const eggJSON = {
                name: moduleInDeno.denoModuleResult.name,
                description: moduleInDeno.denoModuleResult.description,
                homepage: moduleInDeno.repository,
                files: [
                    "./**/*.ts",
                    "README.md"
                ],
                entry: "./mod.ts"
            }
            eggsForMissingModules.push(eggJSON)
            console.log(eggJSON)
        }
    }

    await Persistence.saveToLocalFile("./synch-deno-registries/modules-missing-on-nest.land.json", JSON.stringify(missing))
    await Persistence.saveToLocalFile("./synch-deno-registries/eggs-for-missing-modules.json", JSON.stringify(eggsForMissingModules))

    console.log(missing.length)

    return missing
}

getModulesMissingInNestLand()


// deno run --allow-read --allow-write synch-deno-registries/get-missing-modules.ts 


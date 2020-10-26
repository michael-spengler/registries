
import { Persistence } from "https://deno.land/x/persistence@1.1.0/persistence.ts"
import { sleep } from "https://deno.land/x/sleep/mod.ts";
import { GitHubReader } from "https://deno.land/x/cicd@v0.8.3/github-api/reader.ts";
import { GitHubWriter } from "https://deno.land/x/cicd@v0.8.3/github-api/writer.ts";
import { ForkHandler } from "https://deno.land/x/cicd@v0.8.3/github-api/fork-handler.ts";
import * as base64 from "https://denopkg.com/chiefbiiko/base64/mod.ts";

export async function autocreatePR(token: string) {

    const eggsToBePublished: any[] = JSON.parse(await Persistence.readFromLocalFile("./synch-deno-registries/eggs-for-missing-modules.json"))
    console.log(`${eggsToBePublished.length} eggs waiting for breeding in nest.land`)

    for (const egg of eggsToBePublished) {
        const repo = egg.homepage.split('https://github.com/')[1] as string
        if (repo !== 'michael-spengler/ethereum'){
            continue
        }
        await sleep(5)
        const resultEggJSON = await GitHubReader.getFile(token, repo, 'egg.json')
        const resultModTS = await GitHubReader.getFile(token, repo, 'mod.ts')

        if (resultEggJSON.message === 'Not Found' && resultModTS.message === undefined) {

            console.log(egg.name)

            let fileTargetRepo
            if (repo.includes('michael-spengler')) {
                fileTargetRepo = repo
            } else {
                fileTargetRepo = await ForkHandler.createFork(token, repo)
            }
            if (fileTargetRepo.includes('michael-spengler')) {
                await addEggJSON(token, fileTargetRepo, egg)
                await addWorkflowFile(token, fileTargetRepo)
                console.log(`check it out: https://github.com/${repo}`)
            } else {
                console.log(`you might check this: ${fileTargetRepo}`)
            }
        }
    }
}


async function addEggJSON(token: string, repo: string, egg: any) {

    const b64: string = base64.fromUint8Array(new TextEncoder()
        .encode(`{
                                "name": "${egg.name}",
                                "description": "${egg.description}",
                                "homepage": "${egg.homepage}",
                                "files": [
                                  "./**/*.ts",
                                  "README.md"
                                ],
                                "entry": "./mod.ts"
                              }`))

    const body = {
        message: "automatically adding egg.json",
        content: b64
    }

    const writingResult = await GitHubWriter.writeFile(token, repo, 'egg.json', body)

    console.log(`egg.json writingResult: ${writingResult}`)
}

async function addWorkflowFile(token: string, repo: string) {

    const file = await Deno.open('./synch-deno-registries/workflow-template.yml');
    const decoder = new TextDecoder('utf-8');
    const text = decoder.decode(await Deno.readAll(file));

    // console.log(text);

    const b64: string = base64.fromUint8Array(new TextEncoder().encode(text));

    const body = {
        message: "automatically adding workflow file",
        content: b64
    }

    const writingResult = await GitHubWriter.writeFile(token, repo, '.github/workflows/publish-to-nest.land.yml', body)

    console.log(writingResult)
}

const token = Deno.args[0] as string

autocreatePR(token)


// https://developer.github.com/v3/repos/contents/#create-or-update-file-contents

// https://developer.github.com/v3/repos/contents/#create-or-update-file-contents <your github token>

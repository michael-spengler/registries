import { Request } from 'https://deno.land/x/request@1.3.0/request.ts'

export class ModuleInfoProvider {

    public static async getLatestVersion(moduleName: string): Promise<string> {
        const url = `https://cdn.deno.land/${moduleName}/meta/versions.json`

        return (await Request.get(url)).latest
    }

    public static async getRepository(moduleName: string): Promise<string> {
        const latestVersion = await ModuleInfoProvider.getLatestVersion(moduleName)
        const url = `https://cdn.deno.land/${moduleName}/versions/${latestVersion}/meta/meta.json`
        const moduleInfo = await Request.get(url)
        if (moduleInfo.upload_options.type === 'github') {
            return `https://github.com/${moduleInfo.upload_options.repository}`
        }
        console.log(`you should check module type ${moduleInfo.type}`)
        return ''
    }
}


// https://cdn.deno.land/lodash/versions/4.17.19/meta/meta.json - result contains repo


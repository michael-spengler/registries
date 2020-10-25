import { ModuleInfoProvider } from './module-info-provider.ts'
import { assertEquals } from "https://deno.land/std@0.74.0/testing/asserts.ts";

Deno.test("get repository", async (): Promise<void> => {
    const repository = await ModuleInfoProvider.getRepository('sleep')

    assertEquals('https://github.com/michael-spengler/sleep', repository)
});

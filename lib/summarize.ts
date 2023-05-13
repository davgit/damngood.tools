import { loadSummarizationChain } from "langchain/chains"
import { CheerioWebBaseLoader } from "langchain/document_loaders/web/cheerio"
import { OpenAI } from "langchain/llms/openai"
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter"

const model = new OpenAI({
    temperature: 0,
    modelName: "gpt-3.5-turbo",
    openAIApiKey: process.env.OPENAI_API_KEY,
})

export async function generateSummary(url: string) {
    const loader = new CheerioWebBaseLoader(url)
    
    const textSplitter = new RecursiveCharacterTextSplitter({ chunkSize: 1000 });
    const docs = await textSplitter.splitDocuments(await loader.load());

    const chain = loadSummarizationChain(model, { type: "map_reduce" })
    const res = await chain.call({
        input_documents: docs,
    })

    if (res && res.text) {
        return res.text
    }

    return null
}
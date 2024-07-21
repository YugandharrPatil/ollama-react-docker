import type { Chat } from "@/App";
import { Ollama } from "ollama";

const PORT = "http://65.2.187.29:11434";

const ollama = new Ollama({ host: PORT });

export default async function askLlama3(prompt: string, prevContext: Chat[]) {
	try {
		const response = await ollama.chat({
			model: "llama3",
			messages: [...prevContext, { role: "user", content: prompt }],
		});
		return response.message.content;
	} catch (err) {
		console.log(err);
	}
}

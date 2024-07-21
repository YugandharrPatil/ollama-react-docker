// HOOKS
import { useState } from "react";

// FORM
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

// UI
import { Loader2 } from "lucide-react";
import { Button } from "./components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./components/ui/form";
import { Input } from "./components/ui/input";
// UTILITY

// UTILITY
import askLlama3 from "./snippets/call";

const formSchema = z.object({
	prompt: z.string().min(1, { message: "Please enter a message..." }),
});

// TYPES
export type Chat = { role: string; content: string };

export default function App() {
	const [convo, setConvo] = useState<Chat[]>([]);
	const [resReceived, setResReceived] = useState(true);

	// useEffect(() => {
	// 	console.log("re-render");
	// }, [convo]);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			prompt: "",
		},
	});

	const { reset } = form;

	async function onSubmit(data: z.infer<typeof formSchema>) {
		console.log(prompt);
		reset();
		// convo.push({ role: "user", content: data.prompt });
		// const res = await askLlama3(data.prompt);
		// console.log(res);
		// convo.push({ role: "assistant", content: res as string });
		// console.log("done!");
		setConvo((prevConvo) => [...prevConvo, { role: "user", content: data.prompt }]);
		console.log("prompt added", convo);
		setResReceived(false);
		const res = await askLlama3(data.prompt, convo);
		setResReceived(true);
		console.log(res);
		setConvo((prevConvo) => [...prevConvo, { role: "assistant", content: res as string }]);
		console.log("res added", convo);
	}

	return (
		<main className="max-w-5xl mt-10 mx-auto">
			<div className="text-center">
				<h1 className="text-xl font-bold">Chat with Llama3, Meta AI's latest and best model</h1>
				<h3 className="font-bold">No limits, chat unlimited!</h3>
				<p>it's super slow becuz i'm too poor to afford a GPU in the cloud...but yeah unlimited :)</p>
			</div>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
					<FormField
						control={form.control}
						name="prompt"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Prompt</FormLabel>
								<FormControl>
									<Input placeholder="Type a message..." {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<Button disabled={!resReceived} type="submit">
						{!resReceived && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} {resReceived ? "Submit" : "fetching response..."}
					</Button>
				</form>
			</Form>
			{convo &&
				convo.map((message, index) => (
					<p className="my-3" key={index}>
						<span className="font-bold">{message.role}: </span>
						{message.content}
					</p>
				))}
			{/* {convo && convo.content} */}
		</main>
	);
}

// TODO: implement zustand to persist state at a top level to access it in both in here and call.ts to have access to convo history...

import { connectToDb } from "@/db";
import { Tree } from "@/models/Tree";

export const GET = async (req: Request): Promise<Response> => {
	await connectToDb();
	const trees = await Tree.find();
	return new Response(JSON.stringify(trees), { status: 200 });
};

export const POST = async (req: Request): Promise<Response> => {
	await connectToDb();
	const treeData = await req.json();
	const tree = new Tree(treeData);
	const savedDoc = await tree.save();
	return new Response(JSON.stringify(savedDoc), { status: 200 });
};

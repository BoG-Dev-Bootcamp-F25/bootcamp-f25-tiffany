import { connectToDb } from "@/db";
import { Tree } from "@/models/Tree";

export const GET = async (req: Request, ctx: RouteContext<'/api/tree/[id]'>): Promise<Response> => {
	await connectToDb();
	const { id } = await ctx.params;
	const tree = await Tree.findById(id);
	return new Response(JSON.stringify(tree), { status: tree ? 200 : 404 });
};

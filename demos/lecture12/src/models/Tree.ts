import mongoose, { InferSchemaType, Model, Schema, model, models } from "mongoose";

const treeSchema = new Schema({
	treeType: {
		type: String,
		required: true,
	},
	location: {
		latitude: {
			type: Number,
		},
		longitude: {
			type: Number,
		}
	},
	initalHeight: {
		type: Number,
		required: true,
	},
	date: { type: Date, default: Date.now },
	planter: String,
});

export const Tree: Model<InferSchemaType<typeof treeSchema>> = models.Tree ?? model('Tree', treeSchema);

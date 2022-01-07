import {
	BelongsToGetAssociationMixin,
	BelongsToSetAssociationMixin,
	DataTypes,
	Model,
	Optional
} from 'sequelize';
import sequelize from '@src/db/sequelize';
import { User } from './User';
import { Review } from './Review';

interface CommentReviewAttributes {
	id: number;
	reviewId: number;
	message: string;
	commenterId: string; //userId
}

interface CommentReviewCreationAttributes
	extends Optional<CommentReviewAttributes, 'id'> {}

export class CommentReview extends Model<
	CommentReviewAttributes,
	CommentReviewCreationAttributes
> {
	id!: number;
	reviewId!: number;
	message!: string;
	commenterId!: string;

	getReview!: BelongsToGetAssociationMixin<Review>;
	setReview!: BelongsToSetAssociationMixin<Review, number>;

	getCommenter!: BelongsToGetAssociationMixin<User>;
	setCommenter!: BelongsToSetAssociationMixin<User, number>;
}

CommentReview.init(
	{
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true
		},
		reviewId: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		message: {
			type: DataTypes.STRING,
			allowNull: false
		},
		commenterId: {
			type: DataTypes.INTEGER,
			allowNull: false
		}
	},
	{ sequelize, tableName: 'commentReview' }
);

CommentReview.belongsTo(Review, {
	foreignKey: 'reviewId',
	targetKey: 'id',
	as: 'review'
});

CommentReview.belongsTo(User, {
	foreignKey: 'commenterId',
	targetKey: 'id',
	as: 'commenter'
});

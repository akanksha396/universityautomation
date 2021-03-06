const { client } = require("../config/prisma-config");
const asyncHandler = require("../middleware/async");
const { User } = require("../models/user/user.model");
const UserLessonCreateDto = require("../models/userlesson/dtos/create-userlesson.dto");
const ErrorResponse = require("../utils/ErrorResponse");

exports.create = asyncHandler(async (req, res, next) => {
	const userModel = new User(req.body);
	userModel.hashPassword();
	userModel.assignInformations();
	console.log(userModel);
	const created = await client.user.create({
		data: {
			firstName: userModel.firstName,
			lastName: userModel.lastName,
			email: userModel.email,
			status: userModel.status,
			role: userModel.role,
			pwdHash: userModel.pwdHash,
			pwdSalt: userModel.pwdSalt,
			departmentId: userModel.departmentId,
		},
	});
	if (userModel.departmentId && !userModel.role === "ADMIN") {
		await client.userDepartment.create({
			data: {
				userId: created.id,
				departmentId: userModel.departmentId,
			},
		});
	}

	res.status(200).json({
		success: true,
	});
});

exports.getById = asyncHandler(async (req, res, next) => {
	const id = parseInt(req.params.id);

	const user = await client.user.findUnique({
		where: {
			id: id,
		},
		select: {
			id: true,
			firstName: true,
			lastName: true,
			status: true,
			email: true,
		},
	});

	res.status(200).json({
		data: user,
		success: true,
	});
});

exports.getAll = asyncHandler(async (req, res, next) => {
	const departmentId = parseInt(req.params.id);

	console.log("GELEN ID : " + req.params.id);

	const users = await client.department.findMany({
		where: {
			id: departmentId,
		},
		select: {
			id: true,
			name: true,
			userDepartments: {
				select: {
					user: {
						select: {
							id: true,
							firstName: true,
							lastName: true,
							status: true,
							email: true,
						},
					},
				},
			},
		},
	});

	res.status(200).json({
		data: users,
		success: true,
	});
});

exports.getStudents = asyncHandler(async (req, res, next) => {
	const users = await client.user.findMany({
		where:{
            role:'STUDENT'
        },
        select: {
			id: true,
			firstName: true,
			lastName: true,
			status: true,
			email: true,
			role: true,
		},
	});

	res.status(200).json({
		data: users,
		success: true,
	});
});

exports.getTeachers = asyncHandler(async (req, res, next) => {
	const users = await client.department.findMany({
		where:{
            role:'STUDENT'
        },
        select: {
			id: true,
			firstName: true,
			lastName: true,
			status: true,
			email: true,
			role: true,
		},
	});

	res.status(200).json({
		data: users,
		success: true,
	});
});

exports.updateById = asyncHandler(async (req, res, next) => {
	const id = parseInt(req.params.id);

	const userModel = new User(req.body);

	const updated = await client.user.update({
		where: {
			id: id,
		},
		data: userModel,
	});

	res.status(200).json({
		success: true,
		data: updated,
	});
});

exports.deleteById = asyncHandler(async (req, res, next) => {
	const id = parseInt(req.params.id);

	const deleted = await client.user.delete({
		where: {
			id: id,
		},
	});

	res.status(200).json({
		success: true,
		message: `${deleted.name} ba??ar??yla silindi.`,
	});
});

exports.getJoinedLessons = asyncHandler(async (req, res, next) => {
	const userId = req.user.id;

	const lessons = await client.userLesson.findMany({
		where: {
			userId: userId,
		},
		select: {
			season: true,
			average: true,
			lesson: {
				select: {
					code: true,
					credit: true,
					name: true,
					status: true,
				},
			},
			userId: true,
		},
	});

	res.status(200).json({
		success: true,
		data: lessons,
	});
});

exports.getUserLessons = asyncHandler(async (req, res, next) => {
	const userId = req.params.id;

	console.log("Query Id : "+ userId);

	const lessons = await client.userLesson.findMany({
		where: {
			userId: parseInt(userId),
		},
		select: {
			id:true,
			season: true,
			average: true,
			lesson: {
				select: {
					code: true,
					credit: true,
					name: true,
					status: true,
				},
			},
			userId: true,
		},
	});

	res.status(200).json({
		success: true,
		data: lessons,
	});
});

exports.joinOpenedLesson = asyncHandler(async (req, res, next) => {
	const lessonId = req.body.id;
	const userId = req.user.id;

	const lesson = await client.userLesson.findUnique({
		select: {
			lesson: {
				select: {
					code: true,
					credit: true,
					name: true,
					status: true,
					id: true,
				},
				where: {
					id: lessonId,
				},
			},
		},
	});

	if (lesson.status != "OPEN") {
		return next(
			new ErrorResponse("A????k olmayan bir derse giremezsiniz.", 400)
		);
	}

	const userLesson = new UserLessonCreateDto(req.body);
	userLesson.userId = userId;

	res.status(200).json({
		success: true,
		data: lesson,
	});
});

exports.leaveOpenedLesson = asyncHandler(async (req, res, next) => {
	const userLessonId = req.body.id;

	const lesson = await client.userLesson.findUnique({
		select: {
			id: true,
			where: {
				id: userLessonId,
			},
		},
	});

	if (lesson.status != "OPEN") {
		return next(
			new ErrorResponse("A????k olmayan bir dersten ????kamazs??n??z.", 400)
		);
	}

	const userLesson = new UserLessonCreateDto(req.body);
	userLesson.userId = userId;

	res.status(200).json({
		success: true,
		data: lesson,
	});
});

const { client } = require("../config/prisma-config");
const asyncHandler = require("../middleware/async");
const { Exam } = require('../models/Exam/exam.model');

exports.getById = asyncHandler(async (req, res, next) => {
    
    const userId = parseInt(req.user.id);
    const userlessonId = parseInt(req.params.id);

    const exam = await client.exam.findUnique({
        select: {
            type:true,
            score:true,
            announcementDate:true,
            UserLesson:{
                select:{
                    id:true,
                    user:{
                        select:{
                            firstName:true,
                            lastName:true,
                        }
                    },
                    lesson:{
                        select:{
                            name:true,
                            code:true,
                            credit:true
                        }
                    },
                }
            },
        },
        where: {
            id: userlessonId,
        },

    });

    res.status(200).json({
        success: true,
        data: exam,
    });

});

exports.getAll = asyncHandler(async (req, res, next) => {

    const userId = parseInt(req.user.id);

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const exams = await client.exam.findMany({
        select: {
            id:true,
            type:true,
            score:true,
            announcementDate:true,
            UserLesson:{
                select:{
                    user:{
                        select:{
                            firstName:true,
                            lastName:true,
                            id:true,
                        },
                    },
                    lesson:{
                        select:{
                            name:true,
                            code:true,
                            credit:true
                        }
                    }
                },
            },
        },
        where:{
            id:userId,
        },
        skip: skip,
        take: limit,
    });

    // TODO: pagination headers

    res.status(200).json({
        success: true,
        data: exams,
    });
});

exports.getAllStudentExams = asyncHandler(async (req, res, next) => {

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    console.log("BU METOD ??ALI??IYOR")

    const exams = await client.exam.findMany({
        select: {
            id:true,
            type:true,
            score:true,
            announcementDate:true,
            UserLesson:{
                select:{
                    user:{
                        select:{
                            firstName:true,
                            lastName:true,
                        },
                    },
                    lesson:{
                        select:{
                            name:true,
                            code:true,
                            credit:true
                        }
                    }
                },
            },
        },
        skip: skip,
        take: limit,
    });

    // TODO: pagination headers

    res.status(200).json({
        success: true,
        data: exams,
    });
});

exports.create = asyncHandler(async (req, res, next) => {
    const examModel=new Exam(req.body);
    //examModel.userLessonId = parseInt(req.params.id);
    console.log(req.body);

    const created = await client.exam.create({
        data:examModel
    });

    res.status(201).json({
        success:true,
        data:created
    })
});

exports.updateById = asyncHandler(async (req, res, next) => {
   
    const examId = parseInt(req.params.id);
    const examModel = new Exam(req.body);
    examModel.id=examId;
    console.log(examId)

    const updated = await client.exam.update({
        where: {
            id: examId,
        },
        data: examModel,
    });

    res.status(200).json({
        success: true,
        data: updated,
    });
    
});

exports.deleteById = asyncHandler(async (req, res, next) => {
    
    const examId = parseInt(req.params.id);

    const deleted = await client.exam.delete({
        where: {
            id: examId,
        },
    });

    res.status(200).json({
        success: true,
        message: `${deleted.type} ba??ar??yla silindi.`,
    })

});

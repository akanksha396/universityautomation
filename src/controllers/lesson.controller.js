const { client } = require('../config/prisma-config');
const asyncHandler = require('../middleware/async');
const { Lesson } = require('../models/lesson/lesson.model');
const ErrorResponse = require('../utils/ErrorResponse');

exports.getLessons = asyncHandler(async (req, res, next) => {

    const lessons = await client.Lesson.findMany({
        include:{
            department:{
                select:{
                    name:true,
                }
            }
        }
    });

    res.status(200).json({
        success:true,
        data:lessons,
        count:lessons.count
    });
});

exports.getLesson = asyncHandler(async (req, res, next) => {

    const lessonId=req.body.id;

    const lesson = await client.Lesson.findFirst({
        include:{
            department:{
                select:{
                    name:true,
                },
                where:{
                    id:lessonId
                }
            }
        }
    });

    if(lesson == null){
        return next(new ErrorResponse('Geçersiz ders'),400);
    }

    res.status(200).json({
        success:true,
        data:lesson,
    });
});

exports.DeleteLesson = asyncHandler(async (req, res, next) => {

    const lessonId=req.body.id;

    const deletedlesson = await client.Lesson.delete({
        where:{
            id:lessonId
        }
    });

    res.status(200).json({
        success:true,
        data:{},
    });
});

exports.UpdateLesson = asyncHandler(async (req, res, next) => {

    const lessonId=req.body.id;

    const lesson = await client.Lesson.findFirst({
        where:{
            id:lessonId,
        }
    });

    if(lesson ==null){
        return next(new ErrorResponse('Geçersiz ders'),400);
    }

    const UpdatedLesson= await client.lesson.update({
        where:{
            id:lessonId,
        },
        data:req.body,
    })
    /* TODO: This code can be improved */

    res.status(200).json({
        success:true,
        data:UpdatedLesson,
    });
});

exports.UpdateLesson = asyncHandler(async (req, res, next) => {

    const lessonId=req.body.id;

    const lesson = await client.Lesson.findFirst({
        where:{
            id:lessonId,
        }
    });

    if(lesson ==null){
        return next(new ErrorResponse('Geçersiz ders'),400);
    }

    const UpdatedLesson= await client.lesson.update({
        where:{
            id:lessonId,
        },
        data:req.body,
    })
    /* TODO: This code can be improved */

    res.status(200).json({
        success:true,
        data:UpdatedLesson,
    });
});

exports.CreateLesson = asyncHandler(async (req, res, next) => {

    //Code here
    
});